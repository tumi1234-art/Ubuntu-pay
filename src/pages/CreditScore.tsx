import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Shield, TrendingUp, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { useUser } from "@/lib/userStore";
import { contributions, loans } from "@/lib/mockData";

const CreditScore = () => {
  const navigate = useNavigate();
  const user = useUser();

  // Simple deterministic score from mock signals
  const onTimeRate = 0.92;
  const repaymentRate = 0.85;
  const tenureMonths = 16;
  const score = Math.min(100, Math.round(onTimeRate * 45 + repaymentRate * 35 + Math.min(tenureMonths, 24) / 24 * 20));
  const tier = score >= 85 ? "Platinum" : score >= 70 ? "Gold" : score >= 55 ? "Silver" : "Bronze";
  const tierColor = score >= 85 ? "text-primary" : score >= 70 ? "text-warning" : "text-muted-foreground";

  const factors = [
    { label: "On-time contributions", value: Math.round(onTimeRate * 100), icon: CheckCircle2, good: true },
    { label: "Loan repayment record", value: Math.round(repaymentRate * 100), icon: TrendingUp, good: true },
    { label: "Group tenure", value: Math.round(Math.min(tenureMonths, 24) / 24 * 100), icon: Clock, good: true },
    { label: "Missed payments", value: 8, icon: AlertTriangle, good: false },
  ];

  const history = [
    { month: "Apr", score: score },
    { month: "Mar", score: score - 2 },
    { month: "Feb", score: score - 5 },
    { month: "Jan", score: score - 7 },
  ];

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <header className="px-5 pt-6 pb-4 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">Stokvel Credit Score</h1>
          <p className="text-xs text-muted-foreground">Your trust rating across stokvels</p>
        </div>
      </header>

      <main className="px-5 space-y-4">
        <Card className="p-6 border-border shadow-elevated bg-gradient-balance text-primary-foreground rounded-2xl">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <Shield className="w-4 h-4" /><span className="text-xs font-medium">{user.name}</span>
          </div>
          <p className="font-display text-5xl font-extrabold">{score}<span className="text-xl opacity-80">/100</span></p>
          <p className="text-sm mt-1 opacity-90">Tier: <span className="font-semibold">{tier}</span></p>
          <Progress value={score} className="h-2 mt-4 bg-white/30" />
          <p className="text-[11px] opacity-80 mt-2">Updated automatically from your stokvel activity</p>
        </Card>

        <Card className="p-4 border-border shadow-card">
          <p className="text-sm font-semibold mb-3">What affects your score</p>
          <div className="space-y-3">
            {factors.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${f.good ? "bg-primary-light text-primary" : "bg-warning/15 text-warning"}`}>
                  <f.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium">{f.label}</p>
                  <Progress value={f.value} className="h-1.5 mt-1" />
                </div>
                <span className="text-xs font-semibold w-10 text-right">{f.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 border-border shadow-card">
          <p className="text-sm font-semibold mb-3">Recent score history</p>
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h.month} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{h.month}</span>
                <span className={`font-semibold ${tierColor}`}>{h.score}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 border-border shadow-card bg-primary-light/40">
          <p className="text-sm font-semibold">Boost your score</p>
          <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc pl-4">
            <li>Pay contributions before due date</li>
            <li>Settle loans on schedule</li>
            <li>Stay active in your stokvel for 12+ months</li>
            <li>Complete KYC verification</li>
          </ul>
        </Card>

        <p className="text-[11px] text-muted-foreground text-center">
          Based on {contributions.length} contributions and {loans.length} loan records
        </p>
      </main>
      <BottomNav />
    </div>
  );
};

export default CreditScore;
