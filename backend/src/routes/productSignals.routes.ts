import { Router } from "express";
import { z } from "zod";
import { ProductSignal } from "../models/ProductSignal";
import { requireAuth, hasPermission, requirePermission } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { prioritySchema, productSignalTypeSchema } from "../validators/common";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { forbidden, notFound } from "../utils/errors";
import { canManageProductSignal, canViewEngagement, getVisibleEngagementIds } from "../utils/rbac";

const router = Router();
router.use(requireAuth);
const body = z.object({ theme: z.string().min(1), signalType: productSignalTypeSchema.optional(), evidence: z.string().optional(), customerImpact: z.string().optional(), suggestedPriority: prioritySchema.optional(), status: z.enum(["New", "Reviewed", "Sent to Product", "Dismissed"]).optional() });

router.get("/product-signals", asyncHandler(async (req, res) => {
  if (!hasPermission(req, "product_signal:view:all") && !hasPermission(req, "product_signal:view:own")) throw forbidden("Missing product signal view permission");
  const engagementIds = await getVisibleEngagementIds(req);
  ok(res, await ProductSignal.find({ organizationId: req.auth!.organizationId, engagementId: { $in: engagementIds } }).sort({ createdAt: -1 }));
}));
router.get("/engagements/:engagementId/product-signals", asyncHandler(async (req, res) => {
  await canViewEngagement(req, String(req.params.engagementId));
  ok(res, await ProductSignal.find({ organizationId: req.auth!.organizationId, engagementId: req.params.engagementId }).sort({ createdAt: -1 }));
}));
router.post("/engagements/:engagementId/product-signals", requirePermission("product_signal:create"), validate(body), asyncHandler(async (req, res) => {
  await canViewEngagement(req, String(req.params.engagementId));
  ok(res, await ProductSignal.create({ ...req.body, organizationId: req.auth!.organizationId, engagementId: req.params.engagementId }), 201);
}));
router.patch("/product-signals/:id", validate(body.partial()), asyncHandler(async (req, res) => {
  canManageProductSignal(req);
  const item = await ProductSignal.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!item) throw notFound("Product signal not found");
  Object.assign(item, req.body);
  await item.save();
  ok(res, item);
}));
router.delete("/product-signals/:id", requirePermission("product_signal:dismiss"), asyncHandler(async (req, res) => {
  const deleted = await ProductSignal.findOneAndDelete({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!deleted) throw notFound("Product signal not found");
  ok(res, { deleted: true });
}));
export default router;
