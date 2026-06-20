import { Commitment } from "../models/Commitment";
import { Engagement, deploymentStages } from "../models/Engagement";
import { ProductSignal } from "../models/ProductSignal";
import { Risk } from "../models/Risk";
import { Types } from "mongoose";

export async function getDashboardSummary(organizationId: string) {
  const [engagements, openCommitments, signals, criticalRisks] = await Promise.all([
    Engagement.find({ organizationId }).sort({ lastActivityAt: -1 }).lean(),
    Commitment.countDocuments({ organizationId, status: { $ne: "Done" } }),
    ProductSignal.find({ organizationId }).sort({ createdAt: -1 }).limit(8).lean(),
    Risk.find({ organizationId, severity: { $in: ["High", "Critical"] }, status: { $in: ["Open", "Monitoring"] } }).limit(8).lean()
  ]);

  const stageIndex = new Map(deploymentStages.map((stage, index) => [stage, index + 1]));
  const avgStageProgress = engagements.length
    ? Math.round((engagements.reduce((sum, engagement) => sum + (stageIndex.get(engagement.deploymentStage as never) ?? 1), 0) / engagements.length / deploymentStages.length) * 100)
    : 0;

  return {
    activeDeployments: engagements.length,
    atRiskAccounts: engagements.filter((engagement) => engagement.health !== "Green").length,
    openCommitments,
    productSignalsCaptured: await ProductSignal.countDocuments({ organizationId }),
    avgStageProgress,
    deploymentsByStage: deploymentStages.map((stage) => ({ stage, count: engagements.filter((e) => e.deploymentStage === stage).length })),
    healthBreakdown: ["Green", "Yellow", "Red"].map((health) => ({ health, count: engagements.filter((e) => e.health === health).length })),
    criticalRisks,
    recentProductSignals: signals,
    activeEngagements: engagements.slice(0, 10)
  };
}

export async function getProductIntelligence(organizationId: string) {
  return ProductSignal.aggregate([
    { $match: { organizationId: new Types.ObjectId(organizationId) } },
    {
      $group: {
        _id: "$theme",
        frequency: { $sum: 1 },
        customersAffected: { $addToSet: "$engagementId" },
        suggestedPriority: { $max: "$suggestedPriority" },
        evidenceSnippets: { $push: "$evidence" }
      }
    },
    {
      $project: {
        theme: "$_id",
        frequency: 1,
        customersAffected: { $size: "$customersAffected" },
        opportunityImpact: "$frequency",
        suggestedPriority: 1,
        evidenceSnippets: { $slice: ["$evidenceSnippets", 5] },
        _id: 0
      }
    },
    { $sort: { frequency: -1 } }
  ]);
}
