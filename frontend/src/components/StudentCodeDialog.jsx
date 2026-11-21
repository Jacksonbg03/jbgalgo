import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import Editor from "@monaco-editor/react";
import { CheckCircle2Icon, ExternalLinkIcon, Loader2Icon, PencilLineIcon, PlayIcon, XIcon } from "lucide-react";
import { useUserSubmissions } from "../hooks/useUsers";

const LANGUAGE_LABEL = { javascript: "JavaScript", python: "Python", java: "Java" };
const when = (d) =>
  d ? new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }) : "";

/**
 * Admin: a student's code for one problem. "Last run" is the code from their latest run
 * (the passing code once solved); "Draft" is what they are typing now, autosaved, when it is newer than that run.
 */
function StudentCodeDialog({ student, problem, onClose }) {
  const { data, isLoading, isError } = useUserSubmissions(student._id);
  const [tab, setTab] = useState(null);

  const submission = data?.submissions?.find((s) => s.problemId === problem.problemId);
  // only drafts newer than the last run say something the run does not
  const drafts = useMemo(
    () =>
      (data?.drafts || [])
        .filter((d) => d.problemId === problem.problemId && d.code.trim())
        .filter((d) => !submission || new Date(d.updatedAt) > new Date(submission.submittedAt))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    [data, problem.problemId, submission]
  );

  const tabs = [
    ...(submission?.sourceCode ? [{ key: "run", label: "Last run", icon: PlayIcon, code: submission.sourceCode, language: submission.language, at: submission.submittedAt }] : []),
    ...drafts.map((d) => ({ key: `draft-${d.language}`, label: `Draft (${LANGUAGE_LABEL[d.language] || d.language})`, icon: PencilLineIcon, code: d.code, language: d.language, at: d.updatedAt })),
  ];
  const current = tabs.find((t) => t.key === tab) || tabs[0];

  // Escape closes the dialog
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true" aria-label={`${student.name}: ${problem.title}`}>
      <div className="modal-box w-11/12 max-w-4xl p-0 flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3 px-4 sm:px-5 py-3 border-b border-base-300">
          <div className="min-w-0">
            <p className="font-bold text-lg leading-tight truncate">{student.name}</p>
            <p className="text-sm text-base-content/60 truncate">{problem.title}</p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-ghost btn-square" aria-label="Close">
            <XIcon className="size-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 p-6 text-base-content/60">
            <Loader2Icon className="size-4 animate-spin" /> Loading code...
          </div>
        ) : isError ? (
          <p className="p-6 text-error">Could not load this student's code.</p>
        ) : tabs.length === 0 ? (
          <p className="p-6 text-base-content/60">No code yet: this student has not written anything for this problem.</p>
        ) : (
          <>
            {/* TABS + META */}
            <div className="flex flex-wrap items-center gap-2 px-4 sm:px-5 py-2 border-b border-base-300">
              {tabs.length > 1 &&
                tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`btn btn-xs gap-1 ${current.key === t.key ? "btn-primary" : "btn-ghost bg-base-200"}`}
                  >
                    <t.icon className="size-3" /> {t.label}
                  </button>
                ))}
              <span className="text-xs text-base-content/60 flex flex-wrap items-center gap-x-2">
                {current.key === "run" ? (
                  <>
                    {submission.solved ? (
                      <span className="inline-flex items-center gap-1 text-success">
                        <CheckCircle2Icon className="size-3.5" /> Solved
                      </span>
                    ) : (
                      <span className="text-error">Not solved yet</span>
                    )}
                    <span>· {LANGUAGE_LABEL[current.language] || current.language}</span>
                    <span>· {submission.solved ? "solved" : "last run"} {when(current.at)}</span>
                    <span>· {submission.attempts} run{submission.attempts === 1 ? "" : "s"}</span>
                  </>
                ) : (
                  <span>Not run yet · autosaved {when(current.at)}</span>
                )}
              </span>
            </div>

            {/* CODE */}
            <div className="h-[55vh] min-h-64">
              <Editor
                height="100%"
                language={current.language}
                value={current.code}
                theme="vs-dark"
                options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14, scrollBeyondLastLine: false, automaticLayout: true, wordWrap: "on" }}
              />
            </div>
          </>
        )}

        <div className="flex justify-end px-4 sm:px-5 py-3 border-t border-base-300">
          <Link to={`/admin/users/${student._id}`} className="btn btn-sm btn-ghost gap-1">
            All of {student.name.split(" ")[0]}'s code <ExternalLinkIcon className="size-3.5" />
          </Link>
        </div>
      </div>
      {/* clicking outside closes */}
      <button className="modal-backdrop" onClick={onClose} aria-label="Close" />
    </div>
  );
}

export default StudentCodeDialog;
