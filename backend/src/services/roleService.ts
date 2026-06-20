import { Types } from "mongoose";
import { Role } from "../models/Role";
import { defaultRoleDefinitions } from "../utils/permissions";

export async function createDefaultRoles(organizationId: Types.ObjectId) {
  const roles = [];
  for (const definition of defaultRoleDefinitions) {
    roles.push(
      await Role.findOneAndUpdate(
        { organizationId, key: definition.key },
        { ...definition, organizationId },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    );
  }
  return roles;
}

export function getDefaultRoleDefinition(key: string) {
  return defaultRoleDefinitions.find((role) => role.key === key);
}
