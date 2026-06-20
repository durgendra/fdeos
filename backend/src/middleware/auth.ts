import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../models/Role";
import { User } from "../models/User";
import { env } from "../config/env";
import { forbidden, unauthorized } from "../utils/errors";

type JwtPayload = { userId: string };

export function getEffectivePermissions(req: Request) {
  return req.auth?.effectiveRole.permissions ?? [];
}

export function hasPermission(req: Request, permission: string) {
  return getEffectivePermissions(req).includes(permission);
}

export function requirePermission(permission: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!hasPermission(req, permission)) return next(forbidden(`Missing permission: ${permission}`));
    return next();
  };
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw unauthorized("Missing bearer token");

    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded.userId).lean();
    if (!user || user.disabled) throw unauthorized("User is not active");

    const actualRole = await Role.findOne({ organizationId: user.organizationId, key: user.roleKey }).lean();
    if (!actualRole) throw unauthorized("User role is unavailable");

    let effectiveRole = actualRole;
    let simulationMode = false;
    const simulatedRole = req.header("X-Simulated-Role");
    if (simulatedRole) {
      if (actualRole.key !== "admin") throw forbidden("Only actual admins can simulate another role");
      if (!["fde", "fde_manager", "executive", "product_manager"].includes(simulatedRole)) {
        throw forbidden("Unsupported simulated role");
      }
      const simulated = await Role.findOne({ organizationId: user.organizationId, key: simulatedRole }).lean();
      if (!simulated) throw forbidden("Simulated role does not exist");
      effectiveRole = simulated;
      simulationMode = true;
    }

    req.auth = {
      userId: user._id.toString(),
      organizationId: user.organizationId.toString(),
      actualRole: {
        id: actualRole._id.toString(),
        key: actualRole.key,
        permissions: actualRole.permissions,
        defaultLandingPage: actualRole.defaultLandingPage
      },
      effectiveRole: {
        id: effectiveRole._id.toString(),
        key: effectiveRole.key,
        permissions: effectiveRole.permissions,
        defaultLandingPage: effectiveRole.defaultLandingPage
      },
      simulationMode,
      user: {
        _id: user._id as any,
        name: user.name,
        email: user.email,
        roleKey: user.roleKey,
        organizationId: user.organizationId as any
      }
    };

    next();
  } catch (error) {
    next(error);
  }
}
