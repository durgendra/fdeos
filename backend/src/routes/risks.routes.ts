import { Router } from "express";
import { z } from "zod";
import { Risk } from "../models/Risk";
import { requireAuth, hasPermission, requirePermission } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { riskSeveritySchema, riskStatusSchema } from "../validators/common";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { forbidden, notFound } from "../utils/errors";
import { canViewEngagement } from "../utils/rbac";

const router = Router();
router.use(requireAuth);
const body = z.object({ title: z.string().min(1), description: z.string().optional(), severity: riskSeveritySchema.optional(), impact: z.string().optional(), mitigation: z.string().optional(), ownerName: z.string().optional(), status: riskStatusSchema.optional() });

router.get("/engagements/:engagementId/risks", asyncHandler(async (req, res) => {
  await canViewEngagement(req, String(req.params.engagementId));
  if (!hasPermission(req, "risk:view:all") && !hasPermission(req, "risk:view:own")) throw forbidden("Missing risk view permission");
  ok(res, await Risk.find({ organizationId: req.auth!.organizationId, engagementId: req.params.engagementId }).sort({ createdAt: -1 }));
}));
router.post("/engagements/:engagementId/risks", requirePermission("risk:create"), validate(body), asyncHandler(async (req, res) => {
  await canViewEngagement(req, String(req.params.engagementId));
  ok(res, await Risk.create({ ...req.body, organizationId: req.auth!.organizationId, engagementId: req.params.engagementId }), 201);
}));
router.patch("/risks/:id", validate(body.partial()), asyncHandler(async (req, res) => {
  const item = await Risk.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!item) throw notFound("Risk not found");
  await canViewEngagement(req, item.engagementId.toString());
  if (!hasPermission(req, "risk:update:all") && !hasPermission(req, "risk:update:own")) throw forbidden("Missing risk update permission");
  Object.assign(item, req.body);
  await item.save();
  ok(res, item);
}));
router.delete("/risks/:id", requirePermission("risk:delete"), asyncHandler(async (req, res) => {
  const deleted = await Risk.findOneAndDelete({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!deleted) throw notFound("Risk not found");
  ok(res, { deleted: true });
}));
export default router;
