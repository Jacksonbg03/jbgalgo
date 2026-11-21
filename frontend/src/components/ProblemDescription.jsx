import { CheckCircle2Icon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import DeadlineBadge from "./DeadlineBadge";

// example inputs/outputs store line breaks as a literal "\n"
const Lines = ({ text }) => (
  <pre className="font-mono text-sm whitespace-pre-wrap break-words">{(text || "").split("\\n").join("\n")}</pre>
);

function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems, solved, user }) {
  const notes = problem.description.notes || [];

  return (
    <div className="h-full flex flex-col bg-base-200">
      {/* HEADER: stays visible while the description scrolls */}
      <div className="px-4 sm:px-5 py-3 sm:py-4 bg-base-100 border-b border-base-300 space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold text-base-content leading-tight">{problem.title}</h1>
        {/* badges wrap onto new lines on narrow screens instead of squeezing the title */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`badge badge-sm ${getDifficultyBadgeClass(problem.difficulty)}`}>{problem.difficulty}</span>
          {solved === true && (
            <span className="badge badge-sm gap-1 bg-green-500/20 text-green-400 border border-green-500/30">
              <CheckCircle2Icon className="size-3" /> Solved
            </span>
          )}
          <DeadlineBadge problem={problem} user={user} className="badge-sm" />
          <span className="text-sm text-base-content/60">{problem.category.join(" · ")}</span>
        </div>

        <select
          className="select select-sm w-full"
          value={currentProblemId}
          onChange={(e) => onProblemChange(e.target.value)}
          aria-label="Choose a problem"
        >
          {(allProblems || []).map((p) => (
            <option key={p.problemId} value={p.problemId}>
              {p.title} - {p.difficulty}
            </option>
          ))}
        </select>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-5">
        <section className="space-y-2 leading-relaxed">
          <p className="text-base-content/90">{problem.description.text || ""}</p>
          {notes.length > 0 && (
            <ul className="list-disc pl-5 space-y-1 text-base-content/80 text-[15px]">
              {notes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          )}
        </section>

        {problem.examples?.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-base-content/60">Examples</h2>
            {problem.examples.map((example, idx) => (
              <div key={idx} className="rounded-lg bg-base-100 border border-base-300 overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-base-300">
                  <div className="p-3 min-w-0">
                    <p className="text-xs font-semibold text-primary mb-1">Input</p>
                    <Lines text={example.input} />
                  </div>
                  <div className="p-3 min-w-0">
                    <p className="text-xs font-semibold text-secondary mb-1">Output</p>
                    <Lines text={example.output} />
                  </div>
                </div>
                {example.explanation && (
                  <p className="px-3 py-2 border-t border-base-300 text-xs text-base-content/60">{example.explanation}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {problem.constraints?.length > 0 && (
          <section className="space-y-1">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-base-content/60">Constraints</h2>
            <ul className="space-y-1">
              {problem.constraints.map((constraint, idx) => (
                <li key={idx}>
                  <code className="text-sm text-base-content/80">{constraint}</code>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProblemDescription;
