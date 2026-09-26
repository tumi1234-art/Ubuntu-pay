import { Bell, Users, Wallet, TrendingUp, Plus, FileText, Calendar, CheckCircle2, AlertCircle, Banknote, Sparkles, Store, Gavel, Shield, Vote as VoteIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ubuntuPayLogo from "@/assets/ubuntupay-logo.png";
import { members as mockMembers, contributions as mockContributions, loans as mockLoans, formatZAR } from "@/lib/mockData";
import { useStokvel, useUser, usePlan, useIsAdmin } from "@/lib/userStore";
import { useMe } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });

const Index = () => {
  const navigate = useNavigate();
  const localUser = useUser();
  const localStokvel = useStokvel();
  const plan = usePlan();
  const { membership } = useMe();
  const localIsAdmin = useIsAdmin();
  const isAdmin = membership ? membership.role !== "member" : localIsAdmin;
  const s = membership?.stokvel;
  const stokvelId = s?.id ?? null;

  const user = membership
    ? { ...localUser, name: membership.name, initials: membership.name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") }
    : localUser;
  const stokvel = s
    ? { ...localStokvel, name: s.name, balance: Number(s.balance), monthlyTarget: Number(s.monthly_target) || 1, contributionAmount: Number(s.contribution_amount) }
    : localStokvel;

  // Real dashboard stats for this stokvel
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats", stokvelId],
    enabled: !!stokvelId,
    queryFn: async () => {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const monthStartIso = monthStart.toISOString();

      const [{ data: mems }, { data: contribs }, { data: txs }] = await Promise.all([
        supabase.from("members").select("id, name").eq("stokvel_id", stokvelId!),
        supabase.from("contributions").select("id, member_id, amount, status, date").eq("stokvel_id", stokvelId!).gte("date", monthStartIso.slice(0, 10)),
        supabase.from("transactions").select("id, type, amount, date, member_id").eq("stokvel_id", stokvelId!).order("date", { ascending: false }).limit(4),
      ]);

      const memberList = mems ?? [];
      const monthContribs = contribs ?? [];
      const paidIds = new Set(monthContribs.filter((c) => c.status !== "rejected").map((c) => c.member_id));
      const collected = monthContribs.filter((c) => c.status === "confirmed").reduce((sum, c) => sum + Number(c.amount), 0);

      const memberNames = new Map(memberList.map((m) => [m.id, m.name]));
      const recent = (txs ?? []).map((t) => ({
        id: t.id,
        memberName: t.member_id ? memberNames.get(t.member_id) ?? "Member" : "Stokvel",
        type: t.type,
        amount: Number(t.amount),
      }));

      return {
        memberCount: memberList.length,
        paid: paidIds.size,
        collected,
        recent,
      };
    },
  });

  const usingReal = !!membership && !!stats;

  // Fallback to sample data only when not signed into a stokvel
  const paid = usingReal ? stats!.paid : mockMembers.filter((m) => m.paidThisMonth).length;
  const memberCount = usingReal ? stats!.memberCount : mockMembers.length;
  const unpaid = memberCount - paid;
  const monthlyCollected = usingReal ? stats!.collected : localStokvel.monthlyCollected;
  const monthlyPct = (monthlyCollected / stokvel.monthlyTarget) * 100;

  const myContribs = mockContributions.filter((c) => c.memberId === "m1");
  const myTotal = myContribs.reduce((sum, c) => sum + c.amount, 0);
  const myLoans = mockLoans.filter((l) => l.memberId === "m1");

  const recentContribs = usingReal
    ? stats!.recent
    : mockContributions.slice(0, 4).map((c) => ({ id: c.id, memberName: c.memberName, type: `Contribution • ${c.method}`, amount: c.amount }));

  // Next contribution due: from the stokvel's real next_contribution date and frequency
  const nextDue = (() => {
    if (s?.next_contribution) {
      const d = new Date(s.next_contribution);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      while (d < today) {
        if (s.frequency === "Weekly") d.setDate(d.getDate() + 7);
        else if (s.frequency === "Bi-weekly") d.setDate(d.getDate() + 14);
        else d.setMonth(d.getMonth() + 1);
      }
      return formatDate(d);
    }
    return null;
  })();

  const adminActions = [
    { label: "Contribute", icon: Plus, path: "/contribute", color: "bg-primary text-primary-foreground" },
    { label: "Add Member", icon: Users, path: "/members", color: "bg-primary-light text-primary" },
    { label: "Create Loan", icon: Banknote, path: "/loans", color: "bg-primary-light text-primary" },
    { label: "Reports", icon: FileText, path: "/reports", color: "bg-primary-light text-primary" },
  ];
  const memberActions = [
    { label: "Pay now", icon: Plus, path: "/contribute", color: "bg-primary text-primary-foreground" },
    { label: "My loans", icon: Banknote, path: "/loans", color: "bg-primary-light text-primary" },
    { label: "Statements", icon: FileText, path: "/statements", color: "bg-primary-light text-primary" },
    { label: "Marketplace", icon: Store, path: "/marketplace", color: "bg-primary-light text-primary" },
  ];
  const quickActions = isAdmin ? adminActions : memberActions;

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <header className="px-5 pt-6 pb-4 flex justify-between items-start">
        <div className="flex items-center gap-2.5">
          <img src={ubuntuPayLogo} alt="Ubuntu Pay" width={40} height={40} className="rounded-xl" />
          <div>
            <p className="text-xs text-muted-foreground">Welcome back</p>
            <div className="flex items-center gap-1.5">
              <h1 className="font-display text-lg font-bold">{user.name.split(" ")[0]}</h1>
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 capitalize">{isAdmin ? "Admin" : "Member"}</Badge>
            </div>
            <button onClick={() => navigate("/pricing")} className="text-[11px] text-muted-foreground hover:text-primary text-left">
              Plan: <span className="font-semibold text-foreground">{plan}</span>
            </button>
          </div>
        </div>
        <button onClick={() => navigate("/notifications")} className="relative p-2 rounded-full hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>
      </header>

      <main className="px-4">
        {!membership && <p className="text-[10px] text-muted-foreground mb-2 px-1">Demo data</p>}
        <div className="grid grid-cols-2 gap-3 animate-fade-in">
          {/* Savings hero tile */}
          <Card className="col-span-2 bg-gradient-balance text-primary-foreground border-0 shadow-elevated rounded-3xl p-5">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold opacity-90 flex items-center gap-1.5"><Wallet className="w-4 h-4" />{isAdmin ? stokvel.name : "My savings"}</span>
              <button onClick={() => navigate("/statements")} className="text-[11px] bg-primary-foreground/20 rounded-full px-3 py-1 font-semibold">Statements</button>
            </div>
            <p className="font-display text-4xl font-bold tracking-tight mt-2">{formatZAR(isAdmin ? stokvel.balance : myTotal)}</p>
            {isAdmin ? (
              <>
                <div className="flex justify-between text-[11px] opacity-90 mt-3 mb-1"><span>This month {formatZAR(monthlyCollected)}</span><span>Target {formatZAR(stokvel.monthlyTarget)}</span></div>
                <div className="h-2 rounded-full bg-primary-foreground/25 overflow-hidden"><div className="h-full bg-primary-foreground rounded-full" style={{ width: `${Math.min(100, monthlyPct)}%` }} /></div>
              </>
            ) : (
              <p className="text-xs opacity-90 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{myContribs.length} payments to date</p>
            )}
            <button onClick={() => navigate("/contribute")} className="mt-4 w-full bg-card text-foreground rounded-2xl py-3 text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition">
              <Plus className="w-4 h-4" /> Contribute (upload receipt)
            </button>
          </Card>

          {/* Compact stat row */}
          <div className="col-span-2 grid grid-cols-3 gap-2">
            <Card onClick={() => navigate("/merchants")} className="rounded-2xl p-3 bg-foreground text-background border-0 cursor-pointer active:scale-[0.98] transition">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <p className="text-[8px] font-bold tracking-widest opacity-60 mt-1.5">UBUNTU POWER</p>
              <p className="font-display text-base font-bold leading-tight">{formatZAR(Math.round(stokvel.balance * 1.15))}</p>
              <p className="text-[9px] opacity-60 leading-tight mt-0.5">What your group can spend together at partner shops — tap to view offers</p>
            </Card>
            <Card className="rounded-2xl p-3 border-border shadow-card">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <p className="font-display text-base font-bold leading-tight mt-1.5">{isAdmin ? `${paid}/${memberCount}` : myContribs.length}</p>
              <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">{isAdmin ? "Members paid" : "Payments made"}</p>
            </Card>
            <Card onClick={() => navigate("/loans")} className="rounded-2xl p-3 border-border shadow-card cursor-pointer">
              {isAdmin ? <AlertCircle className="w-3.5 h-3.5 text-warning" /> : <Banknote className="w-3.5 h-3.5 text-primary" />}
              <p className="font-display text-base font-bold leading-tight mt-1.5">{isAdmin ? unpaid : myLoans.length}</p>
              <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">{isAdmin ? "Still to pay" : "My loans"}</p>
            </Card>
          </div>

          {/* Insight */}
          <Card className="col-span-2 rounded-3xl p-4 border-primary/30 bg-primary-light flex gap-3">
            <div className="w-10 h-10 rounded-2xl bg-card text-primary flex items-center justify-center shrink-0"><TrendingUp className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-bold">Ubuntu Insight</p>
              <p className="text-xs text-muted-foreground mt-0.5">{isAdmin ? (unpaid > 0 ? `${unpaid} members haven't paid yet. Collecting from them adds ${formatZAR(unpaid * stokvel.contributionAmount)} and brings you closer to the next offer.` : "Everyone has paid this month — great work keeping the group on track!") : `Paying on time keeps your trust score high and helps your group unlock local deals.`}</p>
            </div>
          </Card>

          {/* Next contribution */}
          <Card className="col-span-2 rounded-3xl p-4 border-border shadow-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-light text-primary flex items-center justify-center"><Calendar className="w-5 h-5" /></div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Next contribution</p>
              <p className="text-xs text-muted-foreground">
                {nextDue ? `Due ${nextDue} • ${formatZAR(stokvel.contributionAmount)} each` : `${formatZAR(stokvel.contributionAmount)} each • ${s?.frequency ?? "Monthly"}`}
              </p>
            </div>
          </Card>

          {/* Feature tiles */}
          {[
            ...quickActions.slice(1),
            { label: "Credit score", icon: Shield, path: "/credit-score" },
            { label: "Find stokvels", icon: Store, path: "/marketplace" },
            { label: "Governance", icon: Gavel, path: "/governance" },
            { label: "Member voting", icon: VoteIcon, path: "/voting" },
          ].slice(0, 6).map(({ label, icon: Icon, path }) => (
            <button key={label} onClick={() => navigate(path)} className="rounded-3xl p-4 bg-card border border-border shadow-card flex items-center gap-3 text-left active:scale-[0.97] hover:border-primary/40 transition">
              <div className="w-10 h-10 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
              <span className="text-sm font-semibold leading-tight">{label}</span>
            </button>
          ))}

          {/* Activity */}
          <Card className="col-span-2 rounded-3xl p-4 border-border shadow-card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-display font-bold text-sm">Recent activity</h3>
              <button onClick={() => navigate("/history")} className="text-xs text-primary font-semibold">See all</button>
            </div>
            <div className="space-y-3">
              {recentContribs.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">No activity yet — confirmed contributions will appear here.</p>
              )}
              {recentContribs.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center font-semibold text-xs">{c.memberName.split(" ").map((p) => p[0]).join("")}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{c.memberName}</p>
                    <p className="text-[11px] text-muted-foreground">{c.type}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">+{formatZAR(c.amount)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
