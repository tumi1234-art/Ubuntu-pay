import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Clock, Plus } from "lucide-react";
import { formatZAR } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/lib/auth";

const Contributions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { membership } = useMe();
  const isAdmin = membership && membership.role !== "member";

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["contributions", membership?.stokvel_id],
    enabled: !!membership,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contributions")
        .select("*, member:members(name)")
        .eq("stokvel_id", membership!.stokvel_id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const confirm = async (id: string) => {
    const { error } = await supabase.rpc("confirm_contribution", { _id: id });
    if (error) { toast({ title: "Could not confirm", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Contribution confirmed", description: "Group balance updated." });
    qc.invalidateQueries({ queryKey: ["contributions"] });
    qc.invalidateQueries({ queryKey: ["membership"] });
  };

  const confirmedTotal = list.filter((c) => c.status === "confirmed").reduce((s, c) => s + Number(c.amount), 0);

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/")} className="p-1.5 -ml-1.5 rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold">Contributions</h1>
            <p className="text-xs text-muted-foreground">{formatZAR(confirmedTotal)} confirmed</p>
          </div>
        </div>
        <Button size="sm" className="rounded-full" onClick={() => navigate("/contribute")}>
          <Plus className="w-4 h-4" /> Upload receipt
        </Button>
      </header>

      <main className="px-5 space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && list.length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">No contributions yet. Upload a proof of payment to get started.</Card>
        )}
        {list.map((c) => (
          <Card key={c.id} className="p-3 border-border shadow-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
              {c.status === "confirmed" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{(c as any).member?.name ?? "Member"}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(c.date).toLocaleDateString("en-ZA")}{c.reference ? ` • ${c.reference}` : ""}
              </p>
              <div className="flex gap-1 mt-1">
                <Badge variant="secondary" className="text-[10px] capitalize">{c.status}</Badge>
                {c.verdict && <Badge variant="outline" className="text-[10px]">AI: {c.verdict}</Badge>}
              </div>
            </div>
            <div className="text-right space-y-1">
              <span className="text-sm font-bold text-primary block">{formatZAR(Number(c.amount))}</span>
              {isAdmin && c.status === "pending" && (
                <Button size="sm" className="h-7 text-xs" onClick={() => confirm(c.id)}>Confirm</Button>
              )}
            </div>
          </Card>
        ))}
      </main>
      <BottomNav />
    </div>
  );
};

export default Contributions;
