import { admin, authed, body, corsHeaders, isUuid, json } from "../_shared/helpers.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const a = await authed(req);
  if (a.error) return a.error;
  const b = await body(req);
  const { group_id, imageBase64, mimeType } = b;
  const amount = Number(b.amount);
  const reference = b.reference ? String(b.reference).slice(0, 100) : null;
  if (!isUuid(group_id)) return json({ error: "group_id is required" }, 400);
  if (!(amount > 0)) return json({ error: "amount must be positive" }, 400);
  if (typeof imageBase64 !== "string" || !imageBase64) return json({ error: "imageBase64 is required" }, 400);

  const { data: me } = await a.client.from("members").select("id")
    .eq("stokvel_id", group_id).eq("auth_user_id", a.user.id).maybeSingle();
  if (!me) return json({ error: "You are not a member of this group" }, 403);

  // Call the existing verify-receipt function
  const vr = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/verify-receipt`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: req.headers.get("Authorization")! },
    body: JSON.stringify({ imageBase64, mimeType, expectedAmount: amount, expectedReference: reference }),
  });
  const verification = await vr.json();
  if (!vr.ok) return json({ error: verification.error ?? "Verification failed" }, vr.status);

  // Member inserts as pending (RLS enforces own membership)
  const { data: c, error } = await a.client.from("contributions").insert({
    member_id: me.id, stokvel_id: group_id, amount, reference, method: "EFT",
    verdict: verification.verdict, confidence: verification.confidence,
    red_flags: verification.red_flags ?? [], verification, status: "pending",
  }).select("id").single();
  if (error) return json({ error: error.message }, 400);

  let status = "pending";
  if (verification.verdict === "genuine") {
    const { error: e2 } = await admin().rpc("auto_confirm_contribution", { _id: c.id });
    if (e2) console.error("auto-confirm failed", e2); else status = "confirmed";
  }
  return json({ contribution_id: c.id, status, verification });
});
