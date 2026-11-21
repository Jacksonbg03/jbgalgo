// Shared helpers for problems: deadlines, starter-code templates and test-case conversion.

export const problemLevels = (problem) => [].concat(problem?.level || []).filter(Boolean);

const JAKARTA = "Asia/Jakarta";

/**
 * Deadline to show for this user, or null.
 * Shown when the problem has a deadline and is for everyone, for the user's level, or the user is an admin.
 */
export const getDeadlineInfo = (problem, user) => {
  const raw = [].concat(problem?.deadline || [])[0];
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;

  const levels = problemLevels(problem);
  const isAdmin = user?.role === "Admin";
  if (!isAdmin && levels.length > 0 && !levels.includes(user?.level)) return null;

  return {
    date,
    label: date.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: JAKARTA }),
    overdue: date.getTime() < Date.now(),
    levels,
  };
};

// "YYYY-MM-DDTHH:MM" (Jakarta time) for a datetime-local input
export const toDateTimeInputValue = (raw) => {
  const date = raw ? new Date(raw) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: JAKARTA, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(date)
      .map((p) => [p.type, p.value])
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
};

// a datetime-local value is Jakarta time
export const fromDateTimeInputValue = (value) => (value ? `${value}:00+07:00` : null);

// ---------- test cases ----------
// Inputs are stored with a literal "\n" between lines (that is what the grader expects).
export const toStoredInput = (text) => text.replace(/\r?\n/g, "\\n");
export const fromStoredInput = (stored) => (stored || "").replace(/\\n/g, "\n");

// ---------- starter code templates ----------
export const PARAM_TYPES = {
  int: {
    label: "Integer",
    js: (i) => `Number(lines[${i}])`,
    py: () => "int(input())",
    javaType: "int",
    java: () => "Integer.parseInt(sc.nextLine().trim())",
  },
  decimal: {
    label: "Decimal",
    js: (i) => `Number(lines[${i}])`,
    py: () => "float(input())",
    javaType: "double",
    java: () => "Double.parseDouble(sc.nextLine().trim())",
  },
  text: {
    label: "Text",
    js: (i) => `(lines[${i}] || "").trim()`,
    py: () => "input().strip()",
    javaType: "String",
    java: () => "sc.nextLine().trim()",
  },
};

// placeholder return so untouched starter code still compiles and gives Wrong Answer instead of an error
export const RETURN_TYPES = {
  int: { label: "Integer", javaType: "int", javaPlaceholder: "return 0;" },
  decimal: { label: "Decimal", javaType: "double", javaPlaceholder: "return 0.0;" },
  text: { label: "Text", javaType: "String", javaPlaceholder: 'return "";' },
};

export const toSnakeCase = (name) =>
  name
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

export const toCamelCase = (name) => toSnakeCase(name).replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());

export const isValidIdentifier = (name) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(name || "");

/** Starter code in the JBGAlgo format: a function to complete plus ready-made input/output sections. */
export const generateStarterCode = ({ functionName, params, returnType }) => {
  const py = toSnakeCase(functionName) || "solve";
  const camel = toCamelCase(functionName) || "solve";
  const pyParams = params.map((p) => toSnakeCase(p.name));
  const camelParams = params.map((p) => toCamelCase(p.name));

  const javascript = [
    `function ${camel}(${camelParams.join(", ")}) {`,
    "  // --- YOUR CODE HERE ---",
    "}",
    "",
    "// --- INPUT SECTION ---",
    'const lines = require("fs").readFileSync(0, "utf8").split("\\n");',
    ...params.map((p, i) => `const ${camelParams[i]} = ${PARAM_TYPES[p.type].js(i)};`),
    "",
    "// --- OUTPUT SECTION ---",
    `console.log(${camel}(${camelParams.join(", ")}));`,
  ].join("\n");

  const python = [
    `def ${py}(${pyParams.join(", ")}):`,
    "    # --- YOUR CODE HERE ---",
    "    pass",
    "",
    "# --- INPUT SECTION ---",
    ...params.map((p, i) => `${pyParams[i]} = ${PARAM_TYPES[p.type].py()}`),
    "",
    "# --- OUTPUT SECTION ---",
    `print(${py}(${pyParams.join(", ")}))`,
  ].join("\n");

  const java = [
    "import java.util.Scanner;",
    "",
    "public class Main {",
    `    public static ${RETURN_TYPES[returnType].javaType} ${camel}(${params.map((p, i) => `${PARAM_TYPES[p.type].javaType} ${camelParams[i]}`).join(", ")}) {`,
    "        // --- YOUR CODE HERE ---",
    `        ${RETURN_TYPES[returnType].javaPlaceholder}`,
    "    }",
    "",
    "    public static void main(String[] args) {",
    "        Scanner sc = new Scanner(System.in);",
    "",
    "        // --- INPUT SECTION ---",
    ...params.map((p, i) => `        ${PARAM_TYPES[p.type].javaType} ${camelParams[i]} = ${PARAM_TYPES[p.type].java()};`),
    "",
    "        // --- OUTPUT SECTION ---",
    `        System.out.println(${camel}(${camelParams.join(", ")}));`,
    "    }",
    "}",
  ].join("\n");

  return { javascript, python, java };
};

// ---------- assignments ----------
// An assignment is a problem with a deadline that is shown to this user.

// "Saturday, 21 Nov 2026, 14:32" (Jakarta time)
export const formatDateTimeEN = (raw) => {
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-GB", {
    weekday: "long", day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: JAKARTA,
  });
};


// "3 days left" / "5 hours left" / "20 minutes left"
export const timeLeftLabel = (date, now = Date.now()) => {
  const ms = new Date(date).getTime() - now;
  if (ms <= 0) return "closed";
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)} min left`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} left`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} left`;
};

/**
 * Status of one assignment for this user:
 * "done" (solved before the deadline), "late" (solved after it), "pending" (still open), "missed" (deadline passed, not solved).
 */
export const assignmentStatus = (problem, deadline) => {
  if (problem.solved) {
    const at = problem.solvedAt ? new Date(problem.solvedAt).getTime() : null;
    return at && at > deadline.getTime() ? "late" : "done";
  }
  return deadline.getTime() < Date.now() ? "missed" : "pending";
};

/** Problems with a deadline for this user, grouped per deadline (date and time), upcoming groups first. */
export const getAssignmentGroups = (problems, user) => {
  const groups = new Map();
  for (const problem of problems || []) {
    const info = getDeadlineInfo(problem, user);
    if (!info) continue;
    const key = info.date.toISOString();
    if (!groups.has(key)) groups.set(key, { key, deadline: info.date, overdue: info.overdue, items: [] });
    groups.get(key).items.push({ problem, status: assignmentStatus(problem, info.date) });
  }
  const list = [...groups.values()];
  list.forEach((g) => {
    g.solved = g.items.filter((i) => i.status === "done" || i.status === "late").length;
    g.items.sort((a, b) => (a.problem.difficultyLevel || 0) - (b.problem.difficultyLevel || 0) || a.problem.title.localeCompare(b.problem.title));
  });
  const upcoming = list.filter((g) => !g.overdue).sort((a, b) => a.deadline - b.deadline);
  const past = list.filter((g) => g.overdue).sort((a, b) => b.deadline - a.deadline);
  return { upcoming, past };
};
