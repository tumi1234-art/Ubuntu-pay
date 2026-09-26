import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const RequestMoney = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleRequest = () => {
    if (!amount || Number(amount) <= 0) {
      toast({ title: "Invalid amount", description: "Enter a valid amount", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Request Sent", description: `Payment request for R ${Number(amount).toLocaleString()} submitted` });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto relative flex flex-col items-center justify-center px-5">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-primary mx-auto" />
          <h2 className="text-xl font-bold">Request Sent!</h2>
          <p className="text-muted-foreground">R {Number(amount).toLocaleString()} request sent to all members</p>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => { setSubmitted(false); setAmount(""); setReason(""); }}>New Request</Button>
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
          <h1 className="text-xl font-bold">Request Payment</h1>
          <p className="text-sm text-muted-foreground">Request money from members</p>
        </div>
      </header>
      <main className="px-5 pb-24 space-y-5">
        <div className="bg-card rounded-xl p-5 border border-border space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Amount (ZAR)</label>
            <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-lg" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Reason</label>
            <Textarea placeholder="e.g. Monthly contribution" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <Button className="w-full h-12 text-base" onClick={handleRequest}>Send Request</Button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default RequestMoney;
