import { z } from "zod";

export const objectIdParam = z.object({ id: z.string().min(1) });
export const engagementIdParam = z.object({ engagementId: z.string().min(1) });

export const sourceTypeSchema = z.enum(["Meeting Notes", "Transcript", "Slack Snippet", "Email Excerpt", "Sales Notes", "Other"]);
export const toneSchema = z.enum(["Executive", "Technical", "Customer-Friendly"]);
export const ownerTypeSchema = z.enum(["Vendor", "Customer", "Shared"]);
export const commitmentStatusSchema = z.enum(["Open", "Waiting", "Done", "At Risk"]);
export const riskSeveritySchema = z.enum(["Low", "Medium", "High", "Critical"]);
export const riskStatusSchema = z.enum(["Open", "Monitoring", "Mitigated", "Accepted"]);
export const prioritySchema = z.enum(["Low", "Medium", "High", "Critical"]);
export const productSignalTypeSchema = z.enum([
  "Feature Request",
  "Integration Gap",
  "Workflow Gap",
  "Security Requirement",
  "UX Issue",
  "Customization Debt",
  "Pricing/Packaging",
  "Competitive Objection"
]);

export const extractedSchema = z.object({
  customerObjective: z.string().default(""),
  businessProblem: z.string().default(""),
  stakeholders: z.array(z.object({
    name: z.string(),
    role: z.string().default(""),
    company: z.string().default(""),
    influence: z.enum(["high", "medium", "low"]).default("medium"),
    sentiment: z.enum(["positive", "neutral", "negative", "unknown"]).default("unknown")
  })).default([]),
  systemsMentioned: z.array(z.string()).default([]),
  commitments: z.array(z.object({
    text: z.string(),
    ownerName: z.string().default(""),
    ownerType: ownerTypeSchema.default("Vendor"),
    dueDate: z.string().optional(),
    sourceExcerpt: z.string().default("")
  })).default([]),
  risks: z.array(z.object({
    title: z.string(),
    description: z.string().default(""),
    severity: riskSeveritySchema.default("Medium"),
    impact: z.string().default(""),
    mitigation: z.string().default(""),
    ownerName: z.string().default("")
  })).default([]),
  blockers: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
  productSignals: z.array(z.object({
    theme: z.string(),
    signalType: productSignalTypeSchema.default("Feature Request"),
    evidence: z.string().default(""),
    customerImpact: z.string().default(""),
    suggestedPriority: prioritySchema.default("Medium")
  })).default([]),
  recommendedNextSteps: z.array(z.string()).default([])
});

export type ExtractedIntelligence = z.infer<typeof extractedSchema>;
