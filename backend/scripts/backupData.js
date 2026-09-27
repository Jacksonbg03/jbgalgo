// Usage (dari folder backend): node scripts/backupData.js
import mongoose from "mongoose";
import { ENV } from "../src/lib/env.js";
import { backupAllCollections } from "./backup.js";

await mongoose.connect(ENV.DB_URL);
console.log("Backup semua collection...");
const dir = await backupAllCollections();
console.log(`Backup tersimpan di: ${dir}`);
await mongoose.disconnect();
