import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { createAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";
import { embedQuery } from "@/lib/voyage";

export const runtime = "nodejs";

const MATCH_COUNT = 8; // top-K chunks retrieved per question

interface ChunkMatch {
  id: string;
  document_id: string;
  content: string;
  similarity: number;
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

  const { count: docCount } = await supabase
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id);

  if (!docCount) {
    return NextResponse.json({
      answer:
        "You haven't uploaded any documents yet. Upload a document on the Documents page, then ask me anything about it.",
      sources: [],
    });
  }

  // 1. embed the question
  let queryEmbedding: number[];
  try {
    queryEmbedding = await embedQuery(query);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Embedding failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // 2. retrieve the most relevant chunks for THIS user only —
  // match_owner_id is what enforces isolation, always the server-verified user.id
  const { data: matches, error: matchError } = await supabase.rpc("match_document_chunks", {
    query_embedding: queryEmbedding,
    match_owner_id: user.id,
    match_count: MATCH_COUNT,
  });

  if (matchError) {
    return NextResponse.json({ error: matchError.message }, { status: 500 });
  }

  const chunks = (matches ?? []) as ChunkMatch[];
  if (chunks.length === 0) {
    return NextResponse.json({
      answer:
        "I couldn't find anything in your uploaded documents relevant to that question. (If you just uploaded a document, it may still be indexing.)",
      sources: [],
    });
  }

  // 3. look up titles for the documents these chunks came from
  const docIds = [...new Set(chunks.map((c) => c.document_id))];
  const { data: docs } = await supabase.from("documents").select("id, title").in("id", docIds);
  const titleById = new Map((docs ?? []).map((d) => [d.id, d.title as string]));

  const contextBlock = chunks
    .map((c) => `[Document: ${titleById.get(c.document_id) ?? "Untitled"}]\n${c.content}`)
    .join("\n\n---\n\n");

  const systemPrompt = `You are Orivexa AI's assistant. Answer the user's question using ONLY the excerpts provided below. These are the most relevant passages retrieved from the user's documents — they may not cover everything, so if they don't fully answer the question, say so honestly instead of guessing.

Respond in exactly this format, with no text outside the tags:
<answer>
Your answer in plain, concise prose.
</answer>
<sources>
Comma-separated exact document titles you actually used, or "none" if you couldn't answer from them.
</sources>

Retrieved excerpts:
---
${contextBlock}
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

    const sources = [...titleById.entries()]
      .filter(([, title]) => sourceTitles.includes(title))
      .map(([id, title]) => ({ id, title }));

    return NextResponse.json({ answer, sources });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
