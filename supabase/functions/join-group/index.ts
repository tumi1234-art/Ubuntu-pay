import { authed, body, corsHeaders, json } from "../_shared/helpers.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const a = await authed(req);
  if (a.error) return a.error;
  const b = await body(req);
  const code = String(b.invite_code ?? "").trim();
  if (!/^[A-Za-z0-9]{4,12}$/.test(code)) return json({ error: "invite_code is invalid" }, 400);
  const { data, error } = await a.client.rpc("join_stokvel", {
    _code: code, _member_name: String(b.member_name ?? "").slice(0, 100),
  });
  if (error) return json({ error: error.message }, 400);
  return json({ group_id: data });
});
