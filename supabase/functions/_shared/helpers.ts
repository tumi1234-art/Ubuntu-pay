import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

export { corsHeaders };

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

/** Returns a client acting as the caller (RLS applies) plus the user, or a 401 Response. */
export async function authed(req: Request) {
  const auth = req.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return { error: json({ error: "Unauthorized" }, 401) };
  const client = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: auth } },
  });
  const { data, error } = await client.auth.getUser(auth.slice(7));
  if (error || !data.user) return { error: json({ error: "Unauthorized" }, 401) };
  return { client, user: data.user };
}

export const admin = () =>
  createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

export async function body(req: Request): Promise<Record<string, unknown>> {
  if (req.method === "GET") return Object.fromEntries(new URL(req.url).searchParams);
  try { return await req.json(); } catch { return {}; }
}

export const isUuid = (v: unknown): v is string =>
  typeof v === "string" && /^[0-9a-f-]{36}$/i.test(v);
