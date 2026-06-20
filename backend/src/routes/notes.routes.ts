import { Router } from "express";
import { z } from "zod";
import { Note } from "../models/Note";
import { requireAuth, hasPermission, requirePermission } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { sourceTypeSchema } from "../validators/common";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { forbidden, notFound } from "../utils/errors";
import { canViewEngagement, canViewRawNotes } from "../utils/rbac";

const router = Router();
router.use(requireAuth);

const noteBody = z.object({ title: z.string().min(1), rawText: z.string().min(1), sourceType: sourceTypeSchema.default("Meeting Notes") });

router.get("/engagements/:engagementId/notes", asyncHandler(async (req, res) => {
  await canViewEngagement(req, String(req.params.engagementId));
  if (!hasPermission(req, "notes:view:all") && !hasPermission(req, "notes:view:own")) throw forbidden("Missing notes view permission");
  const query: Record<string, unknown> = { engagementId: req.params.engagementId, organizationId: req.auth!.organizationId };
  if (!hasPermission(req, "notes:view:all")) query.createdBy = req.auth!.userId;
  const notes = await Note.find(query).sort({ createdAt: -1 });
  ok(res, hasPermission(req, "notes:view_raw") ? notes : notes.map((note) => ({ ...note.toObject(), rawText: undefined })));
}));

router.post("/engagements/:engagementId/notes", requirePermission("notes:create"), validate(noteBody), asyncHandler(async (req, res) => {
  await canViewEngagement(req, String(req.params.engagementId));
  const note = await Note.create({ ...req.body, organizationId: req.auth!.organizationId, engagementId: req.params.engagementId, createdBy: req.auth!.userId });
  ok(res, note, 201);
}));

router.get("/notes/:id", asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!note) throw notFound("Note not found");
  await canViewEngagement(req, note.engagementId.toString());
  if (!hasPermission(req, "notes:view:all") && note.createdBy.toString() !== req.auth!.userId) throw forbidden("Missing notes view permission");
  if (!hasPermission(req, "notes:view_raw")) return ok(res, { ...note.toObject(), rawText: undefined });
  ok(res, note);
}));

router.patch("/notes/:id", requirePermission("notes:create"), validate(noteBody.partial()), asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!note) throw notFound("Note not found");
  canViewRawNotes(req);
  Object.assign(note, req.body);
  await note.save();
  ok(res, note);
}));

router.delete("/notes/:id", requirePermission("notes:create"), asyncHandler(async (req, res) => {
  const deleted = await Note.findOneAndDelete({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!deleted) throw notFound("Note not found");
  ok(res, { deleted: true });
}));

export default router;
