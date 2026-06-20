import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import organizationRoutes from "./routes/organizations.routes";
import engagementRoutes from "./routes/engagements.routes";
import noteRoutes from "./routes/notes.routes";
import aiRoutes from "./routes/ai.routes";
import commitmentRoutes from "./routes/commitments.routes";
import riskRoutes from "./routes/risks.routes";
import productSignalRoutes from "./routes/productSignals.routes";
import statusUpdateRoutes from "./routes/statusUpdates.routes";
import readinessRoutes from "./routes/readiness.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import roleRoutes from "./routes/roles.routes";
import permissionRoutes from "./routes/permissions.routes";
import userRoutes from "./routes/users.routes";

export const app = express();
const allowedOrigins = env.CLIENT_URL.split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/api/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));

app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/engagements", engagementRoutes);
app.use("/api", noteRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", commitmentRoutes);
app.use("/api", riskRoutes);
app.use("/api", productSignalRoutes);
app.use("/api", statusUpdateRoutes);
app.use("/api", readinessRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/users", userRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: { message: "Route not found", code: "NOT_FOUND" } });
});

app.use(errorHandler);
