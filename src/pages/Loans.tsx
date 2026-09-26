import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Plus, Banknote } from "lucide-react";
import { formatZAR } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/lib/auth";

const Loans = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { membership } = useMe();
  const stokvelId = membership?.stokvel_id;
  const isAdmin = membership?.role === "admin" || membership?.role === "treasurer";

  const [showForm, setShowForm] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("3000");
  const [months, setMonths] = useState("6");
  const [interest, setInterest] = useState("5");
  const [saving, setSaving] = useState(false);

  const membersQ = useQuery({
    queryKey: ["members-lite", stokvelId],
    enabled: !!stokvelId,
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select("id, name").eq("stokvel_id", stokvelId!).order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
  const members = membersQ.data ?? [];

  useEffect(() => { if (!memberId && members[0]) setMemberId(members[0].id); }, [members, memberId]);

  const loansQ = useQuery({
    queryKey: ["loans", stokvelId],
    enabled: !!stokvelId && membersQ.isSuccess,
    queryFn: async () => {
      const ids = members.map((m) => m.id);
      if (ids.length === 0) return [];
      const { data, error } = await supabase.from("loans").select("*").in("member_id", ids).order("due_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const list = loansQ.data ?? [];
  const nameOf = (id: string) => members.find((m) => m.id === id)?.name ?? "Member";

  const totalOut = list.filter((l) => l.status === "Active").reduce((s, l) => s + Number(l.remaining), 0);

  const create = async () => {
    const amt = Number(amount), mo = Number(months), rate = Number(interest);
    if (!memberId || !amt || amt <= 0) { toast({ title: "Please complete the form", variant: "destructive" }); return; }
    const total = amt * (1 + rate / 100);
    setSaving(true);
    const { error } = await supabase.from("loans").insert({
      member_id: memberId, amount: amt, remaining: total, interest: rate,
      months_left: mo, total_months: mo, status: "Pending",
      due_date: new Date(Date.now() + mo * 30 * 86400000).toISOString().slice(0, 10),
    });
    setSaving(false);
    if (error) { toast({ title: "Could not create loan", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Loan created", description: `${formatZAR(amt)} for ${nameOf(memberId)} (pending approval).` });
    setShowForm(false);
    qc.invalidateQueries({ queryKey: ["loans", stokvelId] });
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/")} className="p-1.5 -ml-1.5 rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold">Loans</h1>
            <p className="text-xs text-muted-foreground">{formatZAR(totalOut)} outstanding</p>
          </div>
        </div>
        {isAdmin && (
          <Button size="sm" className="rounded-full" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4" /> Create
          </Button>
        )}
      </header>

      <main className="px-5 space-y-3">
        {showForm && isAdmin && (
          <Card className="p-5 border-primary/30 shadow-elevated space-y-3">
            <h3 className="font-semibold text-sm">New loan</h3>
            <div>
              <Label className="text-xs">Member</Label>
              <select value={memberId} onChange={(e) => setMemberId(e.target.value)} className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Amount (R)</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Interest (%)</Label>
                <Input type="number" value={interest} onChange={(e) => setInterest(e.target.value)} className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Repayment period (months)</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {["3", "6", "12"].map((m) => (
                  <button key={m} onClick={() => setMonths(m)} className={`py-2 rounded-lg text-sm font-medium border ${months === m ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border"}`}>
                    {m} mo
                  </button>
                ))}
              </div>
            </div>
            {Number(amount) > 0 && (
              <div className="bg-muted rounded-lg p-3 text-xs space-y-1">
                <div className="flex justify-between"><span>Monthly</span><span className="font-semibold">{formatZAR(Number(amount) * (1 + Number(interest) / 100) / Number(months))}</span></div>
                <div className="flex justify-between"><span>Total repayment</span><span className="font-semibold">{formatZAR(Number(amount) * (1 + Number(interest) / 100))}</span></div>
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
              <Button onClick={create} disabled={saving} className="flex-1">{saving ? "Saving…" : "Create loan"}</Button>
            </div>
          </Card>
        )}

        {loansQ.isLoading && <p className="text-sm text-muted-foreground text-center py-6">Loading loans…</p>}

        {!loansQ.isLoading && list.length === 0 && (
          <Card className="p-8 text-center border-dashed">
            <p className="text-sm text-muted-foreground">No loans yet{isAdmin ? " — tap Create to add one." : "."}</p>
          </Card>
        )}

        {list.map((loan) => {
          const amt = Number(loan.amount), rem = Number(loan.remaining);
          const progress = amt > 0 ? Math.max(0, ((amt - rem) / amt) * 100) : 0;
          return (
            <Card key={loan.id} className="p-4 border-border shadow-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{nameOf(loan.member_id)}</p>
                    <p className="text-[11px] text-muted-foreground">Due {new Date(loan.due_date).toLocaleDateString("en-ZA")}</p>
                  </div>
                </div>
                <Badge className={
                  loan.status === "Active" ? "bg-primary-light text-accent-foreground hover:bg-primary-light" :
                  loan.status === "Paid" ? "bg-muted text-muted-foreground hover:bg-muted" :
                  "bg-warning/15 text-warning hover:bg-warning/15"
                }>
                  {loan.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div><p className="text-muted-foreground">Amount</p><p className="font-semibold text-sm">{formatZAR(amt)}</p></div>
                <div><p className="text-muted-foreground">Remaining</p><p className="font-semibold text-sm">{formatZAR(rem)}</p></div>
              </div>
              {loan.status === "Active" && (
                <>
                  <Progress value={progress} className="h-1.5" />
                  <p className="text-[11px] text-muted-foreground mt-1">{loan.months_left} of {loan.total_months} months remaining</p>
                </>
              )}
            </Card>
          );
        })}
      </main>
      <BottomNav />
    </div>
  );
};

export default Loans;
