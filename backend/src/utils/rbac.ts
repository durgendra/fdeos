import { Request } from "express";
import { Engagement } from "../models/Engagement";
import { forbidden, notFound } from "./errors";
import { hasPermission } from "../middleware/auth";

export function isOwnEngagement(req: Request, engagement: { fdeOwnerId?: unknown }) {
  return Boolean(engagement.fdeOwnerId && engagement.fdeOwnerId.toString() === req.auth?.userId);
}

export async function getVisibleEngagementIds(req: Request) {
  const organizationId = req.auth!.organizationId;
  if (hasPermission(req, "engagement:view:all")) {
    const engagements = await Engagement.find({ organizationId }).select("_id").lean();
    return engagements.map((engagement) => engagement._id);
  }
  if (hasPermission(req, "engagement:view:own")) {
    const engagements = await Engagement.find({ organizationId, fdeOwnerId: req.auth!.userId }).select("_id").lean();
    return engagements.map((engagement) => engagement._id);
  }
  return [];
}

export async function getScopedEngagementOrThrow(req: Request, engagementId: string) {
  const engagement = await Engagement.findOne({ _id: engagementId, organizationId: req.auth!.organizationId });
  if (!engagement) throw notFound("Engagement not found");
  return engagement;
}

export async function canViewEngagement(req: Request, engagementId: string) {
  const engagement = await getScopedEngagementOrThrow(req, engagementId);
  if (hasPermission(req, "engagement:view:all") || (hasPermission(req, "engagement:view:own") && isOwnEngagement(req, engagement))) {
    return engagement;
  }
  throw forbidden("You cannot view this engagement");
}

export async function canEditEngagement(req: Request, engagementId: string) {
  const engagement = await getScopedEngagementOrThrow(req, engagementId);
  if (hasPermission(req, "engagement:update:all") || (hasPermission(req, "engagement:update:own") && isOwnEngagement(req, engagement))) {
    return engagement;
  }
  throw forbidden("You cannot edit this engagement");
}

export function canViewRawNotes(req: Request) {
  if (!hasPermission(req, "notes:view_raw")) throw forbidden("You cannot view raw notes");
}

export function canManageProductSignal(req: Request) {
  if (
    !hasPermission(req, "product_signal:update") &&
    !hasPermission(req, "product_signal:review") &&
    !hasPermission(req, "product_signal:dismiss") &&
    !hasPermission(req, "product_signal:send_to_roadmap")
  ) {
    throw forbidden("You cannot manage product signals");
  }
}
