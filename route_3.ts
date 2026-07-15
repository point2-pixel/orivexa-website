import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { extractText, MAX_UPLOAD_BYTES, SUPPORTED_EXTENSIONS } from "@/lib/extract-text";
import { embedAndStoreDocument } from "@/lib/embed-document";

// PDF/DOCX/XLSX parsing needs Node APIs (fs, buffers) — must run on the
// Node runtime, not the Edge runtime.
export const runtime = "nodejs";

/**
 * Supabase Storage object keys only allow a safe subset of characters.
 * Cyrillic, spaces, and other non-ASCII characters cause an
 * "Invalid key" error at upload time. This strips the storage key down
 * to something safe while leaving the original filename untouched in
 * the `title` column, so the user still sees their real filename.
 */
function sanitizeFilename(name: string): string {
  const dotIndex = name.lastIndexOf(".");
  const base = dotIndex > 0 ? name.slice(0, dotIndex) : name;
  const ext = dotIndex > 0 ? name.slice(dotIndex) : "";

  const safeBase = base
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accent marks
    .replace(/[^a-zA-Z0-9-_]+/g, "-") // anything else (incl. Cyrillic, spaces) → dash
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return (safeBase || "file") + ext.toLowerCase();
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !user.workspace) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "File is too large. Maximum size is 15 MB." },
      { status: 400 }
    );
  }

  const extension = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    return NextResponse.json(
      {
        error: `Unsupported file type "${extension}". Supported: ${SUPPORTED_EXTENSIONS.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let extracted;
  try {
    extracted = await extractText(buffer, file.type || extension);
  } catch {
    return NextResponse.json(
      { error: "Couldn't read this file. It may be corrupted or password-protected." },
      { status: 400 }
    );
  }

  if (!extracted.text) {
    return NextResponse.json(
      { error: "No readable text found in this file." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const safeName = sanitizeFilename(file.name);
  const storagePath = `${user.id}/${crypto.randomUUID()}-${safeName}`;
  const { error: storageError } = await supabase.storage
    .from("documents")
    .upload(storagePath, buffer, {
      contentType: file.type || "application/octet-stream",
    });

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  const { data: doc, error: dbError } = await supabase
    .from("documents")
    .insert({
      workspace_id: user.workspace.id,
      owner_id: user.id,
      title: file.name,
      content: extracted.text,
      storage_path: storagePath,
      file_type: extension,
    })
    .select("id, title, file_type, created_at")
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  let embeddingError: string | null = null;
  try {
    await embedAndStoreDocument(doc.id, user.id);
  } catch (err) {
    embeddingError = err instanceof Error ? err.message : "Embedding failed.";
  }

  return NextResponse.json({
    document: doc,
    truncated: extracted.truncated,
    ...(embeddingError ? { embeddingError } : {}),
  });
}
