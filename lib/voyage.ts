/**
 * Server-only Voyage AI client for embeddings. Never import from a
 * Client Component — VOYAGE_API_KEY must stay server-side.
 *
 * voyage-3.5-lite: cheap, fast, multilingual, 32K token context.
 * Matches migration_002_vector_search.sql's `vector(1024)` column —
 * if you change EMBEDDING_DIMENSIONS, update that column too and
 * re-embed every existing chunk (dimensions must match exactly).
 */

const VOYAGE_API_URL = "https://api.voyageai.com/v1/embeddings";
const VOYAGE_MODEL = "voyage-3.5-lite";
export const EMBEDDING_DIMENSIONS = 1024;

interface VoyageEmbeddingResponse {
  data: { embedding: number[]; index: number }[];
}

async function callVoyage(
  input: string[],
  inputType: "document" | "query"
): Promise<number[][]> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "VOYAGE_API_KEY is not set. Add it in Vercel → Settings → Environment Variables (get a key at dash.voyageai.com)."
    );
  }

  const res = await fetch(VOYAGE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input,
      model: VOYAGE_MODEL,
      input_type: inputType,
      output_dimension: EMBEDDING_DIMENSIONS,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Voyage API error (${res.status}): ${text}`);
  }

  const json = (await res.json()) as VoyageEmbeddingResponse;
  return json.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

/** Embed document chunks at index/upload time. Batches automatically. */
export async function embedDocuments(texts: string[]): Promise<number[][]> {
  const BATCH_SIZE = 100;
  const results: number[][] = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    results.push(...(await callVoyage(batch, "document")));
  }
  return results;
}

/** Embed a single user question at search time. */
export async function embedQuery(text: string): Promise<number[]> {
  const [embedding] = await callVoyage([text], "query");
  return embedding;
}
