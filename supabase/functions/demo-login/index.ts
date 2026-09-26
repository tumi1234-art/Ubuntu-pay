import { admin, corsHeaders, json } from "../_shared/helpers.ts";

const DEMO_EMAIL = "demo@ubuntupay.app";
const DEMO_PASSWORD = "UbuntuDemo2026!";
const DEMO_NAME = "Demo Admin";
const STOKVEL_NAME = "Ubuntu Demo Stokvel";

// Idempotent: creates a confirmed demo user + a demo stokvel (with the user as
// admin) on first call, then just returns the credentials on later calls.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const svc = admin();

    // 1. Find or create the demo auth user (email pre-confirmed).
    let userId: string | null = null;
    const { data: list } = await svc.auth.admin.listUsers({ perPage: 1000 });
    const existing = list?.users?.find((u) => u.email === DEMO_EMAIL);
    if (existing) {
      userId = existing.id;
      // Keep the password in sync in case it was changed.
      await svc.auth.admin.updateUserById(userId, { password: DEMO_PASSWORD, email_confirm: true });
    } else {
      const { data: created, error: createErr } = await svc.auth.admin.createUser({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { name: DEMO_NAME },
      });
      if (createErr || !created.user) return json({ error: createErr?.message ?? "Could not create demo user" }, 500);
      userId = created.user.id;
    }

    // 2. Find or create the demo stokvel with this user as admin member.
    const { data: existingMember } = await svc
      .from("members")
      .select("id, stokvel_id")
      .eq("auth_user_id", userId)
      .maybeSingle();

    if (!existingMember) {
      const { data: stokvel, error: sErr } = await svc
        .from("stokvels")
        .insert({
          name: STOKVEL_NAME,
          contribution_amount: 500,
          monthly_target: 500,
          target_amount: 30000,
          timeframe_months: 12,
          created_by: userId,
        })
        .select("id")
        .single();
      if (sErr || !stokvel) return json({ error: sErr?.message ?? "Could not create demo stokvel" }, 500);

      const { error: mErr } = await svc.from("members").insert({
        auth_user_id: userId,
        stokvel_id: stokvel.id,
        name: DEMO_NAME,
        email: DEMO_EMAIL,
        role: "admin",
      });
      if (mErr) return json({ error: mErr.message }, 500);
    }

    return json({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Demo login failed" }, 500);
  }
});
