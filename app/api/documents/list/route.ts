import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("id, title, file_type, created_at, content")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const documents = (data ?? []).map((doc) => ({
    id: doc.id,
    title: doc.title,
    fileType: doc.file_type,
    createdAt: doc.created_at,
    snippet: doc.content.slice(0, 160).trim(),
    charCount: doc.content.length,
  }));

  return NextResponse.json({ documents });
}
