// Code execution via Wandbox (https://wandbox.org) - free public API, no API key needed.
// The public Piston API (emkc.org) is whitelist-only since Feb 2025, so we use Wandbox instead.

const WANDBOX_API = "https://wandbox.org/api/compile.json";
const TIMEOUT_MS = 20000;
const MAX_CODE_LENGTH = 50000;

const COMPILERS = {
  javascript: "nodejs-18.20.4",
  python: "cpython-3.10.15",
  java: "openjdk-jdk-22+36",
};

// Wandbox saves the source as prog.java, so a top-level `public class Main` fails to compile.
// Dropping `public` keeps the program behaviour the same and lets javac accept it.
function prepareCode(language, code) {
  if (language === "java") return code.replace(/\bpublic\s+((?:final\s+|abstract\s+)*)class\s+/g, "$1class ");
  return code;
}

// Wandbox is a shared free service: a whole class pressing "Run" at once overloads it
// ("OCI runtime error ... Resource temporarily unavailable"). Limit concurrent requests and queue the rest.
const MAX_CONCURRENT = 5;
let active = 0;
const queue = [];

async function withSlot(task) {
  if (active >= MAX_CONCURRENT) await new Promise((resolve) => queue.push(resolve));
  active++;
  try {
    return await task();
  } finally {
    active--;
    queue.shift()?.();
  }
}

const isOverloadError = (text) => /OCI runtime error|Resource temporarily unavailable/i.test(text);

async function runOnce(compiler, code, stdin) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(WANDBOX_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ compiler, code, stdin }),
      signal: controller.signal,
    });

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
    if (data.signal) {
      return { result: { success: false, output, error: error || `Program terminated (${data.signal})` } };
    }
    if (error) return { result: { success: false, output, error } };

    return { result: { success: true, output: output || "No output" } };
  } catch (error) {
    if (error.name === "AbortError") {
      return { result: { success: false, error: `Time limit exceeded (${TIMEOUT_MS / 1000}s)` } };
    }
    return { transient: true, result: { success: false, error: `Failed to execute code: ${error.message}` } };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * @returns {Promise<{success:boolean, output?:string, error?:string}>}
 */
export async function runCode(language, code, stdin = "") {
  const compiler = COMPILERS[language];
  if (!compiler) return { success: false, error: `Unsupported language: ${language}` };
  if (typeof code !== "string" || code.length > MAX_CODE_LENGTH) {
    return { success: false, error: "Code is empty or too long" };
  }

  return withSlot(async () => {
    const source = prepareCode(language, code);
    let attempt = await runOnce(compiler, source, stdin);
    if (attempt.transient) {
      // one retry after a short pause for overload / network hiccups
      await new Promise((resolve) => setTimeout(resolve, 1500));
      attempt = await runOnce(compiler, source, stdin);
    }
    return attempt.result;
  });
}
