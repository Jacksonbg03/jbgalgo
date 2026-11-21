import { useEffect, useState } from "react";
import { ArrowRightIcon, BugIcon, CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";

// errors from the code runner service or our own rate limit, not from the student's code
const isServerBusy = (error) =>
  /^(Code runner|Failed to execute code|Too many runs|Your previous run|Failed to run code)/.test(error || "");

const STATUS = {
  accepted: { icon: CheckCircle2Icon, label: "Accepted", className: "text-success", hint: "All test cases passed." },
  wrong: { icon: XCircleIcon, label: "Wrong Answer", className: "text-error", hint: "Compare your output with the examples." },
  busy: {
    icon: ClockIcon,
    label: "Server is busy",
    className: "text-warning",
    hint: 'Not a problem with your code. Wait a few seconds, then click "Run Code" again.',
  },
  error: { icon: BugIcon, label: "Error", className: "text-error", hint: "The message usually includes the line number." },
};

function OutputPanel({ output, error, isCorrect, solved, isRunning, handleProblemChange, nextProb }) {
  const outputs = output || [];
  const [selected, setSelected] = useState(0);

  // a new run starts at the first test case
  useEffect(() => setSelected(0), [output]);

  let status = null;
  if (error) status = isServerBusy(error) ? "busy" : "error";
  else if (outputs.length > 0) status = isCorrect && solved ? "accepted" : "wrong";

  const s = status && STATUS[status];
  const Icon = s?.icon;

  return (
    <div className="h-full bg-base-100 flex flex-col">
      {/* HEADER: the result in one line */}
      <div className="flex items-center gap-3 px-4 py-2 bg-base-200 border-b border-base-300 min-h-11">
        <span className="font-semibold text-sm">Output</span>
        {isRunning ? (
          <span className="flex items-center gap-1.5 text-sm text-base-content/70">
            <Loader2Icon className="size-4 animate-spin" /> Running...
          </span>
        ) : (
          s && (
            <span className={`flex items-center gap-1.5 text-sm font-semibold ${s.className}`}>
              <Icon className="size-4" /> {s.label}
            </span>
          )
        )}
        {!isRunning && status === "accepted" && nextProb?.length ? (
          <button className="btn btn-success btn-xs ml-auto gap-1" onClick={() => handleProblemChange(nextProb)}>
            Next Problem <ArrowRightIcon className="size-3" />
          </button>
        ) : null}
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {!status && !isRunning && (
          <p className="text-base-content/50">Click "Run Code" to check your solution against the test cases.</p>
        )}

        {s && !isRunning && <p className="text-sm text-base-content/60">{s.hint}</p>}

        {!isRunning && status === "error" && (
          <pre className="text-sm font-mono bg-base-200 rounded-md p-3 whitespace-pre-wrap break-words">{error}</pre>
        )}

        {!isRunning && (status === "accepted" || status === "wrong") && (
          <>
            {outputs.length > 1 && (
              <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Test cases">
                {outputs.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={selected === i}
                    onClick={() => setSelected(i)}
                    className={`btn btn-xs ${selected === i ? "btn-primary" : "btn-ghost bg-base-200"}`}
                  >
                    Test {i + 1}
                  </button>
                ))}
              </div>
            )}
            <div>
              <p className="text-xs text-base-content/60 mb-1">Your output{outputs.length > 1 ? ` (test ${selected + 1})` : ""}</p>
              <pre className="text-sm font-mono bg-base-200 rounded-md p-3 whitespace-pre-wrap break-words">
                {outputs[selected] ?? ""}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
