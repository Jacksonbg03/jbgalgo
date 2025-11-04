import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { useProblems, useProblemById } from "../hooks/useProblems";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [outputArr, setOutputArr] = useState(null);

  const [currentProblemId, setCurrentProblemId] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const { data: problemsData, isLoadingProblemsData} = useProblems();
  const { data: problem, isLoadingProblem} = useProblemById(id);

  // fetch problem from backend
  useEffect(() => {
    if (problem) {
      setCurrentProblemId(problem);
      setSelectedLanguage("python");
      setCode(problem.starterCode.python);
      setOutputArr([])
      setIsCorrect(null);
      setError(null);
    }
  }, [problem]);

  

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblemId.starterCode[newLang]);
    setOutputArr([])
    setIsCorrect(null);
    setError(null);
  };

    // if (isLoadingProblem) return <p>Loading problem...</p>;
    // if (isErrorProblem) return <p>Failed to load problem.</p>;

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

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);

    return normalizedActual == normalizedExpected;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutputArr([])
    setIsCorrect(null);
    setError(null);

    const result = await executeCode(selectedLanguage, code);
    const res_split = result.output.trim().split("\n").filter(Boolean);
    console.log(result)
    console.log(res_split)
    const res_arr = res_split.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return line;
      }
    });
    setError(result.error || "");
    setOutputArr(res_arr || []);
    setIsRunning(false);

    if (result.error && result.error.trim() !== ""){
      toast.error("Your code has an error!");
      setIsCorrect(false);
    }

    // check if code executed successfully and matches expected output

    if (result.success) {
      const expectedOutput = currentProblemId.expectedOutput[selectedLanguage];
      const testsPassed = checkIfTestsPassed(result.output, expectedOutput);

      if (testsPassed) {
        triggerConfetti();
        toast.success("All tests passed! Great job!");
        setIsCorrect(true);
      } else {
        toast.error("Tests failed. Check your output!");
        setIsCorrect(false);
      }
    } else {
      toast.error("Code execution failed!");
      setIsCorrect(false);
    }
  };

  if (isLoadingProblem || isLoadingProblemsData) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!currentProblemId) return <div className="flex justify-center items-center h-screen text-[60px]">Loading...</div>;


  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* left panel- problem desc */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblemId}
              currentProblemId={id}
              onProblemChange={handleProblemChange}
              allProblems={problemsData}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel - Code editor */}
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

              {/* Bottom panel - Output Panel*/}

              <Panel defaultSize={30} minSize={30}>
                <OutputPanel output={outputArr} error={error} isCorrect={isCorrect}/>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
