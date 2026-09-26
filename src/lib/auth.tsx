import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    return () => sub.subscription.unsubscribe();
  }, []);
  return { session, loading };
};

export type Membership = Tables<"members"> & { stokvel: Tables<"stokvels"> };

export const useMembership = (userId?: string) =>
  useQuery({
    queryKey: ["membership", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Membership | null> => {
      const { data, error } = await supabase
        .from("members")
        .select("*, stokvel:stokvels(*)")
        .eq("auth_user_id", userId!)
        .order("joined", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as Membership) ?? null;
    },
  });

/** Current signed-in user's membership (or null). */
export const useMe = () => {
  const { session } = useSession();
  const q = useMembership(session?.user.id);
  return { session, membership: q.data ?? null, isLoading: q.isLoading, refetch: q.refetch };
};

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading…</div>
);

export const RequireAuth = ({ children, allowNoStokvel = false }: { children: JSX.Element; allowNoStokvel?: boolean }) => {
  const { session, loading } = useSession();
  const location = useLocation();
  const m = useMembership(session?.user.id);
  if (loading) return <Loader />;
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (allowNoStokvel) return children;
  if (m.isLoading) return <Loader />;
  if (!m.data) return <Navigate to="/setup" replace />;
  return children;
};
