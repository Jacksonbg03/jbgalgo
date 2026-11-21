// Session 1: "First Steps - What are Algorithms and Coding?"
// Topics: print, variables, input, arithmetic (+ - * / %), if-else.
import { INPUT_NOTE, javaMain, same } from "./helpers.js";

const jsInput = (...lines) =>
  'const input = require("fs").readFileSync(0, "utf8").split("\\n");\n' + lines.join("\n") + "\n\n// Write your code below\n";

const javaInput = (...lines) =>
  javaMain(`        Scanner sc = new Scanner(System.in);\n${lines.map((l) => `        ${l}`).join("\n")}\n\n        // Write your code below\n        `);

const TWO_INTS = {
  python: "a = int(input())\nb = int(input())\n\n# Write your code below\n",
  javascript: jsInput("const a = Number(input[0]);", "const b = Number(input[1]);"),
  java: javaInput("int a = Integer.parseInt(sc.nextLine().trim());", "int b = Integer.parseInt(sc.nextLine().trim());"),
};

export const PROBLEMS = [
  {
    problemId: "hello-world",
    title: "Hello World",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: ["Output"],
    description: {
      text: "Every programmer's first program. Write a program that prints Hello World on the screen.",
      notes: ["Watch the capital letters: H and W are uppercase."],
    },
    examples: [{ input: "-", output: "Hello World", explanation: "Use print to show text on the screen." }],
    constraints: ["The program does not read any input."],
    starterCode: {
      python: "# Print Hello World\n",
      javascript: "// Print Hello World\n",
      java: javaMain("        // Print Hello World\n        ", false),
    },
    hiddenInputs: ["-"],
    expectedOutput: same("Hello World"),
  },
  {
    problemId: "sapa-aku",
    title: "Greet Me",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: ["Input", "Variables"],
    description: {
      text: "The computer will greet you. The program reads a name and prints a greeting for that name.",
      notes: [
        "Output format: Hello, [name]! Welcome to coding class.",
        INPUT_NOTE,
        "Input -> Process -> Output: store the name in a variable, then print it back.",
      ],
    },
    examples: [
      { input: "Budi", output: "Hello, Budi! Welcome to coding class.", explanation: "" },
      { input: "Siti Aminah", output: "Hello, Siti Aminah! Welcome to coding class.", explanation: "A name can have more than one word." },
    ],
    constraints: ["The input is a single line with a name."],
    starterCode: {
      python: "name = input()\n\n# Write your code below\n",
      javascript: jsInput("const name = input[0].trim();"),
      java: javaInput("String name = sc.nextLine();"),
    },
    hiddenInputs: ["Budi", "Siti Aminah", "Jackson", "Kevin"],
    expectedOutput: same(
      [
        "Hello, Budi! Welcome to coding class.",
        "Hello, Siti Aminah! Welcome to coding class.",
        "Hello, Jackson! Welcome to coding class.",
        "Hello, Kevin! Welcome to coding class.",
      ].join("\n")
    ),
  },
  {
    problemId: "sapa-teman",
    title: "Greet Your Friend",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: ["Input", "Variables"],
    description: {
      text: "Write a program that greets you and a friend. The program reads two lines: your name, then your friend's name.",
      notes: ["Output format: Hello [your name] and [friend's name], welcome to the world of coding!", INPUT_NOTE],
    },
    examples: [
      {
        input: "Andi\\nBudi",
        output: "Hello Andi and Budi, welcome to the world of coding!",
        explanation: "The first line is your name, the second line is your friend's name.",
      },
    ],
    constraints: ["The input has 2 lines: your name and your friend's name."],
    starterCode: {
      python: "name = input()\nfriend = input()\n\n# Write your code below\n",
      javascript: jsInput("const name = input[0].trim();", "const friend = input[1].trim();"),
      java: javaInput("String name = sc.nextLine();", "String friend = sc.nextLine();"),
    },
    hiddenInputs: ["Andi\\nBudi", "Rina\\nDewi Lestari", "Jackson\\nKevin", "Tono\\nTini"],
    expectedOutput: same(
      [
        "Hello Andi and Budi, welcome to the world of coding!",
        "Hello Rina and Dewi Lestari, welcome to the world of coding!",
        "Hello Jackson and Kevin, welcome to the world of coding!",
        "Hello Tono and Tini, welcome to the world of coding!",
      ].join("\n")
    ),
  },
  {
    problemId: "jumlah-dua-angka",
    title: "Add Two Numbers",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: ["Input", "Arithmetic"],
    description: {
      text: "Write a program that adds two numbers. The program reads two lines, each with an integer.",
      notes: [
        "Output format: The sum of [first number] and [second number] is [result]",
        INPUT_NOTE,
        "Input is always read as text, so convert it to a number before adding.",
      ],
    },
    examples: [
      { input: "5\\n7", output: "The sum of 5 and 7 is 12", explanation: "5 + 7 = 12" },
      { input: "10\\n-3", output: "The sum of 10 and -3 is 7", explanation: "10 + (-3) = 7" },
    ],
    constraints: ["-1000000 <= number <= 1000000", "Both numbers are integers."],
    starterCode: TWO_INTS,
    hiddenInputs: ["5\\n7", "10\\n-3", "0\\n0", "123\\n877", "1000000\\n1000000"],
    expectedOutput: same(
      [
        "The sum of 5 and 7 is 12",
        "The sum of 10 and -3 is 7",
        "The sum of 0 and 0 is 0",
        "The sum of 123 and 877 is 1000",
        "The sum of 1000000 and 1000000 is 2000000",
      ].join("\n")
    ),
  },
  {
    problemId: "kalkulator-sederhana",
    title: "Simple Calculator",
    difficulty: "Medium",
    difficultyLevel: 2,
    category: ["Arithmetic"],
    description: {
      text: "Build a calculator. The program reads two positive integers a and b (one per line). Print the results of all five arithmetic operations on one line.",
      notes: [
        "Output format: Add: [a+b], Subtract: [a-b], Multiply: [a*b], Divide: [a/b], Remainder: [a%b]",
        INPUT_NOTE,
        "Divide is integer division (no decimals). Python: a // b, JavaScript: Math.floor(a / b), Java: a / b.",
        "Remainder is the remainder of the division (modulo), using the % symbol.",
      ],
    },
    examples: [
      { input: "10\\n3", output: "Add: 13, Subtract: 7, Multiply: 30, Divide: 3, Remainder: 1", explanation: "10 divided by 3 is 3 remainder 1" },
      { input: "4\\n9", output: "Add: 13, Subtract: -5, Multiply: 36, Divide: 0, Remainder: 4", explanation: "4 divided by 9 is 0 remainder 4" },
    ],
    constraints: ["1 <= a, b <= 10000"],
    starterCode: TWO_INTS,
    hiddenInputs: ["10\\n3", "4\\n9", "20\\n5", "7\\n7", "10000\\n3"],
    expectedOutput: same(
      [
        "Add: 13, Subtract: 7, Multiply: 30, Divide: 3, Remainder: 1",
        "Add: 13, Subtract: -5, Multiply: 36, Divide: 0, Remainder: 4",
        "Add: 25, Subtract: 15, Multiply: 100, Divide: 4, Remainder: 0",
        "Add: 14, Subtract: 0, Multiply: 49, Divide: 1, Remainder: 0",
        "Add: 10003, Subtract: 9997, Multiply: 30000, Divide: 3333, Remainder: 1",
      ].join("\n")
    ),
  },
  {
    problemId: "ganjil-genap",
    title: "Odd or Even",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: ["If-Else", "Arithmetic"],
    description: {
      text: "A computer can make decisions with if-else. The program reads an integer n. Print Even if n is even, or Odd if n is odd.",
      notes: [INPUT_NOTE, "Hint: an even number divides by 2 with nothing left over, so n % 2 == 0."],
    },
    examples: [
      { input: "8", output: "Even", explanation: "8 % 2 = 0" },
      { input: "7", output: "Odd", explanation: "7 % 2 = 1" },
    ],
    constraints: ["0 <= n <= 1000000"],
    starterCode: {
      python: "n = int(input())\n\n# Write your code below\n",
      javascript: jsInput("const n = Number(input[0]);"),
      java: javaInput("int n = Integer.parseInt(sc.nextLine().trim());"),
    },
    hiddenInputs: ["8", "7", "0", "1", "999999", "1000000"],
    expectedOutput: same(["Even", "Odd", "Even", "Odd", "Odd", "Even"].join("\n")),
  },
  {
    problemId: "cek-kelulusan",
    title: "Pass or Fail",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: ["If-Else"],
    description: {
      text: "The minimum passing score is 75. The program reads a score (an integer). Print Pass if the score is 75 or higher, and Fail if it is below 75.",
      notes: [INPUT_NOTE, "Note: a score of exactly 75 is a Pass (use >=)."],
    },
    examples: [
      { input: "80", output: "Pass", explanation: "80 >= 75" },
      { input: "60", output: "Fail", explanation: "60 < 75" },
    ],
    constraints: ["0 <= score <= 100"],
    starterCode: {
      python: "score = int(input())\n\n# Write your code below\n",
      javascript: jsInput("const score = Number(input[0]);"),
      java: javaInput("int score = Integer.parseInt(sc.nextLine().trim());"),
    },
    hiddenInputs: ["80", "60", "75", "74", "100", "0"],
    expectedOutput: same(["Pass", "Fail", "Pass", "Fail", "Pass", "Fail"].join("\n")),
  },
];
