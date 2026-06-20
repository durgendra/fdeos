import { Router } from "express";
import { z } from "zod";
import { Note } from "../models/Note";
import { Engagement } from "../models/Engagement";
import { Commitment } from "../models/Commitment";
import { Risk } from "../models/Risk";
import { ProductSignal } from "../models/ProductSignal";
import { requireAuth, requirePermission } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sourceTypeSchema, toneSchema } from "../validators/common";
import { extractIntelligence } from "../services/ai/extractionService";
import { generateStatusUpdate } from "../services/ai/statusUpdateService";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { notFound } from "../utils/errors";
import { canViewEngagement, canEditEngagement } from "../utils/rbac";

const router = Router();
router.use(requireAuth);

function validDateOrUndefined(value: unknown) {
  if (!value || typeof value !== "string") return undefined;
  const normalized = value.trim();
  if (!normalized || ["tbd", "n/a", "na", "none", "unknown"].includes(normalized.toLowerCase())) return undefined;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function sanitizeCommitment(commitment: any) {
  return {
    text: commitment.text,
    ownerName: commitment.ownerName ?? "",
    ownerType: ["Vendor", "Customer", "Shared"].includes(commitment.ownerType) ? commitment.ownerType : "Vendor",
    dueDate: validDateOrUndefined(commitment.dueDate),
    sourceExcerpt: commitment.sourceExcerpt ?? ""
  };
}

router.post(
  "/extract-notes",
  requirePermission("notes:extract_ai"),
  validate(z.object({ engagementId: z.string(), rawText: z.string().min(1), sourceType: sourceTypeSchema.default("Meeting Notes"), title: z.string().min(1) })),
  asyncHandler(async (req, res) => {
    await canViewEngagement(req, req.body.engagementId);
    const note = await Note.create({
      organizationId: req.auth!.organizationId,
      engagementId: req.body.engagementId,
      title: req.body.title,
      rawText: req.body.rawText,
      sourceType: req.body.sourceType,
      createdBy: req.auth!.userId,
      extractionStatus: "pending"
    });
    try {
      const extracted = await extractIntelligence(req.body.rawText);
      note.extracted = extracted;
      note.extractionStatus = "completed";
      await note.save();
      ok(res, { noteId: note._id, extracted });
    } catch (error) {
      note.extractionStatus = "failed";
      await note.save();
      throw error;
    }
  })
);

router.post(
  "/apply-extraction",
  requirePermission("notes:apply_extraction"),
  validate(z.object({
    noteId: z.string(),
    applyToEngagement: z.boolean().default(true),
    createCommitments: z.boolean().default(true),
    createRisks: z.boolean().default(true),
    createProductSignals: z.boolean().default(true)
  })),
  asyncHandler(async (req, res) => {
    const note = await Note.findOne({ _id: req.body.noteId, organizationId: req.auth!.organizationId });
    if (!note) throw notFound("Note not found");
    const engagement = await canEditEngagement(req, note.engagementId.toString());
    const extracted = note.extracted as any;
    const created = { commitments: [] as unknown[], risks: [] as unknown[], productSignals: [] as unknown[] };

    if (req.body.applyToEngagement && extracted) {
      engagement.primaryObjective ||= extracted.customerObjective ?? "";
      engagement.businessProblem ||= extracted.businessProblem ?? "";
      engagement.systemsInvolved = Array.from(new Set([...(engagement.systemsInvolved ?? []), ...(extracted.systemsMentioned ?? [])]));
      engagement.stakeholders = extracted.stakeholders?.length ? extracted.stakeholders : engagement.stakeholders;
      engagement.currentBlocker ||= extracted.blockers?.[0] ?? "";
      engagement.nextMilestone ||= extracted.recommendedNextSteps?.[0] ?? "";
      engagement.lastActivityAt = new Date();
      await engagement.save();
    }

    if (req.body.createCommitments) {
      created.commitments = await Commitment.insertMany((extracted.commitments ?? []).map((commitment: any) => ({
        ...sanitizeCommitment(commitment),
        organizationId: req.auth!.organizationId,
        engagementId: note.engagementId,
        sourceNoteId: note._id,
        createdBy: req.auth!.userId
      })));
    }
    if (req.body.createRisks) {
      created.risks = await Risk.insertMany((extracted.risks ?? []).map((risk: any) => ({ ...risk, organizationId: req.auth!.organizationId, engagementId: note.engagementId, sourceNoteId: note._id })));
    }
    if (req.body.createProductSignals) {
      created.productSignals = await ProductSignal.insertMany((extracted.productSignals ?? []).map((signal: any) => ({ ...signal, organizationId: req.auth!.organizationId, engagementId: note.engagementId, sourceNoteId: note._id })));
    }
    ok(res, { engagement, ...created });
  })
);

router.post(
  "/generate-status-update",
  requirePermission("status_update:generate"),
  validate(z.object({ engagementId: z.string(), tone: toneSchema.default("Executive") })),
  asyncHandler(async (req, res) => {
    await canViewEngagement(req, req.body.engagementId);
    const update = await generateStatusUpdate(req.body.engagementId, req.auth!.organizationId, req.auth!.userId, req.body.tone);
    await Engagement.findOneAndUpdate({ _id: req.body.engagementId, organizationId: req.auth!.organizationId }, { lastActivityAt: new Date() });
    ok(res, update, 201);
  })
);

export default router;
