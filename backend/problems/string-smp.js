// String manipulation problems for SMP.
// Topics: upper/lower case, picking a character by index, reversing a string, combined with if-else.
import { INPUT_NOTE, javaMain, same } from "./helpers.js";

export const LEVEL = "SMP";

const jsInput = (...names) =>
  'const input = require("fs").readFileSync(0, "utf8").split("\\n");\n' +
  names.map((name, i) => `const ${name} = input[${i}].trim();\n`).join("") +
  "\n// Write your code below\n";

export const PROBLEMS = [
  {
    problemId: "teriak",
    title: "Shout!",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: ["String"],
    description: {
      text: "Time to shout! The program reads a sentence and prints it with every letter in uppercase, followed by an exclamation mark (!).",
      notes: [
        INPUT_NOTE,
        "Hint: Python: sentence.upper(), JavaScript: sentence.toUpperCase(), Java: sentence.toUpperCase().",
        "Digits and spaces stay the same; only letters become uppercase.",
      ],
    },
    examples: [
      { input: "i love coding", output: "I LOVE CODING!", explanation: "Every letter becomes uppercase, then ! is added." },
      { input: "Hello World", output: "HELLO WORLD!", explanation: "" },
    ],
    constraints: ["The input is a single line (letters, digits and spaces)."],
    starterCode: {
      python: "sentence = input()\n\n# Write your code below\n",
      javascript: jsInput("sentence"),
      java: javaMain("        Scanner sc = new Scanner(System.in);\n        String sentence = sc.nextLine();\n\n        // Write your code below\n        "),
    },
    hiddenInputs: ["i love coding", "Hello World", "jbgalgo", "Learning Python Is Fun", "class 8 b"],
    expectedOutput: same(["I LOVE CODING!", "HELLO WORLD!", "JBGALGO!", "LEARNING PYTHON IS FUN!", "CLASS 8 B!"].join("\n")),
  },
  {
    problemId: "inisial-nama",
    title: "Name Initials",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: ["String", "Input"],
    description: {
      text: "Turn a name into initials. The program reads two lines: a first name and a last name. Take the first letter of each name, make it uppercase, and print the initials.",
      notes: [
        "Output format: Initials: [first letter].[last letter].",
        INPUT_NOTE,
        "Hint: the first letter is at index 0. Python and JavaScript: name[0], Java: name.charAt(0).",
        "Names may be written in lowercase, so make sure the initials are uppercase.",
      ],
    },
    examples: [
      { input: "Budi\\nSantoso", output: "Initials: B.S.", explanation: "B from Budi, S from Santoso." },
      { input: "siti\\naminah", output: "Initials: S.A.", explanation: "Lowercase s and a become S and A." },
    ],
    constraints: ["The input has 2 lines: the first name and the last name.", "Each name is a single word."],
    starterCode: {
      python: "first = input()\nlast = input()\n\n# Write your code below\n",
      javascript: jsInput("first", "last"),
      java: javaMain(
        "        Scanner sc = new Scanner(System.in);\n        String first = sc.nextLine();\n        String last = sc.nextLine();\n\n        // Write your code below\n        "
      ),
    },
    hiddenInputs: ["Budi\\nSantoso", "siti\\naminah", "Jackson\\nbhakti", "kevin\\nWijaya", "Ani\\nputri"],
    expectedOutput: same(["Initials: B.S.", "Initials: S.A.", "Initials: J.B.", "Initials: K.W.", "Initials: A.P."].join("\n")),
  },
  {
    problemId: "cek-palindrom",
    title: "Palindrome Check",
    difficulty: "Medium",
    difficultyLevel: 2,
    category: ["String", "If-Else"],
    description: {
      text: "A palindrome is a word that reads the same forwards and backwards, like level or noon. The program reads one word. Print Palindrome if the word is a palindrome, or Not Palindrome if it is not.",
      notes: [
        INPUT_NOTE,
        "Uppercase and lowercase letters count as the same: Racecar is a palindrome. Convert the word to lowercase first.",
        'Hint for reversing a word: Python: word[::-1], JavaScript: word.split("").reverse().join(""), Java: new StringBuilder(word).reverse().toString().',
        "In Java, compare strings with .equals(), not ==.",
      ],
    },
    examples: [
      { input: "level", output: "Palindrome", explanation: "level reversed is still level." },
      { input: "hello", output: "Not Palindrome", explanation: "hello reversed is olleh." },
      { input: "Racecar", output: "Palindrome", explanation: "In lowercase it is racecar, which reads the same reversed." },
    ],
    constraints: ["The input is a single word with no spaces.", "1 <= word length <= 100"],
    starterCode: {
      python: "word = input()\n\n# Write your code below\n",
      javascript: jsInput("word"),
      java: javaMain("        Scanner sc = new Scanner(System.in);\n        String word = sc.nextLine().trim();\n\n        // Write your code below\n        "),
    },
    hiddenInputs: ["level", "Racecar", "hello", "Madam", "coding", "a", "world", "Kayak"],
    expectedOutput: same(
      ["Palindrome", "Palindrome", "Not Palindrome", "Palindrome", "Not Palindrome", "Palindrome", "Not Palindrome", "Palindrome"].join("\n")
    ),
  },
];
