// Migrasi soal ke MongoDB. Soal yang problemId-nya sudah ada akan dilewati.
// Usage (dari folder backend): npm run seed -- --level SMP --deadline 2026-10-04
// --level (SMP/SMA) dan --deadline (YYYY-MM-DD) opsional; tanpa keduanya soal tidak punya deadline.
import mongoose from "mongoose";
import Problem from "./src/models/Problems.js";
import { ENV } from "./src/lib/env.js";

// Soal Sesi 1: "Langkah Pertama - Apa itu Algoritma dan Coding?"
// Materi: print, variabel, input, aritmatika (+ - * / %), if-else.
// Format mengikuti model Problems: satu baris expectedOutput per hiddenInput, "\\n" = baris baru pada input.

const INPUT_NOTE = "Gunakan input() tanpa teks pertanyaan, karena teks pertanyaan ikut terbaca sebagai output.";

const javaMain = (body, withScanner = true) =>
  `${withScanner ? "import java.util.Scanner;\n\n" : ""}public class Main {\n    public static void main(String[] args) {\n${body}\n    }\n}`;

const same = (output) => ({ javascript: output, python: output, java: output });

const PROBLEMS = [
  {
    problemId: "hello-world",
    title: "Hello World",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: ["Output"],
    description: {
      text: "Program pertama setiap programmer! Buatlah program yang menampilkan tulisan Hello World ke layar.",
      notes: ["Perhatikan huruf besar dan kecil: H dan W menggunakan huruf besar."],
    },
    examples: [{ input: "(tidak ada input)", output: "Hello World", explanation: "Gunakan print untuk menampilkan tulisan." }],
    constraints: ["Program tidak menerima input apa pun."],
    starterCode: {
      python: "# Tampilkan tulisan Hello World\n",
      javascript: "// Tampilkan tulisan Hello World\n",
      java: javaMain("        // Tampilkan tulisan Hello World\n        ", false),
    },
    hiddenInputs: [""],
    expectedOutput: same("Hello World"),
  },
  {
    problemId: "sapa-aku",
    title: "Sapa Aku",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: ["Input", "Variabel"],
    description: {
      text: "Komputer akan menyapa kamu! Program menerima sebuah nama, lalu menampilkan sapaan:\nHalo, [nama]! Selamat datang di kelas coding.",
      notes: [INPUT_NOTE, "Input -> Proses -> Output: nama disimpan di variabel, lalu ditampilkan kembali."],
    },
    examples: [
      { input: "Budi", output: "Halo, Budi! Selamat datang di kelas coding.", explanation: "" },
      { input: "Siti Aminah", output: "Halo, Siti Aminah! Selamat datang di kelas coding.", explanation: "Nama boleh terdiri dari lebih dari satu kata." },
    ],
    constraints: ["Input berupa satu baris nama."],
    starterCode: {
      python: "nama = input()\n\n# Tulis kode kamu di bawah ini\n",
      javascript:
        'const input = require("fs").readFileSync(0, "utf8").split("\\n");\nconst nama = input[0].trim();\n\n// Tulis kode kamu di bawah ini\n',
      java: javaMain("        Scanner sc = new Scanner(System.in);\n        String nama = sc.nextLine();\n\n        // Tulis kode kamu di bawah ini\n        "),
    },
    hiddenInputs: ["Budi", "Siti Aminah", "Jackson", "Kevin"],
    expectedOutput: same(
      [
        "Halo, Budi! Selamat datang di kelas coding.",
        "Halo, Siti Aminah! Selamat datang di kelas coding.",
        "Halo, Jackson! Selamat datang di kelas coding.",
        "Halo, Kevin! Selamat datang di kelas coding.",
      ].join("\n")
    ),
  },
  {
    problemId: "sapa-teman",
    title: "Sapa Temanmu",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: ["Input", "Variabel"],
    description: {
      text: "Buatlah program untuk menyapa temanmu! Program menerima dua baris input: nama kamu, lalu nama temanmu. Tampilkan:\nHalo [nama kamu] dan [nama temanmu], selamat datang di dunia coding!",
      notes: [INPUT_NOTE],
    },
    examples: [
      {
        input: "Andi\nBudi",
        output: "Halo Andi dan Budi, selamat datang di dunia coding!",
        explanation: "Baris pertama nama kamu, baris kedua nama temanmu.",
      },
    ],
    constraints: ["Input terdiri dari 2 baris: nama kamu dan nama temanmu."],
    starterCode: {
      python: "nama = input()\nteman = input()\n\n# Tulis kode kamu di bawah ini\n",
      javascript:
        'const input = require("fs").readFileSync(0, "utf8").split("\\n");\nconst nama = input[0].trim();\nconst teman = input[1].trim();\n\n// Tulis kode kamu di bawah ini\n',
      java: javaMain(
        "        Scanner sc = new Scanner(System.in);\n        String nama = sc.nextLine();\n        String teman = sc.nextLine();\n\n        // Tulis kode kamu di bawah ini\n        "
      ),
    },
    hiddenInputs: ["Andi\\nBudi", "Rina\\nDewi Lestari", "Jackson\\nKevin", "Tono\\nTini"],
    expectedOutput: same(
      [
        "Halo Andi dan Budi, selamat datang di dunia coding!",
        "Halo Rina dan Dewi Lestari, selamat datang di dunia coding!",
        "Halo Jackson dan Kevin, selamat datang di dunia coding!",
        "Halo Tono dan Tini, selamat datang di dunia coding!",
      ].join("\n")
    ),
  },
  {
    problemId: "jumlah-dua-angka",
    title: "Jumlahkan Dua Angka",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: ["Input", "Aritmatika"],
    description: {
      text: "Buatlah program untuk menjumlahkan dua angka! Program menerima dua baris input berupa bilangan bulat. Tampilkan:\nPenjumlahan [angka pertama] dan [angka kedua] adalah [hasil]",
      notes: [INPUT_NOTE, "Input selalu dibaca sebagai teks, ubah dulu menjadi angka sebelum dijumlahkan."],
    },
    examples: [
      { input: "5\n7", output: "Penjumlahan 5 dan 7 adalah 12", explanation: "5 + 7 = 12" },
      { input: "10\n-3", output: "Penjumlahan 10 dan -3 adalah 7", explanation: "10 + (-3) = 7" },
    ],
    constraints: ["-1000000 <= angka <= 1000000", "Kedua angka adalah bilangan bulat."],
    starterCode: {
      python: "a = int(input())\nb = int(input())\n\n# Tulis kode kamu di bawah ini\n",
      javascript:
        'const input = require("fs").readFileSync(0, "utf8").split("\\n");\nconst a = Number(input[0]);\nconst b = Number(input[1]);\n\n// Tulis kode kamu di bawah ini\n',
      java: javaMain(
        "        Scanner sc = new Scanner(System.in);\n        int a = Integer.parseInt(sc.nextLine().trim());\n        int b = Integer.parseInt(sc.nextLine().trim());\n\n        // Tulis kode kamu di bawah ini\n        "
      ),
    },
    hiddenInputs: ["5\\n7", "10\\n-3", "0\\n0", "123\\n877", "1000000\\n1000000"],
    expectedOutput: same(
      [
        "Penjumlahan 5 dan 7 adalah 12",
        "Penjumlahan 10 dan -3 adalah 7",
        "Penjumlahan 0 dan 0 adalah 0",
        "Penjumlahan 123 dan 877 adalah 1000",
        "Penjumlahan 1000000 dan 1000000 adalah 2000000",
      ].join("\n")
    ),
  },
  {
    problemId: "kalkulator-sederhana",
    title: "Kalkulator Sederhana",
    difficulty: "Medium",
    difficultyLevel: 2,
    category: ["Aritmatika"],
    description: {
      text: "Saatnya membuat kalkulator! Program menerima dua bilangan bulat positif a dan b (masing-masing satu baris). Tampilkan hasil kelima operasi aritmatika dalam satu baris dengan format:\nTambah: [a+b], Kurang: [a-b], Kali: [a*b], Bagi: [a/b], Sisa: [a%b]",
      notes: [
        INPUT_NOTE,
        "Bagi adalah pembagian bulat (tanpa koma). Python: a // b, JavaScript: Math.floor(a / b), Java: a / b.",
        "Sisa adalah sisa pembagian (modulo) menggunakan simbol %.",
      ],
    },
    examples: [
      { input: "10\n3", output: "Tambah: 13, Kurang: 7, Kali: 30, Bagi: 3, Sisa: 1", explanation: "10 dibagi 3 = 3 sisa 1" },
      { input: "4\n9", output: "Tambah: 13, Kurang: -5, Kali: 36, Bagi: 0, Sisa: 4", explanation: "4 dibagi 9 = 0 sisa 4" },
    ],
    constraints: ["1 <= a, b <= 10000"],
    starterCode: {
      python: "a = int(input())\nb = int(input())\n\n# Tulis kode kamu di bawah ini\n",
      javascript:
        'const input = require("fs").readFileSync(0, "utf8").split("\\n");\nconst a = Number(input[0]);\nconst b = Number(input[1]);\n\n// Tulis kode kamu di bawah ini\n',
      java: javaMain(
        "        Scanner sc = new Scanner(System.in);\n        int a = Integer.parseInt(sc.nextLine().trim());\n        int b = Integer.parseInt(sc.nextLine().trim());\n\n        // Tulis kode kamu di bawah ini\n        "
      ),
    },
    hiddenInputs: ["10\\n3", "4\\n9", "20\\n5", "7\\n7", "10000\\n3"],
    expectedOutput: same(
      [
        "Tambah: 13, Kurang: 7, Kali: 30, Bagi: 3, Sisa: 1",
        "Tambah: 13, Kurang: -5, Kali: 36, Bagi: 0, Sisa: 4",
        "Tambah: 25, Kurang: 15, Kali: 100, Bagi: 4, Sisa: 0",
        "Tambah: 14, Kurang: 0, Kali: 49, Bagi: 1, Sisa: 0",
        "Tambah: 10003, Kurang: 9997, Kali: 30000, Bagi: 3333, Sisa: 1",
      ].join("\n")
    ),
  },
  {
    problemId: "ganjil-genap",
    title: "Ganjil atau Genap",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: ["If-Else", "Aritmatika"],
    description: {
      text: "Komputer bisa mengambil keputusan dengan if-else! Program menerima sebuah bilangan bulat n. Tampilkan Genap jika n bilangan genap, atau Ganjil jika n bilangan ganjil.",
      notes: [INPUT_NOTE, "Petunjuk: bilangan genap habis dibagi 2, artinya n % 2 == 0."],
    },
    examples: [
      { input: "8", output: "Genap", explanation: "8 % 2 = 0" },
      { input: "7", output: "Ganjil", explanation: "7 % 2 = 1" },
    ],
    constraints: ["0 <= n <= 1000000"],
    starterCode: {
      python: "n = int(input())\n\n# Tulis kode kamu di bawah ini\n",
      javascript:
        'const input = require("fs").readFileSync(0, "utf8").split("\\n");\nconst n = Number(input[0]);\n\n// Tulis kode kamu di bawah ini\n',
      java: javaMain(
        "        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n\n        // Tulis kode kamu di bawah ini\n        "
      ),
    },
    hiddenInputs: ["8", "7", "0", "1", "999999", "1000000"],
    expectedOutput: same(["Genap", "Ganjil", "Genap", "Ganjil", "Ganjil", "Genap"].join("\n")),
  },
  {
    problemId: "cek-kelulusan",
    title: "Cek Kelulusan",
    difficulty: "Easy",
    difficultyLevel: 1,
    category: ["If-Else"],
    description: {
      text: "Nilai minimum untuk lulus adalah 75. Program menerima sebuah nilai (bilangan bulat). Tampilkan Lulus jika nilai lebih besar atau sama dengan 75, dan Tidak Lulus jika kurang dari 75.",
      notes: [INPUT_NOTE, "Perhatikan: nilai tepat 75 termasuk Lulus (gunakan >=)."],
    },
    examples: [
      { input: "80", output: "Lulus", explanation: "80 >= 75" },
      { input: "60", output: "Tidak Lulus", explanation: "60 < 75" },
    ],
    constraints: ["0 <= nilai <= 100"],
    starterCode: {
      python: "nilai = int(input())\n\n# Tulis kode kamu di bawah ini\n",
      javascript:
        'const input = require("fs").readFileSync(0, "utf8").split("\\n");\nconst nilai = Number(input[0]);\n\n// Tulis kode kamu di bawah ini\n',
      java: javaMain(
        "        Scanner sc = new Scanner(System.in);\n        int nilai = Integer.parseInt(sc.nextLine().trim());\n\n        // Tulis kode kamu di bawah ini\n        "
      ),
    },
    hiddenInputs: ["80", "60", "75", "74", "100", "0"],
    expectedOutput: same(["Lulus", "Tidak Lulus", "Lulus", "Tidak Lulus", "Lulus", "Tidak Lulus"].join("\n")),
  },
];

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
};

const seed = async () => {
  const level = arg("level");
  const deadline = arg("deadline");
  if (level && !["SMP", "SMA"].includes(level)) {
    console.error("--level harus SMP atau SMA");
    process.exit(1);
  }
  if (!ENV.DB_URL) {
    console.error("DB_URL belum diisi di backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("MongoDB connected");

    for (const p of PROBLEMS) {
      if (await Problem.exists({ problemId: p.problemId })) {
        console.log(`Lewati (sudah ada): ${p.title}`);
        continue;
      }
      await Problem.create({ ...p, level: level ? [level] : [], deadline: deadline ? [deadline] : [] });
      console.log(`Seeded: ${p.title}`);
    }

    console.log("All problems seeded");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
