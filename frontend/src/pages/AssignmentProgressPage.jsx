import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { CheckCircle2Icon, ClockAlertIcon, Loader2Icon, MinusIcon, RefreshCwIcon, SearchIcon, XCircleIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import StudentCodeDialog from "../components/StudentCodeDialog";
import { useAssignmentProgress } from "../hooks/useUsers";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDateTimeEN, timeLeftLabel } from "../lib/problemUtils";

const JAKARTA = "Asia/Jakarta";
const dayKey = (d) => new Date(d).toLocaleDateString("en-CA", { timeZone: JAKARTA });
const hhmm = (d) => new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: JAKARTA });
const shortDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: JAKARTA });

// "Today 10:45", "Sat 31 Oct, 23:59"
const groupLabel = (deadline) =>
  dayKey(deadline) === dayKey(Date.now())
    ? `Today ${hhmm(deadline)}`
    : `${new Date(deadline).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: JAKARTA })}, ${hhmm(deadline)}`;

const isFinished = (r) => r?.status === "done" || r?.status === "late";

function Cell({ result, deadline }) {
  if (!result) return <span className="text-base-content/20">n/a</span>;
  // solve time, with the date when it was not on the deadline day
  const when = result.at ? (dayKey(result.at) === dayKey(deadline) ? hhmm(result.at) : `${shortDate(result.at)} ${hhmm(result.at)}`) : "";
  switch (result.status) {
    case "done":
      return (
        <span className="inline-flex items-center gap-1 text-success" title="Solved before the deadline">
          <CheckCircle2Icon className="size-4" /> {when}
        </span>
      );
    case "late":
      return (
        <span className="inline-flex items-center gap-1 text-warning" title="Solved after the deadline">
          <ClockAlertIcon className="size-4" /> {when}
        </span>
      );
    case "tried":
      return (
        <span className="inline-flex items-center gap-1 text-error" title="Ran the code but not solved yet">
          <XCircleIcon className="size-4" /> {result.attempts} {result.attempts === 1 ? "try" : "tries"}
        </span>
      );
    default:
      return (
        <span className="text-base-content/30" title="Not started">
          <MinusIcon className="size-4" />
        </span>
      );
  }
}

function AssignmentProgressPage() {
  const { data: groups, isLoading, isFetching, dataUpdatedAt, refetch } = useAssignmentProgress();
  const [selectedKey, setSelectedKey] = useState(null);
  const [level, setLevel] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  // { student, problem } whose code is shown in the dialog
  const [viewing, setViewing] = useState(null);

  // default: the nearest open deadline, otherwise the most recent one
  useEffect(() => {
    if (!groups?.length || selectedKey) return;
    const open = groups.filter((g) => new Date(g.deadline) > Date.now());
    setSelectedKey((open.at(-1) || groups[0]).deadline);
  }, [groups, selectedKey]);

  const group = groups?.find((g) => g.deadline === selectedKey);

  const rows = useMemo(() => {
    if (!group) return [];
    const query = search.trim().toLowerCase();
    return group.students
      .filter((s) => level === "all" || s.level === level)
      .filter((s) => !query || s.name.toLowerCase().includes(query) || s.email.toLowerCase().includes(query))
      .map((s) => {
        const results = Object.values(s.results);
        return { ...s, finished: results.filter(isFinished).length, total: results.length };
      })
      .sort((a, b) => (sortBy === "done" ? b.finished / b.total - a.finished / a.total : 0) || a.name.localeCompare(b.name));
  }, [group, level, search, sortBy]);

  const finishedAll = rows.filter((r) => r.total > 0 && r.finished === r.total).length;
  const open = group && new Date(group.deadline) > Date.now();

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Assignment Progress</h1>
            <p className="text-sm text-base-content/60">
              Who finished which assignment, and when. Click a result to see the student's code. Updates every 30 seconds
              {dataUpdatedAt ? ` (last update ${hhmm(dataUpdatedAt)})` : ""}.
            </p>
          </div>
          <button onClick={() => refetch()} className="btn btn-sm btn-ghost gap-2" disabled={isFetching}>
            <RefreshCwIcon className={`size-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-base-content/60">
            <Loader2Icon className="size-4 animate-spin" /> Loading...
          </div>
        ) : !groups?.length ? (
          <div className="card bg-base-100">
            <div className="card-body">No problems with a deadline yet.</div>
          </div>
        ) : (
          <>
            {/* DEADLINE PICKER */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {groups.map((g) => {
                const isOpen = new Date(g.deadline) > Date.now();
                const active = g.deadline === selectedKey;
                return (
                  <button
                    key={g.deadline}
                    onClick={() => setSelectedKey(g.deadline)}
                    className={`btn btn-sm shrink-0 gap-2 ${active ? "btn-primary" : "bg-base-100"}`}
                  >
                    {groupLabel(g.deadline)}
                    <span className={`badge badge-xs ${isOpen ? "badge-success" : "badge-ghost"}`}>{isOpen ? "open" : "closed"}</span>
                  </button>
                );
              })}
            </div>

            {group && (
              <div className="card bg-base-100">
                <div className="card-body gap-4">
                  {/* SUMMARY + FILTERS */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        Due {formatDateTimeEN(group.deadline)}
                        {group.levels.length > 0 && <span className="text-base-content/60"> · {group.levels.join(", ")}</span>}
                      </p>
                      <p className="text-sm text-base-content/60">
                        {open ? timeLeftLabel(group.deadline) : "Closed"} · {finishedAll} of {rows.length} students finished everything
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <label className="input input-sm bg-base-200 flex items-center gap-2">
                        <SearchIcon className="size-4 opacity-60" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student" />
                      </label>
                      {group.levels.length > 1 && (
                        <select value={level} onChange={(e) => setLevel(e.target.value)} className="select select-sm bg-base-200" aria-label="Level">
                          <option value="all">All levels</option>
                          {group.levels.map((l) => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      )}
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select select-sm bg-base-200" aria-label="Sort">
                        <option value="name">Sort: name</option>
                        <option value="done">Sort: most done</option>
                      </select>
                    </div>
                  </div>

                  {/* TABLE */}
                  <div className="overflow-x-auto">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th className="sticky left-0 bg-base-100 z-10">Student</th>
                          {group.problems.map((p) => {
                            const done = rows.filter((r) => isFinished(r.results[p.problemId])).length;
                            const forCount = rows.filter((r) => r.results[p.problemId]).length;
                            return (
                              <th key={p.problemId} className="min-w-36 align-bottom">
                                <Link to={`/problem/${p.problemId}`} className="hover:underline normal-case text-sm text-base-content">
                                  {p.title}
                                </Link>
                                <div className="flex items-center gap-1 mt-1 font-normal">
                                  <span className={`badge badge-xs ${getDifficultyBadgeClass(p.difficulty)}`}>{p.difficulty}</span>
                                  {p.hidden && <span className="badge badge-xs badge-ghost">hidden</span>}
                                  <span className="text-xs text-base-content/60">{done}/{forCount}</span>
                                </div>
                              </th>
                            );
                          })}
                          <th className="text-right">Done</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.length === 0 ? (
                          <tr>
                            <td colSpan={group.problems.length + 2} className="text-center text-base-content/60 py-6">
                              No students match.
                            </td>
                          </tr>
                        ) : (
                          rows.map((s) => (
                            <tr key={s._id} className="hover">
                              <td className="sticky left-0 bg-base-100 z-10">
                                <Link to={`/admin/users/${s._id}`} className="flex items-center gap-2 hover:underline" title="See this student's code">
                                  {s.profileImage ? (
                                    <img src={s.profileImage} alt="" className="size-7 rounded-full object-cover" />
                                  ) : (
                                    <span className="size-7 rounded-full bg-base-300" />
                                  )}
                                  <span className="whitespace-nowrap">{s.name}</span>
                                  {s.level && <span className="badge badge-xs badge-outline">{s.level}</span>}
                                </Link>
                              </td>
                              {group.problems.map((p) => (
                                <td key={p.problemId} className="whitespace-nowrap">
                                  {s.results[p.problemId] ? (
                                    <button
                                      onClick={() => setViewing({ student: s, problem: p })}
                                      className="rounded-md px-1.5 py-1 -mx-1.5 hover:bg-base-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                                      title={`See ${s.name}'s code`}
                                    >
                                      <Cell result={s.results[p.problemId]} deadline={group.deadline} />
                                    </button>
                                  ) : (
                                    <Cell result={null} deadline={group.deadline} />
                                  )}
                                </td>
                              ))}
                              <td className="text-right whitespace-nowrap">
                                <span className={s.finished === s.total ? "text-success font-semibold" : ""}>
                                  {s.finished}/{s.total}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* LEGEND */}
                  <div className="flex flex-wrap gap-4 text-xs text-base-content/60">
                    <span className="inline-flex items-center gap-1"><CheckCircle2Icon className="size-3.5 text-success" /> solved on time (solve time)</span>
                    <span className="inline-flex items-center gap-1"><ClockAlertIcon className="size-3.5 text-warning" /> solved late</span>
                    <span className="inline-flex items-center gap-1"><XCircleIcon className="size-3.5 text-error" /> tried, not solved</span>
                    <span className="inline-flex items-center gap-1"><MinusIcon className="size-3.5" /> not started</span>
                    <span>n/a: not for this student's level</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {viewing && <StudentCodeDialog student={viewing.student} problem={viewing.problem} onClose={() => setViewing(null)} />}
    </div>
  );
}

export default AssignmentProgressPage;
