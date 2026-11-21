import { CalendarClockIcon } from "lucide-react";
import { getDeadlineInfo } from "../lib/problemUtils";

// h-auto + whitespace-nowrap: the text stays inside the badge on narrow screens instead of spilling out
const BASE = "badge h-auto py-0.5 gap-1 whitespace-nowrap";

function DeadlineBadge({ problem, user, className = "" }) {
  const info = getDeadlineInfo(problem, user);
  if (!info) return null;

  // admins see deadlines for every level, so show which level it is for
  const forLevel = user?.role === "Admin" && info.levels.length ? ` · ${info.levels.join(", ")}` : "";

  return info.overdue ? (
    <span className={`${BASE} badge-ghost ${className}`}>
      <CalendarClockIcon className="size-3.5 shrink-0" />
      Closed {info.label}
      {forLevel}
    </span>
  ) : (
    <span className={`${BASE} bg-red-500/15 text-red-400 border-red-400/60 ${className}`}>
      <CalendarClockIcon className="size-3.5 shrink-0" />
      Due {info.label}
      {forLevel}
    </span>
  );
}

export default DeadlineBadge;
