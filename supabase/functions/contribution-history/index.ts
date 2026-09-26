import { authed, body, corsHeaders, isUuid, json } from "../_shared/helpers.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const a = await authed(req);
  if (a.error) return a.error;
  const { group_id } = await body(req);
  if (!isUuid(group_id)) return json({ error: "group_id is required" }, 400);
  const { data, error } = await a.client.from("contributions")
    .select("id,amount,status,verdict,confidence,reference,created_at,member_id,members(name)")
    .eq("stokvel_id", group_id).order("created_at", { ascending: true });
  if (error) return json({ error: error.message }, 400);
  let running = 0;
  const rows = (data ?? []).map((c: any) => {
    if (c.status === "confirmed") running += Number(c.amount);
    return {
      id: c.id, member_id: c.member_id, member_name: c.members?.name ?? null,
      amount: Number(c.amount), status: c.status, verdict: c.verdict, confidence: c.confidence,
      reference: c.reference, timestamp: c.created_at, running_balance: running,
    };
  });
  return json({ group_id, contributions: rows.reverse(), total_confirmed: running });
});
