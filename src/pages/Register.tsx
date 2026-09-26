import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Shield, User } from "lucide-react";
import ubuntuPayLogo from "@/assets/ubuntupay-logo.png";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "member">("admin");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || password.length < 8) {
      toast({ title: "Please complete all fields", description: "Password needs at least 8 characters.", variant: "destructive" });
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: name, phone, role } },
    });
    if (error) { toast({ title: "Sign up failed", description: error.message, variant: "destructive" }); return; }
    if (!data.session) {
      toast({ title: "Check your email", description: "Tap the link we sent to confirm your account, then sign in." });
      navigate("/login");
      return;
    }
    toast({ title: "Account created!", description: "Let's set up your stokvel." });
    navigate("/setup");
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <Link to="/home" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <Card className="p-8 shadow-elevated border-border">
          <div className="flex items-center gap-2 mb-6">
            <img src={ubuntuPayLogo} alt="Ubuntu Pay" className="w-10 h-10 rounded-lg" />
            <div>
              <h1 className="font-display font-bold text-xl">Create your account</h1>
              <p className="text-xs text-muted-foreground">Start managing your stokvel today</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm">Full name</Label>
              <Input id="name" placeholder="Thabo Mokoena" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" placeholder="you@example.co.za" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm">Phone</Label>
              <Input id="phone" type="tel" placeholder="+27 82 555 0142" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="pwd" className="text-sm">Password</Label>
              <Input id="pwd" type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
            </div>

            <div>
              <Label className="text-sm mb-2 block">I am a...</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`p-4 rounded-xl border-2 text-left transition ${role === "admin" ? "border-primary bg-primary-light" : "border-border bg-card"}`}
                >
                  <Shield className={`w-5 h-5 mb-1.5 ${role === "admin" ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="font-semibold text-sm">Treasurer / Admin</p>
                  <p className="text-xs text-muted-foreground">Run a stokvel</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("member")}
                  className={`p-4 rounded-xl border-2 text-left transition ${role === "member" ? "border-primary bg-primary-light" : "border-border bg-card"}`}
                >
                  <User className={`w-5 h-5 mb-1.5 ${role === "member" ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="font-semibold text-sm">Member</p>
                  <p className="text-xs text-muted-foreground">Join a group</p>
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11">Create account</Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Register;
