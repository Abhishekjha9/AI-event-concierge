import Groq from "groq-sdk";
import { GeminiProposalResult } from "@/types/event";

const GROQ_API_KEY = process.env.GROQ_API_KEY as string;

if (!GROQ_API_KEY) {
  throw new Error("Please define GROQ_API_KEY in your .env.local file");
}

const groq = new Groq({ apiKey: GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert corporate event planner with 15+ years of experience planning executive retreats, leadership summits, company offsites, and corporate conferences worldwide.

Analyze the user's event request and recommend the most suitable venue.

Return ONLY valid JSON with no markdown, no code blocks, no explanation — just the raw JSON object.

Format:
{
  "venueName": "Full venue name",
  "location": "City, State/Country",
  "estimatedCost": "$X,XXX - $X,XXX total",
  "justification": "2-3 sentence explanation of why this venue fits the requirements"
}

Rules:
- Recommend realistic, well-known venues that actually exist
- Match the budget constraints precisely
- Match the team size and duration
- Consider logistics, amenities, and activities
- Give a concise, compelling justification
- Always return valid parseable JSON only`;

export async function generateEventProposal(
  userQuery: string
): Promise<GeminiProposalResult> {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userQuery },
    ],
    temperature: 0.7,
    max_tokens: 512,
  });

  const text = response.choices[0]?.message?.content ?? "";

  const cleaned = text
    .replace(/```json\n?/gi, "")
    .replace(/```\n?/gi, "")
    .trim();

  let parsed: GeminiProposalResult;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Groq returned a non-JSON response");
    }
    parsed = JSON.parse(jsonMatch[0]);
  }

  if (
    !parsed.venueName ||
    !parsed.location ||
    !parsed.estimatedCost ||
    !parsed.justification
  ) {
    throw new Error("Groq response is missing required fields");
  }

  return parsed;
}
