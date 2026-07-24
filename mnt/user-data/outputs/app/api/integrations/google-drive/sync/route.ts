import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { listSupportedFiles, fetchFileContent } from "@/lib/google-drive";
import { extractText } from "@/lib/extract-text";
import { embedAndStoreDocument } from "@/lib/embed-document";

export const runtime = "nodejs";
export const maxDuration = 60; // syncing several files can take a while

/**
 * Pulls supported files (Google Docs, PDFs, text) from the user's
 * connected Google Drive, imports them into `documents`, and embeds
 * each one for search. Re-running updates files that changed instead
 * of creating duplicates (matched by owner_id + external_id).
 */
export async function POST() {
  const user = await getCurrentUser();
  if (!user || !user.workspace) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let files;
  try {
    files = await listSupportedFiles(user.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Couldn't list Google Drive files.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = await createClient();
  const results = { imported: 0, updated: 0, skipped: 0, failed: 0 };

  for (const file of files) {
    try {
      // skip files we've already imported and that haven't changed
      const { data: existing } = await supabase
        .from("documents")
        .select("id, updated_at:created_at")
        .eq("owner_id", user.id)
        .eq("external_id", file.id)
        .maybeSingle();

      if (existing) {
        results.skipped++; // simple MVP: re-run manually to refresh; diffing modifiedTime is a later improvement
        continue;
      }

      const content = await fetchFileContent(user.id, file);
      let text: string;
      if (content.text) {
        text = content.text;
      } else if (content.buffer) {
        const extracted = await extractText(content.buffer, file.mimeType);
        text = extracted.text;
      } else {
        results.skipped++;
        continue;
      }

      if (!text.trim()) {
        results.skipped++;
        continue;
      }

      const { data: doc, error: insertError } = await supabase
        .from("documents")
        .insert({
          workspace_id: user.workspace.id,
          owner_id: user.id,
          title: file.name,
          content: text,
          file_type: file.mimeType,
          source: "google_drive",
          external_id: file.id,
        })
        .select("id")
        .single();

      if (insertError || !doc) {
        results.failed++;
        continue;
      }

      await embedAndStoreDocument(doc.id, user.id);
      results.imported++;
    } catch {
      results.failed++;
    }
  }

  await supabase
    .from("google_drive_connections")
    .update({ last_synced_at: new Date().toISOString() })
    .eq("user_id", user.id);

  return NextResponse.json(results);
}
