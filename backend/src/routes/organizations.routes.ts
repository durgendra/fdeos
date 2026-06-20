import { Router } from "express";
import { Organization } from "../models/Organization";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { notFound } from "../utils/errors";

const router = Router();
router.get("/me", requireAuth, asyncHandler(async (req, res) => {
  const organization = await Organization.findById(req.auth!.organizationId);
  if (!organization) throw notFound("Organization not found");
  ok(res, organization);
}));
export default router;
