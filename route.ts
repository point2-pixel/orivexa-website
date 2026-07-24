import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAuthUrl } from "@/lib/google-drive";

export const runtime = "nodejs";

/** Redirects the user to Google's consent screen. Link a "Connect Google
 * Drive" button in Settings to this route (plain <a href>, not fetch). */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", "http://placeholder"));
  }

  try {
    // state carries the user id through the OAuth round-trip so the
    // callback knows whose account to attach the tokens to
    const url = getAuthUrl(user.id);
    return NextResponse.redirect(url);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Google Drive is not configured.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
