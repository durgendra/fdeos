import { Router } from "express";
import { z } from "zod";
import { Engagement } from "../models/Engagement";
import { requireAuth, requirePermission, hasPermission } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { forbidden, notFound } from "../utils/errors";
import { canEditEngagement, canViewEngagement } from "../utils/rbac";

const router = Router();
router.use(requireAuth);

const engagementBody = z.object({
  customerName: z.string().min(1).optional(),
  industry: z.string().optional(),
  opportunitySize: z.number().optional(),
  fdeOwnerId: z.string().optional(),
  fdeOwnerName: z.string().optional(),
  executiveSponsor: z.string().optional(),
  technicalSponsor: z.string().optional(),
  deploymentStage: z.enum(["Discovery", "Workflow Mapping", "Technical Scoping", "Prototype", "Validation", "Production Hardening", "Handoff", "Expansion"]).optional(),
  health: z.enum(["Green", "Yellow", "Red"]).optional(),
  primaryObjective: z.string().optional(),
  businessProblem: z.string().optional(),
  targetWorkflow: z.string().optional(),
  successMetric: z.string().optional(),
  systemsInvolved: z.array(z.string()).optional(),
  stakeholders: z.array(z.any()).optional(),
  currentBlocker: z.string().optional(),
  nextMilestone: z.string().optional(),
  executiveSummary: z.string().optional(),
  tags: z.array(z.string()).optional()
});

router.get("/", asyncHandler(async (req, res) => {
  const query: Record<string, unknown> = { organizationId: req.auth!.organizationId };
  if (!hasPermission(req, "engagement:view:all")) {
    if (!hasPermission(req, "engagement:view:own")) throw forbidden("Missing engagement view permission");
    query.fdeOwnerId = req.auth!.userId;
  }
  ok(res, await Engagement.find(query).sort({ lastActivityAt: -1 }));
}));

router.post("/", requirePermission("engagement:create"), validate(engagementBody.extend({ customerName: z.string().min(1) })), asyncHandler(async (req, res) => {
  if (req.body.fdeOwnerId && req.body.fdeOwnerId !== req.auth!.userId && !hasPermission(req, "engagement:assign_owner")) {
    throw forbidden("Missing permission to assign owners");
  }
  const engagement = await Engagement.create({ ...req.body, organizationId: req.auth!.organizationId, fdeOwnerId: req.body.fdeOwnerId ?? req.auth!.userId });
  ok(res, engagement, 201);
}));

router.get("/:id", asyncHandler(async (req, res) => ok(res, await canViewEngagement(req, String(req.params.id)))));

router.patch("/:id", validate(engagementBody), asyncHandler(async (req, res) => {
  if (req.body.fdeOwnerId && !hasPermission(req, "engagement:assign_owner")) throw forbidden("Missing permission to assign owners");
  const engagement = await canEditEngagement(req, String(req.params.id));
  Object.assign(engagement, req.body, { lastActivityAt: new Date() });
  await engagement.save();
  ok(res, engagement);
}));

router.delete("/:id", requirePermission("engagement:delete"), asyncHandler(async (req, res) => {
  const deleted = await Engagement.findOneAndDelete({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!deleted) throw notFound("Engagement not found");
  ok(res, { deleted: true });
}));

export default router;
