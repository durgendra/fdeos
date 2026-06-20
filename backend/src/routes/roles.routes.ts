import { Router } from "express";
import { z } from "zod";
import { Role } from "../models/Role";
import { User } from "../models/User";
import { requireAuth, requirePermission } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { forbidden, notFound } from "../utils/errors";
import { allPermissions, permissionCatalog } from "../utils/permissions";
import { getDefaultRoleDefinition } from "../services/roleService";

const router = Router();
router.use(requireAuth);

router.get("/", requirePermission("admin:view_roles"), asyncHandler(async (req, res) => {
  ok(res, await Role.find({ organizationId: req.auth!.organizationId }).sort({ key: 1 }));
}));

router.get("/:id", requirePermission("admin:view_roles"), asyncHandler(async (req, res) => {
  const role = await Role.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!role) throw notFound("Role not found");
  ok(res, role);
}));

router.patch(
  "/:id",
  requirePermission("admin:update_roles"),
  validate(z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    defaultLandingPage: z.string().optional(),
    permissions: z.array(z.enum(allPermissions as [string, ...string[]])).optional()
  })),
  asyncHandler(async (req, res) => {
    const role = await Role.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
    if (!role) throw notFound("Role not found");
    if (role.key === "admin" || !role.isEditable) throw forbidden("Admin role is immutable in this release");
    Object.assign(role, req.body);
    await role.save();
    ok(res, role);
  })
);

router.post("/:id/reset-defaults", requirePermission("admin:update_roles"), asyncHandler(async (req, res) => {
  const role = await Role.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!role) throw notFound("Role not found");
  if (role.key === "admin" || !role.isEditable) throw forbidden("Admin role is immutable in this release");
  const defaults = getDefaultRoleDefinition(role.key);
  if (!defaults) throw notFound("Default role definition not found");
  role.permissions = defaults.permissions;
  role.defaultLandingPage = defaults.defaultLandingPage;
  await role.save();
  ok(res, role);
}));

export default router;
