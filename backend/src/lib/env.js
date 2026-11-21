import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const ENV = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV,
  CLIENT_URL: process.env.CLIENT_URL,
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,
  // optional: our own Piston code runner (see VPS_SETUP.md); without it code runs on Wandbox
  PISTON_URL: process.env.PISTON_URL,
  PISTON_TOKEN: process.env.PISTON_TOKEN,
  PISTON_MAX_CONCURRENT: process.env.PISTON_MAX_CONCURRENT,
  PISTON_RUN_TIMEOUT_MS: process.env.PISTON_RUN_TIMEOUT_MS,
};
