import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ShieldCheck, FileText, Users, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsAdmin } from "@/lib/userStore";
import { formatZAR } from "@/lib/mockData";

interface Approval {
  id: string;
  type: "Loan" | "Withdrawal" | "Member";
  title: string;
  amount?: number;
  requestedBy: string;
  approvals: number;
  required: number;
  status: "Pending" | "Approved" | "Rejected";
}

const initial: Approval[] = [
  { id: "a1", type: "Loan", title: "Loan request", amount: 4500, requestedBy: "Bongani Dlamini", approvals: 1, required: 3, status: "Pending" },
  { id: "a2", type: "Withdrawal", title: "Group withdrawal", amount: 2000, requestedBy: "Treasurer", approvals: 2, required: 3, status: "Pending" },
  { id: "a3", type: "Member", title: "New member: Kagiso M.", requestedBy: "Marketplace request", approvals: 3, required: 3, status: "Approved" },
];

const Governance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = useIsAdmin();
  const [items, setItems] = useState(initial);

  const kyc = [
    { label: "ID document uploaded", done: true },
    { label: "Proof of address", done: true },
    { label: "Selfie verification", done: false },
    { label: "Bank account linked", done: false },
  ];
  const kycPct = (kyc.filter((k) => k.done).length / kyc.length) * 100;

  const constitution = [
    "Monthly contribution: R 1,000 due by the 25th",
    "Loan interest rate: 5% per month",
    "Late payment fee: R 50",
    "Multi-signature required for amounts above R 2,000",
    "Annual payout in December",
  ];

  const vote = (id: string, approve: boolean) => {
    if (!isAdmin) return;
    setItems(items.map((i) => {
      if (i.id !== id || i.status !== "Pending") return i;
      const next = approve ? i.approvals + 1 : i.approvals;
      const status = approve && next >= i.required ? "Approved" : !approve ? "Rejected" : i.status;
      return { ...i, approvals: next, status };
    }));
    toast({ title: approve ? "Vote recorded" : "Request rejected" });
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <header className="px-5 pt-6 pb-4 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">Governance</h1>
          <p className="text-xs text-muted-foreground">Multi-sig approvals & formalisation</p>
        </div>
      </header>

      <main className="px-5 space-y-4">
        <Card className="p-4 border-border shadow-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> KYC verification</p>
            <span className="text-xs font-semibold text-primary">{Math.round(kycPct)}%</span>
          </div>
          <Progress value={kycPct} className="h-2 mb-3" />
          <ul className="space-y-1.5">
            {kyc.map((k) => (
              <li key={k.label} className="flex items-center gap-2 text-xs">
                {k.done ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> : <Clock className="w-3.5 h-3.5 text-warning" />}
                <span className={k.done ? "text-foreground" : "text-muted-foreground"}>{k.label}</span>
              </li>
            ))}
          </ul>
          {kycPct < 100 && <Button size="sm" className="w-full mt-3">Complete verification</Button>}
        </Card>

        <Card className="p-4 border-border shadow-card">
          <p className="text-sm font-semibold mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Pending approvals</p>
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i.id} className="border border-border rounded-xl p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">{i.type}</Badge>
                      <Badge className={
                        i.status === "Approved" ? "bg-primary-light text-primary hover:bg-primary-light" :
                        i.status === "Rejected" ? "bg-destructive/15 text-destructive hover:bg-destructive/15" :
                        "bg-warning/15 text-warning hover:bg-warning/15"
                      }>{i.status}</Badge>
                    </div>
                    <p className="text-sm font-semibold mt-1">{i.title}{i.amount ? ` · ${formatZAR(i.amount)}` : ""}</p>
                    <p className="text-[11px] text-muted-foreground">By {i.requestedBy}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                    <span>Approvals {i.approvals}/{i.required}</span>
                  </div>
                  <Progress value={(i.approvals / i.required) * 100} className="h-1.5" />
                </div>
                {i.status === "Pending" && isAdmin && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => vote(i.id, false)}>
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => vote(i.id, true)}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </Button>
                  </div>
                )}
                {i.status === "Pending" && !isAdmin && (
                  <p className="text-[11px] text-muted-foreground mt-2">Only admins can vote on approvals.</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 border-border shadow-card">
          <p className="text-sm font-semibold mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Group constitution</p>
          <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4">
            {constitution.map((c) => <li key={c}>{c}</li>)}
          </ul>
          {isAdmin && <Button size="sm" variant="outline" className="w-full mt-3">Edit constitution</Button>}
        </Card>
      </main>
      <BottomNav />
    </div>
  );
};

export default Governance;
