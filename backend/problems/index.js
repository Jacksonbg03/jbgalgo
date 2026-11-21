// Problem sets that can be seeded or updated by name (--set).
// Sets in problems/private/ (git-ignored, because the repo is public and sets contain the answer keys)
// are loaded automatically under their file name, e.g. private/string-smp-2026-11-21.js -> "string-smp-2026-11-21".
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import * as sesi1 from "./sesi1.js";
import * as stringSmp from "./string-smp.js";

export const SETS = {
  sesi1,
  "string-smp": stringSmp,
};

const privateDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "private");
if (fs.existsSync(privateDir)) {
  for (const file of fs.readdirSync(privateDir).filter((f) => f.endsWith(".js")).sort()) {
    SETS[path.basename(file, ".js")] = await import(pathToFileURL(path.join(privateDir, file)).href);
  }
}
