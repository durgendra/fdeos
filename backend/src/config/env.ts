import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  OPENAI_BASE_URL: z.string().url().default("https://api.openai.com/v1"),
  CLIENT_URL: z.string().default("http://localhost:5173")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const missing = parsedEnv.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n- ");
  throw new Error(
    `Backend environment is not configured.\n\n` +
      `Create backend/.env from backend/.env.example and set the required values.\n\n` +
      `Missing or invalid values:\n- ${missing}\n\n` +
      `For local development you can start with:\n` +
      `MONGODB_URI=mongodb://127.0.0.1:27017/fde-os\n` +
      `JWT_SECRET=replace-with-a-long-random-local-secret`
  );
}

export const env = parsedEnv.data;
