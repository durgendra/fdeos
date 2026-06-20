import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Organization } from "../models/Organization";
import { Role } from "../models/Role";
import { User } from "../models/User";
import { env } from "../config/env";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { unauthorized } from "../utils/errors";
import { createDefaultRoles } from "../services/roleService";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  organizationName: z.string().min(1),
  domain: z.string().optional()
});

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const org = await Organization.create({ name: req.body.organizationName, domain: req.body.domain });
    await createDefaultRoles(org._id);
    const adminRole = await Role.findOne({ organizationId: org._id, key: "admin" });
    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash,
      organizationId: org._id,
      roleId: adminRole?._id,
      roleKey: "admin",
      role: "admin"
    });
    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: "7d" });
    ok(res, { token, user: sanitizeUser(user), organization: org }, 201);
  })
);

router.post(
  "/login",
  validate(z.object({ email: z.string().email(), password: z.string().min(1) })),
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user || user.disabled) throw unauthorized("Invalid credentials");
    const valid = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!valid) throw unauthorized("Invalid credentials");
    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: "7d" });
    ok(res, { token, user: sanitizeUser(user) });
  })
);

router.get("/me", requireAuth, asyncHandler(async (req, res) => ok(res, req.auth!.user)));

router.get(
  "/effective-session",
  requireAuth,
  asyncHandler(async (req, res) => {
    ok(res, {
      user: req.auth!.user,
      actualRole: req.auth!.actualRole,
      effectiveRole: req.auth!.effectiveRole,
      simulationMode: req.auth!.simulationMode,
      permissions: req.auth!.effectiveRole.permissions,
      defaultLandingPage: req.auth!.effectiveRole.defaultLandingPage
    });
  })
);

function sanitizeUser(user: { _id: unknown; name: string; email: string; roleKey: string; organizationId: unknown }) {
  return { _id: user._id, name: user.name, email: user.email, roleKey: user.roleKey, organizationId: user.organizationId };
}

export default router;
