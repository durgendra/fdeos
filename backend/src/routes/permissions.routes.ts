import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { permissionCatalog } from "../utils/permissions";

const router = Router();
router.get("/catalog", requireAuth, requirePermission("admin:view_roles"), asyncHandler(async (_req, res) => ok(res, permissionCatalog)));
export default router;
