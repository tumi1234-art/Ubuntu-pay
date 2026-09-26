import { authed, body, corsHeaders, json } from "../_shared/helpers.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const a = await authed(req);
  if (a.error) return a.error;
  const b = await body(req);
  const name = String(b.name ?? "").trim();
  const target = Number(b.target_amount);
  const months = Number(b.timeframe_months);
  const contribution = Number(b.contribution_amount ?? 0);
  if (!name || name.length > 100) return json({ error: "name is required (max 100 chars)" }, 400);
  if (!(target > 0)) return json({ error: "target_amount must be a positive number" }, 400);
  if (!Number.isInteger(months) || months < 1 || months > 120) return json({ error: "timeframe_months must be 1-120" }, 400);
  const { data, error } = await a.client.rpc("create_savings_group", {
    _name: name, _target: target, _timeframe_months: months,
    _contribution: contribution >= 0 ? contribution : 0,
    _member_name: String(b.member_name ?? "").slice(0, 100),
  });
  if (error) return json({ error: error.message }, 400);
  return json({ group_id: data });
});
