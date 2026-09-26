import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const members = [
  { name: "Sipho N.", initials: "SN" },
  { name: "Nomsa K.", initials: "NK" },
  { name: "Thandi M.", initials: "TM" },
  { name: "Lerato P.", initials: "LP" },
];

const SendMoney = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSend = () => {
    if (!selectedMember) {
      toast({ title: "Select a member", description: "Choose who to send money to", variant: "destructive" });
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast({ title: "Invalid amount", description: "Enter a valid amount", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Money Sent", description: `R ${Number(amount).toLocaleString()} sent to ${selectedMember}` });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto relative flex flex-col items-center justify-center px-5">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-primary mx-auto" />
          <h2 className="text-xl font-bold">Money Sent!</h2>
          <p className="text-muted-foreground">R {Number(amount).toLocaleString()} sent to {selectedMember}</p>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => { setSubmitted(false); setAmount(""); setSelectedMember(null); }}>Send More</Button>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <header className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Send Money</h1>
          <p className="text-sm text-muted-foreground">Transfer to a member</p>
        </div>
      </header>
      <main className="px-5 pb-24 space-y-5">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Member</label>
          <div className="grid grid-cols-2 gap-2">
            {members.map((m) => (
              <button
                key={m.name}
                onClick={() => setSelectedMember(m.name)}
                className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${
                  selectedMember === m.name ? "border-primary bg-primary-light" : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                  selectedMember === m.name ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>{m.initials}</div>
                <span className="text-sm font-medium">{m.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Amount (ZAR)</label>
            <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-lg" />
          </div>
          <Button className="w-full h-12 text-base" onClick={handleSend}>Send Money</Button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default SendMoney;
