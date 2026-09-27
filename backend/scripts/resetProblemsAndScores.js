// Menghapus SEMUA soal dan skor (solvedProblems) user. Akun user tetap ada.
// Selalu membuat backup lengkap terlebih dahulu.
// Usage (dari folder backend): node scripts/resetProblemsAndScores.js --confirm
import mongoose from "mongoose";
import { ENV } from "../src/lib/env.js";
import Problems from "../src/models/Problems.js";
import User from "../src/models/User.js";
import { backupAllCollections } from "./backup.js";

if (!process.argv.includes("--confirm")) {
  console.log("Script ini akan menghapus SEMUA soal dan skor user (akun tetap ada).");
  console.log("Jalankan ulang dengan --confirm untuk melanjutkan.");
  process.exit(1);
}

await mongoose.connect(ENV.DB_URL);

console.log("1/3 Backup semua collection...");
const dir = await backupAllCollections();
console.log(`    Backup tersimpan di: ${dir}`);

console.log("2/3 Menghapus semua soal...");
const deleted = await Problems.deleteMany({});
console.log(`    ${deleted.deletedCount} soal dihapus`);

console.log("3/3 Mengosongkan skor (solvedProblems) semua user...");
const updated = await User.updateMany({}, { $set: { solvedProblems: [] } });
console.log(`    ${updated.modifiedCount} user direset (total user: ${await User.countDocuments()})`);

await mongoose.disconnect();
console.log("Selesai.");
