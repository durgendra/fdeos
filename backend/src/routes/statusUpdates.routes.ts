import { Router } from "express";
import { StatusUpdate } from "../models/StatusUpdate";
import { requireAuth, requirePermission } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { canViewEngagement } from "../utils/rbac";

const router = Router();
router.use(requireAuth);
router.get("/engagements/:engagementId/status-updates", requirePermission("status_update:view"), asyncHandler(async (req, res) => {
  await canViewEngagement(req, String(req.params.engagementId));
  ok(res, await StatusUpdate.find({ organizationId: req.auth!.organizationId, engagementId: req.params.engagementId }).sort({ createdAt: -1 }));
}));
export default router;
