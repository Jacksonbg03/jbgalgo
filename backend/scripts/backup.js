import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const { EJSON } = mongoose.mongo.BSON;

// Dumps every collection to backups/<timestamp>/<collection>.json (canonical EJSON keeps ObjectId & Date types).
export async function backupAllCollections() {
  const db = mongoose.connection.db;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dir = path.resolve("backups", stamp);
  fs.mkdirSync(dir, { recursive: true });

  const collections = await db.listCollections().toArray();
  for (const { name } of collections) {
    const docs = await db.collection(name).find().toArray();
    fs.writeFileSync(path.join(dir, `${name}.json`), EJSON.stringify(docs, null, 2, { relaxed: false }));
    console.log(`  - ${name}: ${docs.length} dokumen`);
  }
  return dir;
}
