import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";

import { useUser } from "@clerk/clerk-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { useProblemById, useSubmitProblem, useSolvedProblem } from "../hooks/useProblems";
import { Loader2Icon } from "lucide-react";
import { useGetUser } from "../hooks/useUsers";

function ProblemPage() {
  const { id } = useParams();
  const { user } = useUser();
  const { data: userData } = useGetUser(user.id)
  
  const userz = userData?.user || []
  const level = userz?.level || ""

  const navigate = useNavigate();
  const [outputArr, setOutputArr] = useState(null);

  const [currentProblemId, setCurrentProblemId] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [solved, setSolved] = useState(false);

  const { data: problemsData, isLoadingProblemsData} = useSolvedProblem(user.id);
  const { data: problemId, isLoadingProblem} = useProblemById(id);

  const submitProblemMutation = useSubmitProblem();
  const errorData = problemsData !== undefined && problemId !== undefined

  const index = errorData ? problemsData.findIndex(p => p.problemId === problemId.problemId) : -1

  const resProb = index !== -1 ? problemsData.slice(index, index + 2) : [];
  const problem = errorData ? resProb[0] : problemId

  const nextProb = resProb && resProb.length ? (resProb[1] ? resProb[1].problemId : []) : [];

  // fetch problem from backend
  useEffect(() => {
    if (problem) {
      setCurrentProblemId(problem);
      if (problem?.saveLanguageUser){
        setSelectedLanguage(problem.saveLanguageUser);
      }else{
        setSelectedLanguage("python");
      }

      if (problem?.saveSourceCode){
        setCode(problem.saveSourceCode);
      }
      else{
        setCode(problem.starterCode.python);
      }

      setOutputArr([])
      setIsCorrect(null);
      setError(null);
      setSolved(problem.solved || null);
    }
  }, [problem]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    if (currentProblemId?.saveSourceCode && currentProblemId?.saveLanguageUser === newLang){
      setCode(currentProblemId.saveSourceCode);
    }else{
      setCode(currentProblemId.starterCode[newLang]);
    }
    setOutputArr([])
    setIsCorrect(null);
    setError(null);
    setSolved(problem.solved || null);
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    // normalize output for comparison (trim whitespace, handle different spacing)
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          // remove spaces after [ and before ]
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          // normalize spaces around commas to single space after comma
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutputArr([])
    setIsCorrect(null);
    setError(null);

    const hiddenInputs = currentProblemId.hiddenInputs;
    const expectedOutput = currentProblemId.expectedOutput[selectedLanguage].trim().split("\n")
    let allOutputs = [];
    let allErrors = []
    let allPassed = true;

    for (let i = 0; i < hiddenInputs.length; i++) {
      const inputData = hiddenInputs[i].replace(/\\n/g, "\n");
      const result = await executeCode(selectedLanguage, code, inputData);

      if (result.error && result.error.trim() !== "") {
        allErrors.push(result.error);
        allPassed = false;
        break;
      }

      const actualOutput = result.output.trim();
      allOutputs.push(actualOutput);

      const normalizedActual = normalizeOutput(actualOutput);
      const normalizedExpected = normalizeOutput(expectedOutput[i]);

      if (normalizedActual !== normalizedExpected) {
        allPassed = false;
      }
    }

    setOutputArr(allOutputs);
    setError(allErrors.join("\n"));
    setIsRunning(false);
    setIsCorrect(allPassed);


    if (allPassed) {
      triggerConfetti();
      toast.success("All test cases passed!");
      setSolved(true);
      submitProblemMutation.mutate({
        userId: user.id,
        problemId: id,
        solved: true,
        sourceCode: code,
        language: selectedLanguage
      });
    } else if (allErrors.length > 0) {
      toast.error("Code execution error!");
    } else {
      toast.error("Some test cases failed!");
    }
  };

  if (isLoadingProblem || isLoadingProblemsData)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="size-4 animate-spin" />Loading...
      </div>
    );

  if (!currentProblemId)
    return (
      <div className="flex justify-center items-center h-screen text-[60px] gap-2"><Loader2Icon className="size-16 animate-spin" />Loading...</div>
    );

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      {/* Responsive Panels */}
      <div className="flex-1 h-full">
        {/* Mobile: vertical stack */}
        <div className="md:hidden h-full">
          <PanelGroup direction="vertical">
            <Panel defaultSize={40} minSize={20}>
              <ProblemDescription
                problem={currentProblemId}
                currentProblemId={id}
                onProblemChange={handleProblemChange}
                allProblems={problemsData}
                solved={solved}
                level={level}
              />
            </Panel>

            <PanelResizeHandle className="h-1.5 md:h-2 bg-primary md:bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

            <Panel defaultSize={60} minSize={30}>
              <PanelGroup direction="vertical">
                <Panel defaultSize={70} minSize={30}>
                  <CodeEditorPanel
                    selectedLanguage={selectedLanguage}
                    code={code}
                    isRunning={isRunning}
                    onLanguageChange={handleLanguageChange}
                    onCodeChange={setCode}
                    onRunCode={handleRunCode}
                  />
                </Panel>

                <PanelResizeHandle className="h-1.5 md:h-2 bg-primary md:bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                <Panel defaultSize={30} minSize={20}>
                  <OutputPanel
                    output={outputArr}
                    error={error}
                    isCorrect={isCorrect}
                    solved={solved}
                    handleProblemChange={handleProblemChange}
                    nextProb={nextProb}
                  />
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>

        {/* Desktop: horizontal split */}
        <div className="hidden md:flex h-full">
          <PanelGroup direction="horizontal">
            <Panel defaultSize={40} minSize={30}>
              <ProblemDescription
                problem={currentProblemId}
                currentProblemId={id}
                onProblemChange={handleProblemChange}
                allProblems={problemsData}
                solved={solved}
                level={level}
              />
            </Panel>

            <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

            <Panel defaultSize={60} minSize={30}>
              <PanelGroup direction="vertical">
                <Panel defaultSize={70} minSize={30}>
                  <CodeEditorPanel
                    selectedLanguage={selectedLanguage}
                    code={code}
                    isRunning={isRunning}
                    onLanguageChange={handleLanguageChange}
                    onCodeChange={setCode}
                    onRunCode={handleRunCode}
                  />
                </Panel>

                <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                <Panel defaultSize={30} minSize={20}>
                  <OutputPanel
                    output={outputArr}
                    error={error}
                    isCorrect={isCorrect}
                    solved={solved}
                    handleProblemChange={handleProblemChange}
                    nextProb={nextProb}
                  />
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}

export default ProblemPage;
