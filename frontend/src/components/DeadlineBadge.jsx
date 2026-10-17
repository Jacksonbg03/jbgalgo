import { getDeadlineInfo } from "../lib/problemUtils";

function DeadlineBadge({ problem, user }) {
  const info = getDeadlineInfo(problem, user);
  if (!info) return null;

  // admins see deadlines for every level, so show which level it is for
  const forLevel = user?.role === "Admin" && info.levels.length ? ` (${info.levels.join(", ")})` : "";

  return info.overdue ? (
    <span className="badge badge-ghost">Deadline passed: {info.label}{forLevel}</span>
  ) : (
    <span className="badge bg-red-500/20 text-red-400 border-red-400">Deadline: {info.label}{forLevel}</span>
  );
}

export default DeadlineBadge;
