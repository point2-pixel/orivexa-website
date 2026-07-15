import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { embedAndStoreDocument } from "@/lib/embed-document";

export const runtime = "nodejs";

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
