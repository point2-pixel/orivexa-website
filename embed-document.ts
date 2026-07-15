import { createClient } from "@/lib/supabase/server";
import { chunkText } from "@/lib/chunk-text";
import { embedDocuments } from "@/lib/voyage";

/**
 * Chunks + embeds a single document, storing the results in
 * document_chunks. Lives in lib/ (not app/api/.../route.ts) because
 * Next.js route files may only export HTTP handlers (GET, POST, etc.)
 * — any other export, like this function, breaks the build.
 */
export async function embedAndStoreDocument(
  documentId: string,
  ownerId: string
): Promise<number> {
  const supabase = await createClient();

  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("id, content, workspace_id, owner_id")
    .eq("id", documentId)
    .single();

  if (docError || !doc) {
    throw new Error(docError?.message ?? "Document not found.");
  }
  if (doc.owner_id !== ownerId) {
    throw new Error("Not authorized for this document.");
  }

  const chunks = chunkText(doc.content);
  if (chunks.length === 0) return 0;

  const embeddings = await embedDocuments(chunks.map((c) => c.content));

  const rows = chunks.map((chunk, i) => ({
    document_id: doc.id,
    workspace_id: doc.workspace_id,
    owner_id: doc.owner_id,
    chunk_index: chunk.index,
    content: chunk.content,
    embedding: embeddings[i],
  }));

  // clear any previous chunks first (covers re-upload / re-embed)
  await supabase.from("document_chunks").delete().eq("document_id", doc.id);

  const { error: insertError } = await supabase.from("document_chunks").insert(rows);
  if (insertError) {
    throw new Error(insertError.message);
  }

  return rows.length;
}
