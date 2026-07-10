import { createClient } from "@/lib/supabase/server";

export interface CurrentWorkspace {
  id: string;
  name: string;
  slug: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  workspace: CurrentWorkspace | null;
}

/**
 * Fetches the signed-in user along with their workspace (auto-created by
 * the `handle_new_user` Postgres trigger on signup — see supabase/schema.sql).
 * Returns null if no one is signed in.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, name, slug")
    .eq("owner_id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name || user.email?.split("@")[0] || "there",
    workspace: workspace
      ? { id: workspace.id, name: workspace.name, slug: workspace.slug }
      : null,
  };
}
