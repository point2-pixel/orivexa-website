import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";

export const runtime = "nodejs";

function extractPlainText(content: Array<{ type: string; text?: string }>): string {
  return content
    .filter((block): block is { type: string; text: string } => block.type === "text" && typeof block.text === "string")
    .map((block) => block.text)
    .join("\n\n")
    .trim();
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const companyName: string | undefined = body?.companyName;
  const competitorName: string | undefined = body?.competitorName;
  const question: string | undefined = body?.question;

  if (!companyName || !competitorName) {
    return NextResponse.json(
      { error: "companyName and competitorName are required." },
      { status: 400 }
    );
  }

  const anthropic = createAnthropicClient();

  const systemPrompt = `You are Orivexa AI's Competitor Watch assistant. The user runs "${companyName}" and wants to know what their competitor "${competitorName}" has recently been doing — marketing campaigns, promotions, product launches, or pricing moves — and get strategic response ideas.

Search the web for ${competitorName}'s recent activity (prioritize the last 30-60 days; if nothing recent turns up, say so honestly instead of inventing anything).

Respond in exactly this format, with no text outside the tags:
<findings>
A concise summary (3-6 sentences) of what you found about ${competitorName}'s recent activity. If you found nothing recent or relevant, say so plainly.
</findings>
<options>
2-3 short, concrete strategic response ideas for ${companyName}, each on its own line starting with a dash. Frame these as suggestions to consider, not guaranteed solutions — you don't have full visibility into ${companyName}'s budget, brand, or strategy.
</options>`;

  const userMessage = question?.trim()
    ? question.trim()
    : `What has ${competitorName} been doing recently, and how should we respond?`;

  try {
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
      tools: [{ type: "web_search_20250305", name: "web_search" }],
    });

    const raw = extractPlainText(message.content);
    const findingsMatch = raw.match(/<findings>([\s\S]*?)<\/findings>/i);
    const optionsMatch = raw.match(/<options>([\s\S]*?)<\/options>/i);

    const findings = findingsMatch ? findingsMatch[1].trim() : raw.trim();
    const optionsRaw = optionsMatch ? optionsMatch[1].trim() : "";
    const options = optionsRaw
      .split("\n")
      .map((line) => line.replace(/^-+\s*/, "").trim())
      .filter(Boolean);

    return NextResponse.json({ findings, options });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
