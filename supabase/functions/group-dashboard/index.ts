import { authed, body, corsHeaders, isUuid, json } from "../_shared/helpers.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const a = await authed(req);
  if (a.error) return a.error;
  const { group_id } = await body(req);
  if (!isUuid(group_id)) return json({ error: "group_id is required" }, 400);
  // RLS: only members of the group can read it
  const { data: g, error } = await a.client.from("stokvels")
    .select("id,name,balance,target_amount,timeframe_months,target_date").eq("id", group_id).maybeSingle();
  if (error) return json({ error: error.message }, 400);
  if (!g) return json({ error: "Group not found" }, 404);
  const { count } = await a.client.from("members").select("id", { count: "exact", head: true }).eq("stokvel_id", group_id);
  const saved = Number(g.balance), target = Number(g.target_amount);
  return json({
    group_id: g.id, name: g.name, saved_amount: saved, target_amount: target,
    progress_percent: target > 0 ? Math.min(100, Math.round((saved / target) * 1000) / 10) : 0,
    member_count: count ?? 0, timeframe_months: g.timeframe_months, target_date: g.target_date,
  });
});
