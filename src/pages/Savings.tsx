import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, Plus } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const initialGoals = [
  { name: "December Party", target: 20000, saved: 14500 },
  { name: "Emergency Fund", target: 50000, saved: 32000 },
  { name: "Investment Fund", target: 100000, saved: 45230 },
];

const Savings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [goals, setGoals] = useState(initialGoals);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");

  const addGoal = () => {
    if (!newName || !newTarget || Number(newTarget) <= 0) {
      toast({ title: "Invalid goal", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setGoals([...goals, { name: newName, target: Number(newTarget), saved: 0 }]);
    setNewName("");
    setNewTarget("");
    setShowAdd(false);
    toast({ title: "Goal Created", description: `"${newName}" savings goal added.` });
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Savings Goals</h1>
            <p className="text-sm text-muted-foreground">Track your stokvel targets</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      <main className="px-5 pb-24 space-y-3">
        {showAdd && (
          <div className="bg-card rounded-xl p-4 border border-primary/30 space-y-3">
            <Input placeholder="Goal name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Input type="number" placeholder="Target amount (ZAR)" value={newTarget} onChange={(e) => setNewTarget(e.target.value)} />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button className="flex-1" onClick={addGoal}>Add Goal</Button>
            </div>
          </div>
        )}

        {goals.map((goal, i) => {
          const pct = Math.min(100, (goal.saved / goal.target) * 100);
          return (
            <div key={i} className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{goal.name}</p>
                  <p className="text-xs text-muted-foreground">
                    R {goal.saved.toLocaleString()} of R {goal.target.toLocaleString()}
                  </p>
                </div>
                <span className="text-sm font-bold text-primary">{pct.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-primary rounded-full h-2.5 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}

        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Saved</p>
          <p className="text-2xl font-bold">R {goals.reduce((s, g) => s + g.saved, 0).toLocaleString()}</p>
          <p className="text-xs text-primary font-medium mt-1">
            Target: R {goals.reduce((s, g) => s + g.target, 0).toLocaleString()}
          </p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Savings;
