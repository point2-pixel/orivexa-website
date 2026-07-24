import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { handleOAuthCallback } from "@/lib/google-drive";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/dashboard/settings?gdrive_error=${encodeURIComponent(error)}`, request.url)
    );
  }
  if (!code) {
    return NextResponse.redirect(
      new URL("/dashboard/settings?gdrive_error=missing_code", request.url)
    );
  }

  try {
    await handleOAuthCallback(code, user.id);
    return NextResponse.redirect(new URL("/dashboard/settings?gdrive_connected=1", request.url));
  } catch (err) {
    const message = err instanceof Error ? err.message : "connection_failed";
    return NextResponse.redirect(
      new URL(`/dashboard/settings?gdrive_error=${encodeURIComponent(message)}`, request.url)
    );
  }
}
