import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { CalendarClockIcon, ClipboardListIcon, CheckCircle2Icon, ChevronDownIcon, CircleDashedIcon, ClockAlertIcon, PartyPopperIcon, XCircleIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import { useSolvedProblem } from "../hooks/useProblems";
import { useGetUser } from "../hooks/useUsers";
import { formatDateEN, formatDateTimeEN, getAssignmentGroups, timeLeftLabel } from "../lib/problemUtils";
import { getDifficultyBadgeClass } from "../lib/utils";

const STATUS = {
  done: { icon: CheckCircle2Icon, color: "text-success", label: "Done" },
  late: { icon: ClockAlertIcon, color: "text-warning", label: "Done late" },
  pending: { icon: CircleDashedIcon, color: "text-base-content/40", label: "Not done" },
  missed: { icon: XCircleIcon, color: "text-error", label: "Missed" },
};

function AssignmentRow({ problem, status }) {
  const s = STATUS[status];
  const Icon = s.icon;
  const finished = status === "done" || status === "late";

  let detail;
  if (finished) detail = `${s.label} · ${formatDateTimeEN(problem.solvedAt) || "-"}`;
  else if (problem.attempts > 0) detail = `${s.label} · ${problem.attempts} attempt${problem.attempts === 1 ? "" : "s"}`;
  else detail = status === "missed" ? `${s.label} · you can still solve it for practice` : "Not started";

  return (
    <Link
      to={`/problem/${problem.problemId}`}
      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-base-200/60 hover:bg-base-200 transition-colors"
    >
      <Icon className={`size-7 shrink-0 ${s.color}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-base sm:text-lg">{problem.title}</span>
          <span className={`badge badge-sm ${getDifficultyBadgeClass(problem.difficulty)}`}>{problem.difficulty}</span>
        </div>
        <p className={`text-sm ${finished ? s.color : "text-base-content/60"}`}>{detail}</p>
      </div>
      <span className={`btn btn-sm shrink-0 ${finished ? "btn-ghost" : "btn-primary"}`}>{finished ? "View" : "Solve"}</span>
    </Link>
  );
}

function AssignmentGroup({ group }) {
  const total = group.items.length;
  const percent = Math.round((group.solved / total) * 100);
  const allDone = group.solved === total;

  return (
    <div className="card bg-base-100 border-2 border-primary/20">
      <div className="card-body gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <CalendarClockIcon className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-base-content/50">Deadline</p>
              <p className="font-bold text-lg">{formatDateEN(group.deadline)}, 23:59</p>
            </div>
          </div>
          {group.overdue ? (
            <span className="badge badge-ghost">Closed</span>
          ) : (
            <span className="badge bg-red-500/20 text-red-400 border-red-400">{timeLeftLabel(group.deadline)}</span>
          )}
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">
              {allDone ? "All problems done" : `${group.solved} of ${total} problems done`}
            </span>
            <span className="text-base-content/60">{percent}%</span>
          </div>
          <progress className={`progress w-full ${allDone ? "progress-success" : "progress-primary"}`} value={group.solved} max={total} />
        </div>

        <div className="flex flex-col gap-2">
          {group.items.map((item) => (
            <AssignmentRow key={item.problem.problemId} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AssignmentsPage() {
  const { user } = useUser();
  const { data: problems, isLoading } = useSolvedProblem(user.id);
  const { data: userData } = useGetUser(user.id);
  const userz = useMemo(() => userData?.user || {}, [userData]);
  const [showPast, setShowPast] = useState(false);

  const { upcoming, past } = useMemo(() => getAssignmentGroups(problems, userz), [problems, userz]);
  const pendingCount = upcoming.reduce((n, g) => n + g.items.filter((i) => i.status === "pending").length, 0);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl md:text-4xl font-bold mb-2">
            <span className="p-2 rounded-xl bg-primary/10">
              <ClipboardListIcon className="size-7 text-primary" />
            </span>
            My Assignments
          </h1>
          <p className="text-base-content/70">
            {isLoading
              ? "Loading assignments..."
              : pendingCount > 0
                ? `You have ${pendingCount} unfinished problem${pendingCount === 1 ? "" : "s"}.`
                : "Nothing pending."}
          </p>
        </div>

        {!isLoading && upcoming.length === 0 && (
          <div className="card bg-base-100">
            <div className="card-body items-center text-center gap-3 py-12">
              <PartyPopperIcon className="size-12 text-primary" />
              <p className="text-xl font-bold">No active assignments</p>
              <p className="text-base-content/60">While you wait for new ones, you can practice other problems.</p>
              <Link to="/problems" className="btn btn-primary mt-2">Browse problems</Link>
            </div>
          </div>
        )}

        {upcoming.map((group) => (
          <AssignmentGroup key={group.key} group={group} />
        ))}

        {past.length > 0 && (
          <div className="flex flex-col gap-4">
            <button onClick={() => setShowPast((v) => !v)} className="btn btn-ghost self-start gap-2">
              <ChevronDownIcon className={`size-4 transition-transform ${showPast ? "rotate-180" : ""}`} />
              Past assignments ({past.length})
            </button>
            {showPast && past.map((group) => <AssignmentGroup key={group.key} group={group} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignmentsPage;
