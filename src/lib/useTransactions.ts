import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/lib/auth";

export type Txn = { id: string; date: string; type: string; amount: number; balance: number; member: string; positive: boolean };

const OUT_TYPES = ["withdrawal", "payout", "loan disbursement", "loan"];

export const useTransactions = () => {
  const { membership } = useMe();
  const stokvelId = membership?.stokvel_id;
  const q = useQuery({
    queryKey: ["transactions-all", stokvelId],
    enabled: !!stokvelId,
    queryFn: async (): Promise<Txn[]> => {
      const { data, error } = await supabase
        .from("transactions")
        .select("id, type, amount, balance_after, date, member:members(name)")
        .eq("stokvel_id", stokvelId!)
        .order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((t: any) => {
        const out = OUT_TYPES.includes(String(t.type).toLowerCase()) || Number(t.amount) < 0;
        const abs = Math.abs(Number(t.amount));
        return {
          id: t.id, date: t.date, type: t.type, balance: Number(t.balance_after),
          member: t.member?.name ?? "Stokvel", positive: !out, amount: out ? -abs : abs,
        };
      });
    },
  });
  return { ...q, transactions: q.data ?? [] };
};

export const monthLabel = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
