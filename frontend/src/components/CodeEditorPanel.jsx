import Editor from "@monaco-editor/react";
import { CloudAlertIcon, CloudCheckIcon, Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

// autosave state shown next to the Run button
function SaveStatus({ status }) {
  if (status === "pending" || status === "saving")
    return (
      <span className="flex items-center gap-1 text-xs text-base-content/50">
        <Loader2Icon className="size-3.5 animate-spin" /> <span className="hidden sm:inline">Saving</span>
      </span>
    );
  if (status === "saved")
    return (
      <span className="flex items-center gap-1 text-xs text-base-content/50" title="Your code is saved, even without running it">
        <CloudCheckIcon className="size-3.5" /> <span className="hidden sm:inline">Saved</span>
      </span>
    );
  if (status === "error")
    return (
      <span className="flex items-center gap-1 text-xs text-warning" title="Your code could not be saved. Check your connection.">
        <CloudAlertIcon className="size-3.5" /> <span className="hidden sm:inline">Not saved</span>
      </span>
    );
  return null;
}

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  saveStatus,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  return (
    <div className="h-full bg-base-300 flex flex-col">
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-base-100 border-t border-base-300">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="size-6 hidden sm:block"
          />
          <select className="select select-sm" value={selectedLanguage} onChange={onLanguageChange}>
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
        <SaveStatus status={saveStatus} />
        <button className="btn btn-primary btn-sm gap-2" disabled={isRunning} onClick={onRunCode}>
          {isRunning ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <PlayIcon className="size-4" />
              Run Code
            </>
          )}
        </button>
        </div>
      </div>

      <div className="flex-1">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;
