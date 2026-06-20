import { Router } from "express";
import { requireAuth, hasPermission } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { getDashboardSummary, getProductIntelligence } from "../services/dashboardService";
import { forbidden } from "../utils/errors";

const router = Router();
router.use(requireAuth);
router.get("/summary", asyncHandler(async (req, res) => {
  if (!["dashboard:view_my", "dashboard:view_command_center", "dashboard:view_executive"].some((permission) => hasPermission(req, permission))) {
    throw forbidden("Missing dashboard view permission");
  }
  ok(res, await getDashboardSummary(req.auth!.organizationId));
}));
router.get("/product-intelligence", asyncHandler(async (req, res) => {
  if (!hasPermission(req, "dashboard:view_product_intelligence")) throw forbidden("Missing product intelligence dashboard permission");
  ok(res, await getProductIntelligence(req.auth!.organizationId));
}));
export default router;
