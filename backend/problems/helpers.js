// Shared helpers for problem sets.
// Format mengikuti model Problems: satu baris expectedOutput per hiddenInput, "\\n" = baris baru pada input.

export const INPUT_NOTE = "Gunakan input() tanpa teks pertanyaan, karena teks pertanyaan ikut terbaca sebagai output.";

export const javaMain = (body, withScanner = true) =>
  `${withScanner ? "import java.util.Scanner;\n\n" : ""}public class Main {\n    public static void main(String[] args) {\n${body}\n    }\n}`;

export const same = (output) => ({ javascript: output, python: output, java: output });
