import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";

import { useUser } from "@clerk/clerk-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { useProblemById, useSubmitProblem, useSolvedProblem } from "../hooks/useProblems";
import { Loader2Icon } from "lucide-react";
import { useGetUser } from "../hooks/useUsers";
import { problemsApi } from "../api/problems";

// output panel height (% of the editor column) once code has been run
const OUTPUT_SIZE_AFTER_RUN = 45;
// autosave this long after the student stops typing
const DRAFT_SAVE_DELAY_MS = 1000;

// code typed in this browser session, so switching language or coming back to a problem keeps the latest code
const sessionDrafts = new Map(); // "problemId:language" -> code

// latest code for a problem in a language: this session's typing, then the newer of draft / last run, then the starter
function codeFor(problem, language) {
  const local = sessionDrafts.get(`${problem.problemId}:${language}`);
  if (local !== undefined) return local;
  const draft = problem.drafts?.[language];
  const saved = problem.saveLanguageUser === language && problem.saveSourceCode ? problem.saveSourceCode : null;
  if (draft && (!saved || new Date(draft.updatedAt) >= new Date(problem.savedAt || 0))) return draft.code;
  if (saved) return saved;
  return problem.starterCode?.[language] || "";
}

// the language the student last worked in on this problem
function lastLanguage(problem, fallback) {
  let language = null;
  let at = -Infinity;
  for (const [lang, draft] of Object.entries(problem.drafts || {})) {
    const t = new Date(draft.updatedAt).getTime();
    if (t > at) [language, at] = [lang, t];
  }
  if (problem.saveLanguageUser && new Date(problem.savedAt || 0).getTime() > at) language = problem.saveLanguageUser;
  return language || fallback;
}

function ProblemPage() {
  const { id } = useParams();
  const { user } = useUser();
  const { data: userData } = useGetUser(user.id)
  
  const userz = userData?.user || []

  const navigate = useNavigate();
  const [outputArr, setOutputArr] = useState(null);
  // pass/fail per test case from the server: { tests: [true, false, ...], total }
  const [testInfo, setTestInfo] = useState(null);

  const [currentProblemId, setCurrentProblemId] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [solved, setSolved] = useState(false);
  const desktopOutputRef = useRef(null);
  const mobileOutputRef = useRef(null);

  const { data: problemsData, isLoadingProblemsData} = useSolvedProblem(user.id);
  const { data: problemId, isLoadingProblem, isError: problemNotFound } = useProblemById(id);

  const submitProblemMutation = useSubmitProblem();
  const errorData = problemsData !== undefined && problemId !== undefined

  const index = errorData ? problemsData.findIndex(p => p.problemId === problemId.problemId) : -1

  const resProb = index !== -1 ? problemsData.slice(index, index + 2) : [];
  const problem = errorData ? resProb[0] : problemId

  const nextProb = resProb && resProb.length ? (resProb[1] ? resProb[1].problemId : []) : [];

  // SMA classes learn JavaScript (p5.js), SMP classes Python
  const defaultLanguage = userz.level === "SMA" ? "javascript" : "python";

  // ---------- autosave ----------
  const [saveStatus, setSaveStatus] = useState(""); // "", "pending", "saving", "saved", "error"
  const pendingSave = useRef(null); // { timer, problemId, language, code }

  const flushSave = () => {
    const pending = pendingSave.current;
    if (!pending) return;
    clearTimeout(pending.timer);
    pendingSave.current = null;
    setSaveStatus("saving");
    problemsApi
      .saveDraft({ problemId: pending.problemId, language: pending.language, code: pending.code })
      .then(() => setSaveStatus((s) => (s === "saving" ? "saved" : s)))
      .catch(() => setSaveStatus("error"));
  };

  const handleCodeChange = (value) => {
    const newCode = value ?? "";
    setCode(newCode);
    if (!currentProblemId) return;
    sessionDrafts.set(`${currentProblemId.problemId}:${selectedLanguage}`, newCode);
    if (pendingSave.current) clearTimeout(pendingSave.current.timer);
    pendingSave.current = {
      problemId: currentProblemId.problemId,
      language: selectedLanguage,
      code: newCode,
      timer: setTimeout(flushSave, DRAFT_SAVE_DELAY_MS),
    };
    setSaveStatus("pending");
  };

  // save right away when the tab is hidden or the page is left
  useEffect(() => {
    const onHide = () => document.visibilityState === "hidden" && flushSave();
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      flushSave();
    };
  }, []);  

  // Load the problem. Keyed on its id (plus whether the student's list version with saved code and drafts
  // has arrived), so a background refetch never overwrites what the student is typing;
  // what they typed this session always wins in codeFor().
  const problemKey = problem ? `${problem.problemId}:${index !== -1 ? "full" : "basic"}` : null;
  useEffect(() => {
    if (problem) {
      flushSave();
      setSaveStatus("");
      setCurrentProblemId(problem);
      // open in the language the student last worked in, otherwise their class's language
      const language = lastLanguage(problem, problem.starterCode?.[defaultLanguage] ? defaultLanguage : "python");
      setSelectedLanguage(language);
      setCode(codeFor(problem, language));

      setOutputArr([])
      setTestInfo(null);
      setIsCorrect(null);
      setError(null);
      setSolved(problem.solved || null);
    }
  }, [problemKey, defaultLanguage]); // eslint-disable-line react-hooks/exhaustive-deps

  // keep the solved badge in sync when the list refreshes
  useEffect(() => {
    if (problem?.solved) setSolved(true);
  }, [problem?.solved]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    flushSave();
    setSelectedLanguage(newLang);
    setCode(codeFor(currentProblemId, newLang));
    setOutputArr([])
    setTestInfo(null);
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

  // The server runs the hidden test cases and decides pass/fail, so students can't fake a solve.
  const handleRunCode = async () => {
    flushSave();
    setIsRunning(true);
    setOutputArr([])
    setTestInfo(null);
    setIsCorrect(null);
    setError(null);
    // make room for the result so it shows without scrolling
    for (const panel of [desktopOutputRef.current, mobileOutputRef.current]) {
      if (panel && panel.getSize() < OUTPUT_SIZE_AFTER_RUN) panel.resize(OUTPUT_SIZE_AFTER_RUN);
    }

    try {
      const result = await submitProblemMutation.mutateAsync({
        problemId: id,
        code,
        language: selectedLanguage,
      });

      setOutputArr(result.outputs || []);
      setTestInfo({ tests: result.tests || [], total: result.total || 0 });
      setError(result.error || "");
      setIsCorrect(result.passed);

      if (result.passed) {
        triggerConfetti();
        toast.success("All test cases passed!");
        setSolved(true);
      } else if (result.error) {
        toast.error("Code execution error!");
      } else {
        toast.error("Some test cases failed!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to run code. Please try again.");
      setIsCorrect(false);
      toast.error("Failed to run code");
    } finally {
      setIsRunning(false);
    }
  };

  if (isLoadingProblem || isLoadingProblemsData)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="size-4 animate-spin" />Loading...
      </div>
    );

  // problem exists but is not in this user's list (e.g. hidden by admin)
  if ((errorData && index === -1) || problemNotFound)
    return (
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center gap-4 text-center px-4">
          <p className="text-2xl font-bold">This problem is not available</p>
          <button onClick={() => navigate("/problems")} className="btn btn-primary">Back to Problems</button>
        </div>
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
                user={userz}
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
                    onCodeChange={handleCodeChange}
                    saveStatus={saveStatus}
                    onRunCode={handleRunCode}
                  />
                </Panel>

                <PanelResizeHandle className="h-1.5 md:h-2 bg-primary md:bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                <Panel ref={mobileOutputRef} defaultSize={30} minSize={20}>
                  <OutputPanel
                    output={outputArr}
                    tests={testInfo?.tests}
                    total={testInfo?.total}
                    error={error}
                    isCorrect={isCorrect}
                    solved={solved}
                    isRunning={isRunning}
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
                user={userz}
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
                    onCodeChange={handleCodeChange}
                    saveStatus={saveStatus}
                    onRunCode={handleRunCode}
                  />
                </Panel>

                <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                <Panel ref={desktopOutputRef} defaultSize={30} minSize={20}>
                  <OutputPanel
                    output={outputArr}
                    tests={testInfo?.tests}
                    total={testInfo?.total}
                    error={error}
                    isCorrect={isCorrect}
                    solved={solved}
                    isRunning={isRunning}
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
