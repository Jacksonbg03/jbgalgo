import { Link } from "react-router";
import { ArrowRightIcon, CheckCircle2Icon, ClipboardListIcon, FlameIcon, TargetIcon } from "lucide-react";
import { formatDateEN, timeLeftLabel } from "../lib/problemUtils";
import { getDifficultyBadgeClass } from "../lib/utils";

// Dashboard summary: the nearest open deadline, its progress and what is left to do.
function AssignmentsCard({ groups, totalSolved, isLoading }) {
  const next = groups[0];
  const pending = groups.flatMap((g) => g.items.filter((i) => i.status === "pending").map((i) => i.problem));
  const assigned = groups.reduce((n, g) => n + g.items.length, 0);
  const assignedDone = groups.reduce((n, g) => n + g.solved, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      {/* NEXT DEADLINE */}
      <div className="card bg-base-100 border-2 border-primary/20 lg:col-span-2">
        <div className="card-body gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl">
                <ClipboardListIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-black">Your Assignments</h2>
            </div>
            <Link to="/assignments" className="btn btn-sm btn-ghost gap-1">
              View all <ArrowRightIcon className="size-4" />
            </Link>
          </div>

          {isLoading ? (
            <p className="text-base-content/60">Loading assignments...</p>
          ) : !next ? (
            <div className="py-4">
              <p className="font-bold text-lg">No active assignments</p>
              <p className="text-base-content/60">You can practice other problems in the meantime.</p>
            </div>
          ) : (
            <>
              <div>
                <div className="flex flex-wrap justify-between gap-2 text-sm mb-1">
                  <span className="font-medium">
                    Due {formatDateEN(next.deadline)} · <span className="text-red-400">{timeLeftLabel(next.deadline)}</span>
                  </span>
                  <span className="text-base-content/60">
                    {next.solved}/{next.items.length} done
                  </span>
                </div>
                <progress
                  className={`progress w-full ${next.solved === next.items.length ? "progress-success" : "progress-primary"}`}
                  value={next.solved}
                  max={next.items.length}
                />
              </div>

              {pending.length === 0 ? (
                <p className="flex items-center gap-2 font-semibold text-success">
                  <CheckCircle2Icon className="size-5" /> All assignments done.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {pending.slice(0, 3).map((p) => (
                    <Link
                      key={p.problemId}
                      to={`/problem/${p.problemId}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-base-200/60 hover:bg-base-200 transition-colors"
                    >
                      <span className="flex-1 font-semibold">{p.title}</span>
                      <span className={`badge badge-sm ${getDifficultyBadgeClass(p.difficulty)}`}>{p.difficulty}</span>
                      <span className="btn btn-xs btn-primary">Solve</span>
                    </Link>
                  ))}
                  {pending.length > 3 && (
                    <Link to="/assignments" className="text-sm text-primary hover:underline">
                      +{pending.length - 3} more
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
        <div className="card bg-base-100 border-2 border-primary/20">
          <div className="card-body">
            <div className="p-3 bg-success/10 rounded-2xl w-fit">
              <TargetIcon className="w-6 h-6 text-success" />
            </div>
            <div className="text-4xl font-black">{assigned ? `${assignedDone}/${assigned}` : "-"}</div>
            <div className="text-sm opacity-60">Active assignments done</div>
          </div>
        </div>
        <div className="card bg-base-100 border-2 border-primary/20">
          <div className="card-body">
            <div className="p-3 bg-warning/10 rounded-2xl w-fit">
              <FlameIcon className="w-6 h-6 text-warning" />
            </div>
            <div className="text-4xl font-black">{totalSolved}</div>
            <div className="text-sm opacity-60">Problems solved</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentsCard;
