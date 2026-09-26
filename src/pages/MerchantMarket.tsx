import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Zap, Lock, Unlock, Store, CheckCircle2 } from "lucide-react";
import { formatZAR } from "@/lib/mockData";
import { useIsAdmin } from "@/lib/userStore";
import { useMe } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Offer = Tables<"offers">;

const CLAIM_KEY = "ubuntupay_offer_claims";

const MerchantMarket = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { membership } = useMe();
  const isAdmin = useIsAdmin();
  const [selected, setSelected] = useState<Offer | null>(null);
  const [claims, setClaims] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(CLAIM_KEY) || "[]"); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem(CLAIM_KEY, JSON.stringify(claims)); }, [claims]);

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("active", true)
        .order("threshold_amount", { ascending: true });
      if (error) throw error;
      return data as Offer[];
    },
  });

  // Real stokvel balance from the database
  const saved = membership?.stokvel.balance ?? 0;
  const groupName = membership?.stokvel.name ?? "Your stokvel";
  const unlockedCount = offers.filter((o) => saved >= o.threshold_amount).length;

  const claim = (o: Offer) => {
    if (claims.includes(o.id)) return;
    setClaims([...claims, o.id]);
    toast({ title: "Offer claimed", description: `${o.merchant_name} will contact your group admin.` });
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <header className="px-5 pt-6 pb-3 flex items-center gap-2">
        <button onClick={() => navigate("/")} className="p-1.5 -ml-1.5 rounded-full hover:bg-muted"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="font-display text-xl font-bold">Merchant Marketplace</h1>
          <p className="text-xs text-muted-foreground">Turn your savings into buying power</p>
        </div>
      </header>

      <main className="px-5 space-y-3">
        {/* Ubuntu Power */}
        <Card className="p-5 bg-primary text-primary-foreground border-0 shadow-card">
          <div className="flex items-center gap-2 text-xs font-semibold opacity-90"><Zap className="w-4 h-4" /> UBUNTU POWER</div>
          <p className="font-display text-3xl font-bold mt-1">{formatZAR(saved)}</p>
          <p className="text-xs opacity-90 mt-1">
            Ubuntu Power is your group's savings turned into spending power. {groupName} has saved {formatZAR(saved)} — the more the group saves, the more offers below unlock.
          </p>
          <div className="flex gap-4 mt-3 text-xs">
            <span><b>{unlockedCount}</b> offers unlocked</span>
            <span><b>{offers.length - unlockedCount}</b> still locked</span>
          </div>
        </Card>

        {/* Unlock rule */}
        <Card className="p-3 border-dashed border-primary/40 bg-primary-light/40">
          <p className="text-[11px]"><b>Ubuntu Unlock rule:</b> an offer opens once your group's total savings reach the merchant's target. No credit score needed.</p>
        </Card>

        {isLoading && <p className="text-sm text-muted-foreground text-center py-6">Loading offers…</p>}

        {!isLoading && offers.length === 0 && (
          <Card className="p-8 text-center border-dashed">
            <Store className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No offers available right now. Check back soon.</p>
          </Card>
        )}

        {offers.map((o) => {
          const isUnlocked = saved >= o.threshold_amount;
          const remaining = o.threshold_amount - saved;
          const pct = Math.min(100, (saved / o.threshold_amount) * 100);
          const claimed = claims.includes(o.id);
          return (
            <Card
              key={o.id}
              onClick={() => setSelected(o)}
              className={`p-4 border-border shadow-card cursor-pointer transition ${isUnlocked ? "hover:border-primary/40" : "opacity-60 grayscale"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isUnlocked ? "bg-primary-light text-primary" : "bg-muted text-muted-foreground"}`}>
                  <Store className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{o.merchant_name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{o.description}</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="flex items-center gap-1 font-medium">
                    {isUnlocked
                      ? <><Unlock className="w-3 h-3 text-primary" /> Unlocked</>
                      : <><Lock className="w-3 h-3" /> {formatZAR(remaining)} more to unlock</>}
                  </span>
                  <span className="text-primary font-semibold">{claimed ? "Claimed ✓" : "View →"}</span>
                </div>
                <Progress value={pct} className="h-1.5" />
              </div>
            </Card>
          );
        })}
      </main>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-sm">
          {selected && (() => {
            const ok = saved >= selected.threshold_amount;
            const claimed = claims.includes(selected.id);
            return (
              <>
                <DialogHeader><DialogTitle>{selected.merchant_name}</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{selected.description}</p>
                  <div className="bg-muted rounded-lg p-2 text-xs">
                    <p className="text-muted-foreground">Unlocks at</p>
                    <p className="font-semibold">{formatZAR(selected.threshold_amount)} in group savings</p>
                  </div>
                  <div className={`rounded-lg p-3 text-xs flex gap-2 ${ok ? "bg-primary-light" : "bg-muted"}`}>
                    {ok ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> : <Lock className="w-4 h-4 shrink-0" />}
                    <span>{ok ? "Your group qualifies: savings are above the unlock target." : `Your group needs ${formatZAR(selected.threshold_amount - saved)} more savings to qualify.`}</span>
                  </div>
                  <Button className="w-full" disabled={!ok || claimed || !isAdmin} onClick={() => claim(selected)}>
                    {claimed ? "Claimed" : !ok ? "Locked" : isAdmin ? "Claim for my group" : "Ask your admin to claim"}
                  </Button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
      <BottomNav />
    </div>
  );
};

export default MerchantMarket;
