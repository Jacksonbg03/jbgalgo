import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import Editor from "@monaco-editor/react";
import { ArrowLeftIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import { useUserSubmissions } from "../hooks/useUsers";
import { getDifficultyBadgeClass } from "../lib/utils";

const LANGUAGE_LABEL = { javascript: "JavaScript", python: "Python", java: "Java" };

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "-";

function SubmissionCard({ submission, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const lines = (submission.sourceCode || "").split("\n").length;

  return (
    <div className="card bg-base-100">
      <button onClick={() => setOpen((v) => !v)} className="card-body p-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {open ? <ChevronDownIcon className="size-4" /> : <ChevronRightIcon className="size-4" />}
            <span className="font-bold">{submission.title}</span>
            <span className={`badge ${getDifficultyBadgeClass(submission.difficulty)}`}>{submission.difficulty}</span>
            {submission.solved ? (
              <span className="badge bg-green-500/20 text-green-400 border border-green-500/30">Solved</span>
            ) : (
              <span className="badge badge-warning badge-outline">Not solved yet</span>
            )}
            {submission.problemHidden && <span className="badge badge-ghost">Hidden problem</span>}
          </div>
          <div className="text-sm text-base-content/60 flex gap-3 flex-wrap">
            <span>{LANGUAGE_LABEL[submission.language] || submission.language}</span>
            <span>{submission.attempts ? `${submission.attempts} attempt${submission.attempts > 1 ? "s" : ""}` : "attempts not tracked"}</span>
            <span>{formatDate(submission.submittedAt)}</span>
          </div>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4">
          <p className="text-xs text-base-content/60 mb-2">
            {submission.solved ? "Code that passed all test cases" : "Latest code (has not passed yet)"}
          </p>
          {submission.sourceCode ? (
            <div className="rounded-lg overflow-hidden border border-base-300">
              <Editor
                height={`${Math.min(Math.max(lines, 5), 30) * 20 + 16}px`}
                language={submission.language}
                value={submission.sourceCode}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  domReadOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  padding: { top: 8, bottom: 8 },
                }}
              />
            </div>
          ) : (
            <p className="text-sm text-base-content/60">No code saved.</p>
          )}
        </div>
      )}
    </div>
  );
}

function UserSubmissionsPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useUserSubmissions(id);
  const [filter, setFilter] = useState("all");

  const submissions = useMemo(() => {
    const all = data?.submissions || [];
    if (filter === "solved") return all.filter((s) => s.solved);
    if (filter === "unsolved") return all.filter((s) => !s.solved);
    return all;
  }, [data, filter]);

  const solvedCount = (data?.submissions || []).filter((s) => s.solved).length;
  const user = data?.user;

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Link to="/admin/users" className="btn btn-ghost btn-sm gap-2 mb-6">
          <ArrowLeftIcon className="size-4" />
          Back to users
        </Link>

        {isLoading ? (
          <p className="text-base-content/70">Loading...</p>
        ) : isError || !user ? (
          <p className="text-error">Failed to load this user.</p>
        ) : (
          <>
            <div className="mb-8 flex items-center gap-4">
              {user.profileImage && <img src={user.profileImage} alt="" className="size-14 rounded-full" />}
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-base-content/70 text-sm">
                  {user.email} · {user.level || "No level"}
                  {user.hidden ? " · Hidden" : ""}
                </p>
              </div>
            </div>

            <div className="stats bg-base-100 shadow mb-6 w-full">
              <div className="stat">
                <div className="stat-title">Solved</div>
                <div className="stat-value text-success">{solvedCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Attempted, not solved</div>
                <div className="stat-value text-warning">{(data.submissions?.length || 0) - solvedCount}</div>
              </div>
            </div>

            <div className="flex gap-1 mb-4">
              {[
                ["all", "All"],
                ["solved", "Solved"],
                ["unsolved", "Not solved"],
              ].map(([value, label]) => (
                <button key={value} onClick={() => setFilter(value)} className={`btn btn-sm ${filter === value ? "btn-primary" : "btn-ghost"}`}>
                  {label}
                </button>
              ))}
            </div>

            {submissions.length === 0 ? (
              <p className="text-base-content/60 py-8 text-center">No submissions yet.</p>
            ) : (
              <div className="space-y-3">
                {submissions.map((s, i) => (
                  <SubmissionCard key={s.problemId} submission={s} defaultOpen={i === 0} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UserSubmissionsPage;
