import { z } from "zod";
import { callJsonAi } from "./aiClient";
import { extractedSchema, ExtractedIntelligence } from "../../validators/common";

const extractionPrompt = `You extract deployment intelligence for FDE OS.
Return strict JSON only. No markdown, comments, prose, or code fences.
Use this exact shape:
{
  "customerObjective": string,
  "businessProblem": string,
  "stakeholders": [{"name": string, "role": string, "company": string, "influence": "high|medium|low", "sentiment": "positive|neutral|negative|unknown"}],
  "systemsMentioned": string[],
  "commitments": [{"text": string, "ownerName": string, "ownerType": "Vendor|Customer|Shared", "dueDate": string, "sourceExcerpt": string}],
  "risks": [{"title": string, "description": string, "severity": "Low|Medium|High|Critical", "impact": string, "mitigation": string, "ownerName": string}],
  "blockers": string[],
  "openQuestions": string[],
  "productSignals": [{"theme": string, "signalType": "Feature Request|Integration Gap|Workflow Gap|Security Requirement|UX Issue|Customization Debt|Pricing/Packaging|Competitive Objection", "evidence": string, "customerImpact": string, "suggestedPriority": "Low|Medium|High|Critical"}],
  "recommendedNextSteps": string[]
}`;

function parseJson(text: string) {
  const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
  return JSON.parse(trimmed);
}

export function mockExtraction(rawText: string): ExtractedIntelligence {
  const text = rawText.slice(0, 260);
  const lower = rawText.toLowerCase();
  const systems = ["Salesforce", "Snowflake", "Datadog", "Jira", "Zendesk"].filter((system) =>
    lower.includes(system.toLowerCase())
  );
  return {
    customerObjective: "Operationalize the target workflow with measurable deployment outcomes.",
    businessProblem: text || "Customer needs a clearer deployment path and ownership model.",
    stakeholders: [{ name: "Customer sponsor", role: "Sponsor", company: "Customer", influence: "high", sentiment: "unknown" }],
    systemsMentioned: systems,
    commitments: [
      {
        text: "Share implementation plan and confirm next milestone.",
        ownerName: "FDE team",
        ownerType: "Vendor",
        sourceExcerpt: text
      }
    ],
    risks: lower.includes("security")
      ? [
          {
            title: "Security review may delay validation",
            description: "Security requirements were mentioned and need owner alignment.",
            severity: "High",
            impact: "Validation timeline may slip.",
            mitigation: "Schedule security review and collect requirements.",
            ownerName: "FDE team"
          }
        ]
      : [],
    blockers: lower.includes("blocked") ? ["Customer indicated a blocker requiring follow-up."] : [],
    openQuestions: ["Who owns final production approval?", "What metric defines successful deployment?"],
    productSignals: [
      {
        theme: "Workflow fit",
        signalType: "Workflow Gap",
        evidence: text,
        customerImpact: "May require configuration or product support to avoid custom work.",
        suggestedPriority: "Medium"
      }
    ],
    recommendedNextSteps: ["Confirm owners, dates, and acceptance criteria.", "Turn notes into a deployment checklist."]
  };
}

export async function extractIntelligence(rawText: string): Promise<ExtractedIntelligence> {
  let aiResponse: string | undefined | null;
  try {
    aiResponse = await callJsonAi(extractionPrompt, rawText);
  } catch (error) {
    console.warn("AI extraction provider failed; using mock extraction.", error instanceof Error ? error.message : error);
    return mockExtraction(rawText);
  }
  if (!aiResponse) return mockExtraction(rawText);

  try {
    return extractedSchema.parse(parseJson(aiResponse));
  } catch {
    const repairPrompt = `${extractionPrompt}\nRepair this invalid response into valid JSON matching the schema.`;
    try {
      const repaired = await callJsonAi(repairPrompt, aiResponse);
      if (!repaired) throw new z.ZodError([]);
      return extractedSchema.parse(parseJson(repaired));
    } catch (error) {
      console.warn("AI extraction repair failed; using mock extraction.", error instanceof Error ? error.message : error);
      return mockExtraction(rawText);
    }
  }
}
