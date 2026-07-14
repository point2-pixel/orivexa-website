import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { createAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";

export const runtime = "nodejs";

const MAX_CONTEXT_CHARS = 150_000; // keeps combined documents well within Claude's context window

interface DocRow {
  id: string;
  title: string;
  content: string;
}

function buildDocumentsBlock(docs: DocRow[]): string {
  let used = 0;
  const parts: string[] = [];

  for (const doc of docs) {
    if (used >= MAX_CONTEXT_CHARS) break;
    const remaining = MAX_CONTEXT_CHARS - used;
    const content = doc.content.slice(0, remaining);
    parts.push(`[Document: ${doc.title}]\n${content}`);
    used += content.length;
  }

  return parts.join("\n\n---\n\n");
}

function parseResponse(raw: string): { answer: string; sourceTitles: string[] } {
  const answerMatch = raw.match(/<answer>([\s\S]*?)<\/answer>/i);
  const sourcesMatch = raw.match(/<sources>([\s\S]*?)<\/sources>/i);

  const answer = answerMatch ? answerMatch[1].trim() : raw.trim();
  const sourcesRaw = sourcesMatch ? sourcesMatch[1].trim() : "";
  const sourceTitles =
    sourcesRaw && sourcesRaw.toLowerCase() !== "none"
      ? sourcesRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  return { answer, sourceTitles };
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const query: string | undefined = body?.query;

  if (!query || !query.trim()) {
    return NextResponse.json({ error: "Question is required." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: docs, error } = await supabase
    .from("documents")
    .select("id, title, content")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!docs || docs.length === 0) {
    return NextResponse.json({
      answer:
        "You haven't uploaded any documents yet. Upload a document on the Documents page, then ask me anything about it.",
      sources: [],
    });
  }

  const documentsBlock = buildDocumentsBlock(docs as DocRow[]);

  const systemPrompt = `You are Orivexa AI's assistant. Answer the user's question using ONLY the information in the documents provided below. If the documents don't contain enough information to answer, say so honestly instead of guessing.

Respond in exactly this format, with no text outside the tags:
<answer>
Your answer in plain, concise prose.
</answer>
<sources>
Comma-separated exact titles of the documents you actually used, or "none" if you couldn't answer from them.
</sources>

Documents:
---
${documentsBlock}
---`;

  try {
    const anthropic = createAnthropicClient();
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: query }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "";
    const { answer, sourceTitles } = parseResponse(raw);

    const sources = (docs as DocRow[])
      .filter((d) => sourceTitles.includes(d.title))
      .map((d) => ({ id: d.id, title: d.title }));

    return NextResponse.json({ answer, sources });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
