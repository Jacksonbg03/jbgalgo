// Runs student code.
// Uses our own Piston server (PISTON_URL) when it is set, and Wandbox (https://wandbox.org, free, no key) otherwise
// or when Piston is unreachable. The public Piston API (emkc.org) is whitelist-only since Feb 2025.
//
// To keep the number of requests low, all test cases of a Python or JavaScript submission run in ONE execution:
// the student's code is wrapped in a small harness that runs it once per input and reports every output.
// Java runs once per test case.
import { ENV } from "./env.js";

const WANDBOX_API = "https://wandbox.org/api/compile.json";
const TIMEOUT_MS = 20000;
const MAX_CODE_LENGTH = 50000;
const RESULTS_MARKER = "__JBG_RESULTS__";

const WANDBOX_COMPILERS = {
  javascript: "nodejs-18.20.4",
  python: "cpython-3.10.15",
  java: "openjdk-jdk-22+36",
};

const PISTON = {
  url: (ENV.PISTON_URL || "").replace(/\/+$/, ""),
  token: ENV.PISTON_TOKEN || "",
  runTimeoutMs: Number(ENV.PISTON_RUN_TIMEOUT_MS) || 10000,
  files: { javascript: "main.js", python: "main.py", java: "Main.java" },
};

// ---------- concurrency ----------
// Wandbox is a shared free service and the VPS has limited memory (Java especially),
// so cap the number of programs running at once and queue the rest.
function limiter(max) {
  let active = 0;
  const queue = [];
  return async (task) => {
    if (active >= max) await new Promise((resolve) => queue.push(resolve));
    active++;
    try {
      return await task();
    } finally {
      active--;
      queue.shift()?.();
    }
  };
}

const wandboxSlot = limiter(5);
const pistonSlot = limiter(Number(ENV.PISTON_MAX_CONCURRENT) || 4);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function postJson(url, body, headers = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

// Each provider returns { transient, result: { success, output?, error? } }.
// transient = the runner itself failed (overload, network), so retrying or falling back makes sense.
const runnerFailure = (error) => ({ transient: true, result: { success: false, error: `Failed to execute code: ${error.message}` } });
const timeLimit = () => ({ result: { success: false, error: `Time limit exceeded (${TIMEOUT_MS / 1000}s)` } });

// ---------- Wandbox ----------
// Wandbox saves the source as prog.java, so a top-level `public class Main` fails to compile.
// Dropping `public` keeps the program behaviour the same and lets javac accept it.
const prepareForWandbox = (language, code) =>
  language === "java" ? code.replace(/\bpublic\s+((?:final\s+|abstract\s+)*)class\s+/g, "$1class ") : code;

const isOverloadError = (text) => /OCI runtime error|Resource temporarily unavailable/i.test(text);

async function runOnWandbox(language, code, stdin) {
  try {
    const response = await postJson(WANDBOX_API, { compiler: WANDBOX_COMPILERS[language], code: prepareForWandbox(language, code), stdin });
    if (!response.ok) {
      const transient = response.status === 429 || response.status >= 500;
      return { transient, result: { success: false, error: `Code runner error (HTTP ${response.status}). Please try again.` } };
    }

    const data = await response.json();
    const output = data.program_output || "";
    const error = data.compiler_error || data.program_error || "";

    if (isOverloadError(error)) {
      return { transient: true, result: { success: false, error: "Code runner is busy. Please try again." } };
    }
    if (data.signal) return { result: { success: false, output, error: error || `Program terminated (${data.signal})` } };
    if (error) return { result: { success: false, output, error } };
    return { result: { success: true, output: output || "No output" } };
  } catch (error) {
    return error.name === "AbortError" ? timeLimit() : runnerFailure(error);
  }
}

// ---------- Piston (our VPS) ----------
async function runOnPiston(language, code, stdin) {
  try {
    const headers = PISTON.token ? { Authorization: `Bearer ${PISTON.token}` } : {};
    const response = await postJson(
      `${PISTON.url}/api/v2/execute`,
      {
        language,
        version: "*",
        files: [{ name: PISTON.files[language], content: code }],
        stdin,
        compile_timeout: PISTON.runTimeoutMs,
        run_timeout: PISTON.runTimeoutMs,
      },
      headers
    );

    if (!response.ok) {
      // compile/run errors come back as 200, so any other status is a server or config problem: fall back to Wandbox
      const detail = (await response.text().catch(() => "")).slice(0, 200);
      return { transient: true, result: { success: false, error: `Code runner error (HTTP ${response.status}) ${detail}` } };
    }

    const data = await response.json();
    const compile = data.compile;
    if (compile && compile.code !== 0) {
      return { result: { success: false, error: compile.stderr || compile.output || "Compilation failed" } };
    }

    const run = data.run || {};
    const output = run.stdout || "";
    if (run.signal) {
      const reason = run.signal === "SIGKILL" ? "time or memory limit exceeded" : run.signal;
      return { result: { success: false, output, error: run.stderr || `Program terminated (${reason})` } };
    }
    if (run.stderr) return { result: { success: false, output, error: run.stderr } };
    if (run.code !== 0 && run.code !== null && run.code !== undefined) {
      return { result: { success: false, output, error: `Program exited with code ${run.code}` } };
    }
    return { result: { success: true, output: output || "No output" } };
  } catch (error) {
    return error.name === "AbortError" ? timeLimit() : runnerFailure(error);
  }
}

// Piston first when configured; Wandbox when it is not, or when Piston fails as a runner.
async function execute(language, code, stdin) {
  if (PISTON.url) {
    const attempt = await pistonSlot(() => runOnPiston(language, code, stdin));
    if (!attempt.transient) return attempt.result;
    console.warn(`Piston unavailable, falling back to Wandbox: ${attempt.result.error}`);
  }

  let attempt = await wandboxSlot(() => runOnWandbox(language, code, stdin));
  if (attempt.transient) {
    // one retry after a short pause for overload / network hiccups
    await sleep(1500);
    attempt = await wandboxSlot(() => runOnWandbox(language, code, stdin));
  }
  return attempt.result;
}

const validate = (language, code) => {
  if (!WANDBOX_COMPILERS[language]) return `Unsupported language: ${language}`;
  if (typeof code !== "string" || code.length > MAX_CODE_LENGTH) return "Code is empty or too long";
  return null;
};

/**
 * Runs one program with one stdin.
 * @returns {Promise<{success:boolean, output?:string, error?:string}>}
 */
export async function runCode(language, code, stdin = "") {
  const invalid = validate(language, code);
  if (invalid) return { success: false, error: invalid };
  return execute(language, code, stdin);
}

// ---------- batching ----------
// Code that the harness cannot run faithfully (async input, exiting the process, spawning processes) runs once per test.
const UNBATCHABLE = {
  python: /stdin\.buffer|os\._exit|subprocess|multiprocessing|threading|asyncio|signal/,
  javascript: /process\.(stdin|exit)|readline|setTimeout|setInterval|setImmediate|\bawait\b|Promise|\.then\(|child_process|worker_threads/,
};

const pythonHarness = (code, inputs) => `import sys, io, json, traceback, contextlib
CODE = ${JSON.stringify(code)}
INPUTS = ${JSON.stringify(inputs)}
real_stdout = sys.stdout
results = []
try:
    compiled = compile(CODE, "main.py", "exec")
except SyntaxError as e:
    results.append({"out": "", "err": "".join(traceback.format_exception_only(type(e), e))})
else:
    for data in INPUTS:
        out, err = io.StringIO(), io.StringIO()
        sys.stdin = io.StringIO(data)
        try:
            with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
                exec(compiled, {"__name__": "__main__", "__builtins__": __builtins__})
        except SystemExit as e:
            if e.code not in (None, 0):
                err.write(f"Program exited with code {e.code}\\n")
        except BaseException as e:
            err.write("".join(traceback.format_exception(type(e), e, e.__traceback__.tb_next)))
        results.append({"out": out.getvalue(), "err": err.getvalue()})
        if err.getvalue():
            break
real_stdout.write("\\n${RESULTS_MARKER}" + json.dumps(results) + "\\n")
`;

const javascriptHarness = (code, inputs) => `const fs = require("fs");
const vm = require("vm");
const CODE = ${JSON.stringify(code)};
const INPUTS = ${JSON.stringify(inputs)};
const realOut = process.stdout.write.bind(process.stdout);
const realErr = process.stderr.write.bind(process.stderr);
// keep only the student's frames in a stack trace
const clean = (stack) => String(stack).split("\\n").filter((line) => !/^\\s+at /.test(line) || line.includes("main.js")).join("\\n");
const results = [];
let fn = null;
try {
  fn = vm.compileFunction(CODE, ["exports", "require", "module", "__filename", "__dirname"], { filename: "main.js" });
} catch (e) {
  results.push({ out: "", err: clean(e && e.stack ? e.stack : e) });
}
if (fn) {
  for (const input of INPUTS) {
    let out = "";
    let err = "";
    process.stdout.write = (chunk) => { out += String(chunk); return true; };
    process.stderr.write = (chunk) => { err += String(chunk); return true; };
    const stdinFs = Object.assign({}, fs, {
      readFileSync: (path, ...rest) =>
        path === 0 || path === "/dev/stdin" ? (rest[0] ? input : Buffer.from(input)) : fs.readFileSync(path, ...rest),
    });
    const studentRequire = (id) => (id === "fs" || id === "node:fs" ? stdinFs : require(id));
    const mod = { exports: {} };
    try {
      fn.call(mod.exports, mod.exports, studentRequire, mod, "main.js", ".");
    } catch (e) {
      err += clean(e && e.stack ? e.stack : e) + "\\n";
    }
    process.stdout.write = realOut;
    process.stderr.write = realErr;
    results.push({ out, err });
    if (err) break;
  }
}
realOut("\\n${RESULTS_MARKER}" + JSON.stringify(results) + "\\n");
`;

const HARNESS = { python: pythonHarness, javascript: javascriptHarness };

/**
 * Runs the code once per input. Stops at the first test case that errors, like the grader does.
 * @returns {Promise<Array<{success:boolean, output?:string, error?:string}>>}
 */
export async function runTests(language, code, inputs) {
  const invalid = validate(language, code);
  if (invalid) return [{ success: false, error: invalid }];

  const canBatch = HARNESS[language] && !UNBATCHABLE[language].test(code) && inputs.length > 1;
  if (!canBatch) return Promise.all(inputs.map((input) => execute(language, code, input)));

  const result = await execute(language, HARNESS[language](code, inputs), "");
  const at = (result.output || "").lastIndexOf(RESULTS_MARKER);
  if (at === -1) {
    // the whole run failed (time limit, runner error): report it once
    return [{ success: false, error: result.error || "Program produced no result" }];
  }

  let runs;
  try {
    runs = JSON.parse(result.output.slice(at + RESULTS_MARKER.length));
  } catch {
    // output cut off by the runner's output size limit
    return [{ success: false, error: "Output too long" }];
  }
  return runs.map(({ out, err }) =>
    err ? { success: false, output: out, error: err } : { success: true, output: out || "No output" }
  );
}
