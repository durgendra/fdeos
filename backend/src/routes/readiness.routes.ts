import { Router } from "express";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { ReadinessItem, readinessDefaults } from "../models/ReadinessItem";
import { hasPermission, requireAuth, requirePermission } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { forbidden, notFound } from "../utils/errors";
import { canViewEngagement } from "../utils/rbac";

const router = Router();
router.use(requireAuth);
const body = z.object({ category: z.enum(readinessDefaults), text: z.string().min(1), status: z.enum(["Not Started", "In Progress", "Complete", "Blocked"]).optional(), ownerName: z.string().optional(), notes: z.string().optional(), riskTag: z.string().optional() });

const requireAnyPermission = (...permissions: string[]) => (req: Request, _res: Response, next: NextFunction) => {
  if (permissions.some((permission) => hasPermission(req, permission))) return next();
  return next(forbidden(`Missing one of permissions: ${permissions.join(", ")}`));
};

router.get("/engagements/:engagementId/readiness", requirePermission("readiness:view"), asyncHandler(async (req, res) => {
  await canViewEngagement(req, String(req.params.engagementId));
  ok(res, await ReadinessItem.find({ organizationId: req.auth!.organizationId, engagementId: req.params.engagementId }).sort({ category: 1 }));
}));
router.post("/engagements/:engagementId/readiness", requirePermission("readiness:update"), validate(body), asyncHandler(async (req, res) => {
  await canViewEngagement(req, String(req.params.engagementId));
  ok(res, await ReadinessItem.create({ ...req.body, organizationId: req.auth!.organizationId, engagementId: req.params.engagementId }), 201);
}));
router.patch("/readiness/:id", requirePermission("readiness:update"), validate(body.partial()), asyncHandler(async (req, res) => {
  const item = await ReadinessItem.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!item) throw notFound("Readiness item not found");
  Object.assign(item, req.body);
  await item.save();
  ok(res, item);
}));
router.delete("/readiness/:id", requirePermission("readiness:update"), asyncHandler(async (req, res) => {
  const deleted = await ReadinessItem.findOneAndDelete({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!deleted) throw notFound("Readiness item not found");
  ok(res, { deleted: true });
}));
router.post("/engagements/:engagementId/readiness/defaults", requireAnyPermission("readiness:create_defaults", "readiness:update"), asyncHandler(async (req, res) => {
  await canViewEngagement(req, String(req.params.engagementId));
  const docs = readinessDefaults.map((category) => ({
    organizationId: req.auth!.organizationId,
    engagementId: req.params.engagementId,
    category,
    text: `${category} checkpoint`
  }));
  ok(res, await ReadinessItem.insertMany(docs), 201);
}));
export default router;
