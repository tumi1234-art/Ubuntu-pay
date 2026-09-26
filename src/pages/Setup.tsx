import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";

const Setup = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { toast } = useToast();
  const { session } = useSession();
  const [name, setName] = useState("");
  const [myName, setMyName] = useState((session?.user.user_metadata?.full_name as string) || "");
  const [amount, setAmount] = useState("1000");
  const [target, setTarget] = useState("12000");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"create" | "join">("create");
  const [code, setCode] = useState("");

  const join = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !myName) { toast({ title: "Enter your name and invite code", variant: "destructive" }); return; }
    setBusy(true);
    const { error } = await supabase.rpc("join_stokvel", { _code: code, _member_name: myName });
    setBusy(false);
    if (error) { toast({ title: "Could not join", description: error.message, variant: "destructive" }); return; }
    await qc.invalidateQueries({ queryKey: ["membership"] });
    toast({ title: "Welcome to your stokvel!" });
    navigate("/");
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !myName) { toast({ title: "Please fill in the names", variant: "destructive" }); return; }
    setBusy(true);
    const { error } = await supabase.rpc("create_stokvel", {
      _name: name, _amount: Number(amount), _target: Number(target),
      _member_name: myName || session?.user.user_metadata?.full_name || "Admin",
    });
    setBusy(false);
    if (error) { toast({ title: "Could not create stokvel", description: error.message, variant: "destructive" }); return; }
    await qc.invalidateQueries({ queryKey: ["membership"] });
    toast({ title: "Your stokvel is now active" });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center px-5 py-10">
      <Card className="w-full max-w-md p-8 shadow-elevated">
        <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl mb-6">
          {(["create", "join"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)}
              className={`h-11 rounded-lg text-sm font-semibold transition-colors ${mode === m ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>
              {m === "create" ? "Create a stokvel" : "Join a stokvel"}
            </button>
          ))}
        </div>
        {mode === "join" ? (
          <>
            <h1 className="font-display font-bold text-xl">Join a stokvel</h1>
            <p className="text-sm text-muted-foreground mb-6">Ask your admin for the 6-letter invite code. You'll join as a member.</p>
            <form onSubmit={join} className="space-y-4">
              <div><Label>Your name</Label><Input value={myName} onChange={(e) => setMyName(e.target.value)} placeholder="Nomsa Khumalo" className="mt-1.5" /></div>
              <div><Label>Invite code</Label><Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="A1B2C3" maxLength={6} className="mt-1.5 tracking-widest font-bold text-lg h-12" /></div>
              <Button type="submit" className="w-full h-12" disabled={busy}>{busy ? "Joining…" : "Join stokvel"}</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => supabase.auth.signOut().then(() => navigate("/login"))}>Sign out</Button>
            </form>
          </>
        ) : (<>
        <h1 className="font-display font-bold text-xl">Create your stokvel</h1>
        <p className="text-sm text-muted-foreground mb-6">You'll be the admin. You can add members afterwards.</p>
        <form onSubmit={create} className="space-y-4">
          <div><Label>Your name</Label><Input value={myName} onChange={(e) => setMyName(e.target.value)} placeholder="Thabo Mokoena" className="mt-1.5" /></div>
          <div><Label>Stokvel name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Kasi Savings Club" className="mt-1.5" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Monthly amount (R)</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5" /></div>
            <div><Label>Monthly target (R)</Label><Input type="number" value={target} onChange={(e) => setTarget(e.target.value)} className="mt-1.5" /></div>
          </div>
          <Button type="submit" className="w-full h-12" disabled={busy}>{busy ? "Creating…" : "Create stokvel"}</Button>
          <Button type="button" variant="ghost" className="w-full" onClick={() => supabase.auth.signOut().then(() => navigate("/login"))}>Sign out</Button>
        </form>
        </>)}
      </Card>
    </div>
  );
};

export default Setup;
