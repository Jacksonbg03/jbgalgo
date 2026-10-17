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
    label: date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: JAKARTA }),
    overdue: date.getTime() < Date.now(),
    levels,
  };
};

// "YYYY-MM-DD" (Jakarta time) for a date input
export const toDateInputValue = (raw) => {
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: JAKARTA, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
};

// a deadline picked as a date means the end of that day in Jakarta
export const fromDateInputValue = (value) => (value ? `${value}T23:59:59+07:00` : null);

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

export const RETURN_TYPES = {
  int: { label: "Integer", javaType: "int" },
  decimal: { label: "Decimal", javaType: "double" },
  text: { label: "Text", javaType: "String" },
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
