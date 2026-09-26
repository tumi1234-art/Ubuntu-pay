import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { savePlan, usePlan } from "@/lib/userStore";

export const plans = [
  {
    name: "Basic",
    price: 179,
    tagline: "For small savings circles",
    popular: false,
    features: [
      "Up to 10 members",
      "Contribution tracking",
      "Member management",
      "Basic monthly reports",
    ],
  },
  {
    name: "Standard",
    price: 550,
    tagline: "Most popular for stokvels",
    popular: true,
    features: [
      "Up to 30 members",
      "Loans & repayments",
      "SMS & email reminders",
      "PDF + CSV statements",
      "Priority support",
    ],
  },
  {
    name: "Premium",
    price: 1000,
    tagline: "For groups & burial societies",
    popular: false,
    features: [
      "Unlimited members",
      "Multi-group management",
      "Advanced reporting & analytics",
      "Multi-signature governance",
      "Dedicated support",
    ],
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const current = usePlan();

  const choose = (name: string) => {
    savePlan(name);
    toast({ title: `${name} plan activated`, description: "Your subscription has been updated." });
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <header className="px-5 pt-6 pb-4 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">Stokvel Plans</h1>
          <p className="text-xs text-muted-foreground">Pick the plan that fits your group</p>
        </div>
      </header>

      <main className="px-5 space-y-3">
        <Card className="p-4 border-border shadow-card flex items-center gap-3 bg-primary-light/40">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Current plan</p>
            <p className="font-display font-bold">{current}</p>
          </div>
          <span className="text-[10px] font-semibold text-primary uppercase">Active</span>
        </Card>

        {plans.map((p) => {
          const isCurrent = current === p.name;
          return (
            <Card
              key={p.name}
              className={`p-5 ${p.popular ? "border-primary shadow-elevated" : "border-border shadow-card"} relative`}
            >
              {p.popular && (
                <span className="absolute -top-2.5 right-5 bg-primary text-primary-foreground text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                  Most popular
                </span>
              )}
              <h3 className="font-display font-bold text-lg">{p.name}</h3>
              <p className="text-xs text-muted-foreground">{p.tagline}</p>
              <div className="my-2">
                <span className="font-display text-3xl font-extrabold">R{p.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-1.5 mb-4">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={isCurrent ? "outline" : p.popular ? "default" : "outline"}
                disabled={isCurrent}
                onClick={() => choose(p.name)}
              >
                {isCurrent ? "Current plan" : `Choose ${p.name}`}
              </Button>
            </Card>
          );
        })}
      </main>
      <BottomNav />
    </div>
  );
};

export default Pricing;
