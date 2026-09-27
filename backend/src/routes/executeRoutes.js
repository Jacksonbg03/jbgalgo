import express from "express";
import { runCode } from "../lib/codeRunner.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { language, code, stdin = "" } = req.body || {};
  const result = await runCode(language, code, stdin);
  res.status(200).json(result);
});

export default router;
