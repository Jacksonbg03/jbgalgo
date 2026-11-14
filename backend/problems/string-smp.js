// Soal String Manipulation untuk SMP.
// Materi: huruf besar/kecil, mengambil karakter dengan indeks, membalik string, digabung dengan if-else.
import { INPUT_NOTE, javaMain, same } from "./helpers.js";

export const LEVEL = "SMP";

export const PROBLEMS = [
  {
    problemId: "teriak",
    title: "Teriak!",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: ["String"],
    description: {
      text: "Ayo berteriak! Program menerima sebuah kalimat, lalu menampilkan kalimat tersebut dengan semua huruf diubah menjadi huruf besar (kapital) dan diberi tanda seru (!) di akhir.",
      notes: [
        INPUT_NOTE,
        "Petunjuk: Python: kalimat.upper(), JavaScript: kalimat.toUpperCase(), Java: kalimat.toUpperCase().",
        "Angka dan spasi tidak berubah, hanya huruf yang menjadi kapital.",
      ],
    },
    examples: [
      { input: "aku suka coding", output: "AKU SUKA CODING!", explanation: "Semua huruf menjadi kapital, lalu ditambah !" },
      { input: "Halo Dunia", output: "HALO DUNIA!", explanation: "" },
    ],
    constraints: ["Input berupa satu baris kalimat (huruf, angka, dan spasi)."],
    starterCode: {
      python: "kalimat = input()\n\n# Tulis kode kamu di bawah ini\n",
      javascript:
        'const input = require("fs").readFileSync(0, "utf8").split("\\n");\nconst kalimat = input[0].trim();\n\n// Tulis kode kamu di bawah ini\n',
      java: javaMain("        Scanner sc = new Scanner(System.in);\n        String kalimat = sc.nextLine();\n\n        // Tulis kode kamu di bawah ini\n        "),
    },
    hiddenInputs: ["aku suka coding", "Halo Dunia", "jbgalgo", "Belajar Python Itu Seru", "smp 2 kelas b"],
    expectedOutput: same(
      ["AKU SUKA CODING!", "HALO DUNIA!", "JBGALGO!", "BELAJAR PYTHON ITU SERU!", "SMP 2 KELAS B!"].join("\n")
    ),
  },
  {
    problemId: "inisial-nama",
    title: "Inisial Nama",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: ["String", "Input"],
    description: {
      text: "Buatlah inisial dari nama seseorang! Program menerima dua baris input: nama depan dan nama belakang. Ambil huruf pertama dari masing-masing nama, ubah menjadi huruf besar, lalu tampilkan sebagai inisial.",
      notes: [
        "Format output: Inisial: [huruf depan].[huruf belakang].",
        INPUT_NOTE,
        "Petunjuk: huruf pertama ada di indeks 0. Python & JavaScript: nama[0], Java: nama.charAt(0).",
        "Nama bisa ditulis dengan huruf kecil, jadi pastikan inisialnya diubah ke huruf besar.",
      ],
    },
    examples: [
      { input: "Budi\\nSantoso", output: "Inisial: B.S.", explanation: "B dari Budi, S dari Santoso." },
      { input: "siti\\naminah", output: "Inisial: S.A.", explanation: "Huruf kecil s dan a diubah menjadi S dan A." },
    ],
    constraints: ["Input terdiri dari 2 baris: nama depan dan nama belakang.", "Setiap nama terdiri dari satu kata."],
    starterCode: {
      python: "depan = input()\nbelakang = input()\n\n# Tulis kode kamu di bawah ini\n",
      javascript:
        'const input = require("fs").readFileSync(0, "utf8").split("\\n");\nconst depan = input[0].trim();\nconst belakang = input[1].trim();\n\n// Tulis kode kamu di bawah ini\n',
      java: javaMain(
        "        Scanner sc = new Scanner(System.in);\n        String depan = sc.nextLine();\n        String belakang = sc.nextLine();\n\n        // Tulis kode kamu di bawah ini\n        "
      ),
    },
    hiddenInputs: ["Budi\\nSantoso", "siti\\naminah", "Jackson\\nbhakti", "kevin\\nWijaya", "Ani\\nputri"],
    expectedOutput: same(
      ["Inisial: B.S.", "Inisial: S.A.", "Inisial: J.B.", "Inisial: K.W.", "Inisial: A.P."].join("\n")
    ),
  },
  {
    problemId: "cek-palindrom",
    title: "Cek Palindrom",
    difficulty: "Medium",
    difficultyLevel: 2,
    category: ["String", "If-Else"],
    description: {
      text: "Palindrom adalah kata yang sama jika dibaca dari depan maupun dari belakang, contohnya katak dan malam. Program menerima sebuah kata. Tampilkan Palindrom jika kata tersebut palindrom, atau Bukan Palindrom jika bukan.",
      notes: [
        INPUT_NOTE,
        "Huruf besar dan kecil dianggap sama: Kodok termasuk palindrom. Ubah dulu kata menjadi huruf kecil semua.",
        "Petunjuk membalik kata: Python: kata[::-1], JavaScript: kata.split(\"\").reverse().join(\"\"), Java: new StringBuilder(kata).reverse().toString().",
        "Di Java, bandingkan string dengan .equals(), bukan ==.",
      ],
    },
    examples: [
      { input: "katak", output: "Palindrom", explanation: "katak dibalik tetap katak." },
      { input: "kasur", output: "Bukan Palindrom", explanation: "kasur dibalik menjadi rusak." },
      { input: "Kodok", output: "Palindrom", explanation: "Setelah diubah ke huruf kecil: kodok, dibalik tetap kodok." },
    ],
    constraints: ["Input berupa satu kata tanpa spasi.", "1 <= panjang kata <= 100"],
    starterCode: {
      python: "kata = input()\n\n# Tulis kode kamu di bawah ini\n",
      javascript:
        'const input = require("fs").readFileSync(0, "utf8").split("\\n");\nconst kata = input[0].trim();\n\n// Tulis kode kamu di bawah ini\n',
      java: javaMain("        Scanner sc = new Scanner(System.in);\n        String kata = sc.nextLine().trim();\n\n        // Tulis kode kamu di bawah ini\n        "),
    },
    hiddenInputs: ["katak", "Kodok", "makan", "Malam", "coding", "a", "kasur", "Tamat"],
    expectedOutput: same(
      ["Palindrom", "Palindrom", "Bukan Palindrom", "Palindrom", "Bukan Palindrom", "Palindrom", "Bukan Palindrom", "Palindrom"].join("\n")
    ),
  },
];
