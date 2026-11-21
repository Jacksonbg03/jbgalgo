// Shared helpers for problem sets.
// Format follows the Problems model: one expectedOutput line per hiddenInput, "\\n" = a new line inside an input.

export const INPUT_NOTE = 'Read input without a prompt message (input(), not input("Name: ")), because prompt text is counted as output.';

export const javaMain = (body, withScanner = true) =>
  `${withScanner ? "import java.util.Scanner;\n\n" : ""}public class Main {\n    public static void main(String[] args) {\n${body}\n    }\n}`;

export const same = (output) => ({ javascript: output, python: output, java: output });
