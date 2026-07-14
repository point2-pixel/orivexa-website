import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { createAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";
import { embedQuery } from "@/lib/voyage";

export const runtime = "nodejs";

const MATCH_COUNT = 8;
const MAX_HISTORY_TURNS = 10; // last N messages kept for conversational context

interface ChunkMatch {
  id: string;
  document_id: string;
  content: string;
  similarity: number;
}

interface HistoryTurn {
  role: "user" | "assistant";
  content: string;
}

function parseTaggedResponse(raw: string): { answer: string; sourceTitles: string[] } {
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

/** Concatenates every text block in order — with tool use (web search),
 * Claude can return several text segments interleaved with tool calls. */
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
  const query: string | undefined = body?.query;
  const rawHistory: HistoryTurn[] = Array.isArray(body?.history) ? body.history : [];

  if (!query || !query.trim()) {
    return NextResponse.json({ error: "Question is required." }, { status: 400 });
  }

  // client resends the plain-text conversation so far (answers already
  // stripped of <answer>/<sources> tags) — we just cap it defensively
  const history = rawHistory
    .filter((t) => (t.role === "user" || t.role === "assistant") && typeof t.content === "string")
    .slice(-MAX_HISTORY_TURNS);

  const supabase = await createClient();

  const { count: docCount } = await supabase
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id);

  let chunks: ChunkMatch[] = [];
  let titleById = new Map<string, string>();

  if (docCount && docCount > 0) {
    let queryEmbedding: number[] | null = null;
    try {
      queryEmbedding = await embedQuery(query);
    } catch {
      queryEmbedding = null; // fall through to web mode instead of hard-failing
    }

    if (queryEmbedding) {
      const { data: matches } = await supabase.rpc("match_document_chunks", {
        query_embedding: queryEmbedding,
        match_owner_id: user.id,
        match_count: MATCH_COUNT,
      });
      chunks = (matches ?? []) as ChunkMatch[];

      if (chunks.length > 0) {
        const docIds = [...new Set(chunks.map((c) => c.document_id))];
        const { data: docs } = await supabase.from("documents").select("id, title").in("id", docIds);
        titleById = new Map((docs ?? []).map((d) => [d.id, d.title as string]));
      }
    }
  }

  const anthropic = createAnthropicClient();
  const historyMessages = history.map((h) => ({ role: h.role, content: h.content }));

  // ── DOCUMENT MODE — relevant chunks found, answer grounded only in them ──
  if (chunks.length > 0) {
    const contextBlock = chunks
      .map((c) => `[Document: ${titleById.get(c.document_id) ?? "Untitled"}]\n${c.content}`)
      .join("\n\n---\n\n");

    const systemPrompt = `You are Orivexa AI's assistant, having an ongoing conversation with the user about their uploaded documents. Answer using ONLY the information in the excerpts below (plus the conversation so far for context). These are the most relevant passages retrieved for the LATEST question — they may not cover everything, so say so honestly instead of guessing if they don't.

Respond in exactly this format, with no text outside the tags:
<answer>
Your answer in plain, concise prose. You may reference earlier parts of the conversation naturally.
</answer>
<sources>
Comma-separated exact document titles you actually used for THIS answer, or "none" if you couldn't answer from them.
</sources>

Retrieved excerpts for the latest question:
---
${contextBlock}
---`;

    try {
      const message = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1500,
        system: systemPrompt,
        messages: [...historyMessages, { role: "user", content: query }],
      });

      const raw = extractPlainText(message.content);
      const { answer, sourceTitles } = parseTaggedResponse(raw);
      const sources = [...titleById.entries()]
        .filter(([, title]) => sourceTitles.includes(title))
        .map(([id, title]) => ({ id, title }));

      return NextResponse.json({ answer, sources, mode: "documents" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  // ── WEB MODE — no documents uploaded, or nothing relevant found ──
  const noDocsAtAll = !docCount || docCount === 0;
  const systemPrompt = noDocsAtAll
    ? `You are Orivexa AI's assistant. The user hasn't uploaded any documents yet, so answer their question using web search and your own knowledge. Be clear and helpful, and briefly mention this answer isn't based on any of their documents (since they haven't uploaded any yet).`
    : `You are Orivexa AI's assistant. Nothing in the user's uploaded documents was relevant to this specific question, so answer using web search and your own knowledge instead. Briefly mention that this particular answer isn't based on their documents.`;

  try {
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [...historyMessages, { role: "user", content: query }],
      tools: [{ type: "web_search_20250305", name: "web_search" }],
    });

    const answer = extractPlainText(message.content);
    return NextResponse.json({ answer, sources: [], mode: "web" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
