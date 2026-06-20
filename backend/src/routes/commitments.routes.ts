import { Router } from "express";
import { z } from "zod";
import { Commitment } from "../models/Commitment";
import { requireAuth, hasPermission, requirePermission } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { commitmentStatusSchema, ownerTypeSchema } from "../validators/common";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { forbidden, notFound } from "../utils/errors";
import { canViewEngagement } from "../utils/rbac";

const router = Router();
router.use(requireAuth);
const body = z.object({ text: z.string().min(1), ownerName: z.string().optional(), ownerType: ownerTypeSchema.optional(), dueDate: z.string().optional(), status: commitmentStatusSchema.optional(), sourceExcerpt: z.string().optional() });

router.get("/engagements/:engagementId/commitments", asyncHandler(async (req, res) => {
  await canViewEngagement(req, String(req.params.engagementId));
  if (!hasPermission(req, "commitment:view:all") && !hasPermission(req, "commitment:view:own")) throw forbidden("Missing commitment view permission");
  ok(res, await Commitment.find({ organizationId: req.auth!.organizationId, engagementId: req.params.engagementId }).sort({ createdAt: -1 }));
}));
router.post("/engagements/:engagementId/commitments", requirePermission("commitment:create"), validate(body), asyncHandler(async (req, res) => {
  await canViewEngagement(req, String(req.params.engagementId));
  ok(res, await Commitment.create({ ...req.body, organizationId: req.auth!.organizationId, engagementId: req.params.engagementId, createdBy: req.auth!.userId }), 201);
}));
router.patch("/commitments/:id", validate(body.partial()), asyncHandler(async (req, res) => {
  const item = await Commitment.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!item) throw notFound("Commitment not found");
  await canViewEngagement(req, item.engagementId.toString());
  if (!hasPermission(req, "commitment:update:all") && !(hasPermission(req, "commitment:update:own") && item.createdBy.toString() === req.auth!.userId)) throw forbidden("Missing commitment update permission");
  Object.assign(item, req.body);
  await item.save();
  ok(res, item);
}));
router.delete("/commitments/:id", requirePermission("commitment:delete"), asyncHandler(async (req, res) => {
  const deleted = await Commitment.findOneAndDelete({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!deleted) throw notFound("Commitment not found");
  ok(res, { deleted: true });
}));
export default router;
