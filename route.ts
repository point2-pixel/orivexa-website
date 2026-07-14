import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { chunkText } from "@/lib/chunk-text";
import { embedDocuments } from "@/lib/voyage";

export const runtime = "nodejs";

/**
 * Chunks + embeds a single document. Call embedAndStoreDocument()
 * directly (in-process, no network hop) from
 * app/api/documents/upload/route.ts right after the new document
 * row is inserted:
 *
 *   import { embedAndStoreDocument } from "@/app/api/documents/embed/route";
 *   ...
 *   await embedAndStoreDocument(newDoc.id, user.id);
 *
 * This POST endpoint also exists standalone in case you ever need to
 * re-embed a document from the client (e.g. a "reindex" button).
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const documentId: string | undefined = body?.documentId;
  if (!documentId) {
    return NextResponse.json({ error: "documentId is required." }, { status: 400 });
  }

  try {
    const count = await embedAndStoreDocument(documentId, user.id);
    return NextResponse.json({ chunksCreated: count });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Embedding failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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
