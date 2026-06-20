import { Engagement } from "../../models/Engagement";
import { Commitment } from "../../models/Commitment";
import { Risk } from "../../models/Risk";
import { StatusUpdate } from "../../models/StatusUpdate";
import { callJsonAi } from "./aiClient";
import { z } from "zod";

const statusSchema = z.object({
  summary: z.string(),
  completedThisPeriod: z.array(z.string()).default([]),
  currentBlockers: z.array(z.string()).default([]),
  decisionsNeeded: z.array(z.string()).default([]),
  nextSteps: z.array(z.string()).default([]),
  fullText: z.string()
});

export async function generateStatusUpdate(engagementId: string, organizationId: string, createdBy: string, tone: string) {
  const engagement = await Engagement.findOne({ _id: engagementId, organizationId }).lean();
  if (!engagement) throw new Error("Engagement not found");
  const [commitments, risks] = await Promise.all([
    Commitment.find({ engagementId, organizationId }).sort({ createdAt: -1 }).limit(10).lean(),
    Risk.find({ engagementId, organizationId, status: { $in: ["Open", "Monitoring"] } }).sort({ severity: -1 }).limit(10).lean()
  ]);

  const fallback = {
    summary: `${engagement.customerName} is in ${engagement.deploymentStage} with ${engagement.health} health.`,
    completedThisPeriod: commitments.filter((c) => c.status === "Done").map((c) => c.text).slice(0, 4),
    currentBlockers: risks.map((risk) => risk.title).slice(0, 4),
    decisionsNeeded: engagement.currentBlocker ? [engagement.currentBlocker] : [],
    nextSteps: commitments.filter((c) => c.status !== "Done").map((c) => c.text).slice(0, 4),
    fullText: `${tone} update for ${engagement.customerName}: ${engagement.executiveSummary || engagement.primaryObjective || "Deployment work is progressing."} Next milestone: ${engagement.nextMilestone || "confirm next milestone"}.`
  };

  const prompt = `Return strict JSON only with summary, completedThisPeriod, currentBlockers, decisionsNeeded, nextSteps, fullText. Tone: ${tone}. Context: ${JSON.stringify({ engagement, commitments, risks })}`;
  const aiResponse = await callJsonAi("You create concise customer-facing deployment status updates. Return JSON only.", prompt);
  let parsed: z.SafeParseReturnType<unknown, z.infer<typeof statusSchema>> | null = null;
  if (aiResponse) {
    try {
      parsed = statusSchema.safeParse(JSON.parse(aiResponse));
    } catch {
      parsed = null;
    }
  }
  const generated = parsed?.success ? parsed.data : fallback;

  return StatusUpdate.create({ ...generated, organizationId, engagementId, tone, createdBy });
}
