import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { Role } from "../models/Role";
import { User } from "../models/User";
import { requireAuth, requirePermission } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { forbidden, notFound } from "../utils/errors";

const router = Router();
router.use(requireAuth);

router.get("/", requirePermission("admin:view_users"), asyncHandler(async (req, res) => {
  const users = await User.find({ organizationId: req.auth!.organizationId }).select("-passwordHash").sort({ name: 1 });
  ok(res, users);
}));

router.post(
  "/",
  requirePermission("admin:create_users"),
  validate(z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8).default("Password123!"),
    roleKey: z.enum(["admin", "fde", "fde_manager", "executive", "product_manager"])
  })),
  asyncHandler(async (req, res) => {
    const role = await Role.findOne({ organizationId: req.auth!.organizationId, key: req.body.roleKey });
    if (!role) throw notFound("Role not found");
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash: await bcrypt.hash(req.body.password, 12),
      organizationId: req.auth!.organizationId,
      roleId: role._id,
      roleKey: role.key,
      role: role.key === "admin" ? "admin" : role.key === "fde" ? "fde" : "manager"
    });
    ok(res, await User.findById(user._id).select("-passwordHash"), 201);
  })
);

router.patch("/:id", requirePermission("admin:update_users"), validate(z.object({ name: z.string().min(1).optional(), email: z.string().email().optional() })), asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate({ _id: req.params.id, organizationId: req.auth!.organizationId }, req.body, { new: true }).select("-passwordHash");
  if (!user) throw notFound("User not found");
  ok(res, user);
}));

router.patch("/:id/role", requirePermission("admin:update_users"), validate(z.object({ roleKey: z.enum(["admin", "fde", "fde_manager", "executive", "product_manager"]) })), asyncHandler(async (req, res) => {
  const target = await User.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!target) throw notFound("User not found");
  if (target._id.toString() === req.auth!.userId && req.body.roleKey !== "admin") throw forbidden("You cannot remove your own admin role");
  if (target.roleKey === "admin" && req.body.roleKey !== "admin") await assertNotLastAdmin(req.auth!.organizationId);
  const role = await Role.findOne({ organizationId: req.auth!.organizationId, key: req.body.roleKey });
  if (!role) throw notFound("Role not found");
  target.roleKey = role.key as any;
  target.roleId = role._id as any;
  target.role = role.key === "admin" ? "admin" : role.key === "fde" ? "fde" : "manager";
  await target.save();
  ok(res, await User.findById(target._id).select("-passwordHash"));
}));

router.patch("/:id/disable", requirePermission("admin:disable_users"), asyncHandler(async (req, res) => {
  const target = await User.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!target) throw notFound("User not found");
  if (target._id.toString() === req.auth!.userId) throw forbidden("You cannot disable yourself");
  if (target.roleKey === "admin") await assertNotLastAdmin(req.auth!.organizationId);
  target.disabled = true;
  await target.save();
  ok(res, await User.findById(target._id).select("-passwordHash"));
}));

async function assertNotLastAdmin(organizationId: string) {
  const adminCount = await User.countDocuments({ organizationId, roleKey: "admin", disabled: false });
  if (adminCount <= 1) throw forbidden("Cannot remove the last active admin");
}

export default router;
