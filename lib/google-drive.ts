import { google } from "googleapis";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-only Google Drive OAuth + API helpers. Requires these env vars:
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
 */

function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "Google Drive is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI in Vercel."
    );
  }
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

const SCOPES = [
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

export function getAuthUrl(state: string): string {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state,
  });
}

export async function handleOAuthCallback(code: string, userId: string) {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);

  if (!tokens.refresh_token || !tokens.access_token || !tokens.expiry_date) {
    throw new Error(
      "Google didn't return a refresh token. Disconnect this app in your Google Account permissions and try connecting again."
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("google_drive_connections").upsert({
    user_id: userId,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_expiry: new Date(tokens.expiry_date).toISOString(),
  });
  if (error) throw new Error(error.message);
}

async function getClientForUser(userId: string) {
  const supabase = await createClient();
  const { data: conn, error } = await supabase
    .from("google_drive_connections")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !conn) {
    throw new Error("Google Drive is not connected for this account.");
  }

  const client = getOAuthClient();
  client.setCredentials({
    access_token: conn.access_token,
    refresh_token: conn.refresh_token,
    expiry_date: new Date(conn.token_expiry).getTime(),
  });

  if (new Date(conn.token_expiry).getTime() < Date.now() + 60_000) {
    const { credentials } = await client.refreshAccessToken();
    client.setCredentials(credentials);
    await supabase
      .from("google_drive_connections")
      .update({
        access_token: credentials.access_token,
        token_expiry: new Date(credentials.expiry_date!).toISOString(),
      })
      .eq("user_id", userId);
  }

  return client;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
}

export async function listSupportedFiles(userId: string): Promise<DriveFile[]> {
  const auth = await getClientForUser(userId);
  const drive = google.drive({ version: "v3", auth });

  const supportedMimeTypes = [
    "application/vnd.google-apps.document",
    "application/pdf",
    "text/plain",
    "text/markdown",
  ];
  const q = supportedMimeTypes.map((t) => `mimeType='${t}'`).join(" or ");

  const res = await drive.files.list({
    q: `(${q}) and trashed=false`,
    fields: "files(id,name,mimeType,modifiedTime)",
    pageSize: 50,
    orderBy: "modifiedTime desc",
  });

  return (res.data.files ?? []) as DriveFile[];
}

export async function fetchFileContent(
  userId: string,
  file: DriveFile
): Promise<{ text?: string; buffer?: Buffer }> {
  const auth = await getClientForUser(userId);
  const drive = google.drive({ version: "v3", auth });

  if (file.mimeType === "application/vnd.google-apps.document") {
    const res = await drive.files.export(
      { fileId: file.id, mimeType: "text/plain" },
      { responseType: "text" }
    );
    return { text: res.data as string };
  }

  const res = await drive.files.get(
    { fileId: file.id, alt: "media" },
    { responseType: "arraybuffer" }
  );
  return { buffer: Buffer.from(res.data as ArrayBuffer) };
}
