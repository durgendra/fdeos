import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { connectDb } from "../config/db";
import { Commitment } from "../models/Commitment";
import { Engagement } from "../models/Engagement";
import { Organization } from "../models/Organization";
import { ProductSignal } from "../models/ProductSignal";
import { ReadinessItem, readinessDefaults } from "../models/ReadinessItem";
import { Risk } from "../models/Risk";
import { Role } from "../models/Role";
import { StatusUpdate } from "../models/StatusUpdate";
import { User } from "../models/User";
import { createDefaultRoles } from "../services/roleService";

async function seed() {
  await connectDb();
  await Promise.all([
    Commitment.deleteMany({}),
    Risk.deleteMany({}),
    ProductSignal.deleteMany({}),
    ReadinessItem.deleteMany({}),
    StatusUpdate.deleteMany({}),
    Engagement.deleteMany({}),
    User.deleteMany({}),
    Role.deleteMany({}),
    Organization.deleteMany({})
  ]);

  const organization = await Organization.create({ name: "FDE OS Demo", domain: "example.com" });
  await createDefaultRoles(organization._id);
  const roles = Object.fromEntries((await Role.find({ organizationId: organization._id })).map((role) => [role.key, role]));
  const passwordHash = await bcrypt.hash("Password123!", 12);
  const users = await User.insertMany([
    { name: "Admin User", email: "admin@example.com", passwordHash, organizationId: organization._id, roleId: roles.admin._id, roleKey: "admin", role: "admin" },
    { name: "FDE Manager", email: "manager@example.com", passwordHash, organizationId: organization._id, roleId: roles.fde_manager._id, roleKey: "fde_manager", role: "manager" },
    { name: "Field Engineer", email: "fde@example.com", passwordHash, organizationId: organization._id, roleId: roles.fde._id, roleKey: "fde", role: "fde" }
  ]);
  const fde = users[2];

  const customers = [
    ["Acme Logistics", "Logistics", "Workflow Mapping", "Yellow"],
    ["Northstar Bank", "Financial Services", "Technical Scoping", "Red"],
    ["Zenith Health", "Healthcare", "Validation", "Green"],
    ["Atlas Manufacturing", "Industrial", "Prototype", "Yellow"],
    ["Meridian Retail", "Retail", "Discovery", "Green"],
    ["Horizon Energy", "Energy", "Production Hardening", "Yellow"]
  ] as const;

  const engagements = await Engagement.insertMany(customers.map(([customerName, industry, deploymentStage, health], index) => ({
    organizationId: organization._id,
    customerName,
    industry,
    opportunitySize: [250000, 1200000, 600000, 450000, 300000, 900000][index],
    fdeOwnerId: fde._id,
    fdeOwnerName: fde.name,
    executiveSponsor: "VP Operations",
    technicalSponsor: "Platform Lead",
    deploymentStage,
    health,
    primaryObjective: `Deploy AI workflow acceleration for ${customerName}.`,
    businessProblem: "Manual handoffs and fragmented operational data slow deployment outcomes.",
    targetWorkflow: "Customer deployment operations",
    successMetric: "Reduce cycle time by 30%",
    systemsInvolved: ["Salesforce", "Snowflake"],
    currentBlocker: health === "Red" ? "Security approval is not scheduled." : "",
    nextMilestone: "Validate end-to-end workflow with customer sponsor.",
    executiveSummary: `${customerName} is progressing through ${deploymentStage} with clear next steps.`,
    tags: [industry, "demo"]
  })));

  for (const engagement of engagements) {
    await Commitment.create({
      organizationId: organization._id,
      engagementId: engagement._id,
      text: "Confirm production success criteria and owners.",
      ownerName: "FDE team",
      ownerType: "Shared",
      status: "Open",
      createdBy: fde._id
    });
    await Risk.create({
      organizationId: organization._id,
      engagementId: engagement._id,
      title: "Customer data access timing",
      description: "Data readiness may slow validation if schemas are not available.",
      severity: engagement.health === "Red" ? "Critical" : "Medium",
      impact: "Prototype validation may slip.",
      mitigation: "Set a data readiness review with technical sponsor.",
      ownerName: "Platform Lead",
      status: "Monitoring"
    });
    await ProductSignal.create({
      organizationId: organization._id,
      engagementId: engagement._id,
      theme: "Enterprise workflow configuration",
      signalType: "Workflow Gap",
      evidence: "Customer requested configurable approval routing.",
      customerImpact: "Reduces implementation custom work.",
      suggestedPriority: "High",
      status: "New"
    });
    await ReadinessItem.insertMany(readinessDefaults.map((category) => ({
      organizationId: organization._id,
      engagementId: engagement._id,
      category,
      text: `${category} checkpoint`,
      status: category === "Business Readiness" ? "In Progress" : "Not Started"
    })));
    await StatusUpdate.create({
      organizationId: organization._id,
      engagementId: engagement._id,
      tone: "Executive",
      summary: `${engagement.customerName} is moving through ${engagement.deploymentStage}.`,
      completedThisPeriod: ["Completed discovery synthesis"],
      currentBlockers: engagement.currentBlocker ? [engagement.currentBlocker] : [],
      decisionsNeeded: ["Confirm production success metric"],
      nextSteps: ["Run workflow validation session"],
      fullText: `${engagement.customerName}: progress continues with focus on validation, readiness, and next milestone alignment.`,
      createdBy: fde._id
    });
  }

  console.log("Seed complete");
  console.log("Users: admin@example.com, manager@example.com, fde@example.com");
  console.log("Password: Password123!");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
