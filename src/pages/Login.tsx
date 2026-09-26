import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import ubuntuPayLogo from "@/assets/ubuntupay-logo.png";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) {
      toast({ title: "Please enter your details", variant: "destructive" });
      return;
    }
    if (method === "phone") {
      toast({ title: "Phone sign-in coming soon", description: "Please use your email for now." });
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email: value, password });
    if (error) { toast({ title: "Sign in failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Welcome back!", description: "Signed in successfully." });
    navigate("/");
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
              <h1 className="font-display font-bold text-xl">Welcome back</h1>
              <p className="text-xs text-muted-foreground">Sign in to your stokvel</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setMethod("email")}
              className={`py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1.5 transition ${method === "email" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
            <button
              onClick={() => setMethod("phone")}
              className={`py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1.5 transition ${method === "phone" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
            >
              <Phone className="w-4 h-4" /> Phone
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="value" className="text-sm">{method === "email" ? "Email address" : "Phone number"}</Label>
              <Input
                id="value"
                type={method === "email" ? "email" : "tel"}
                placeholder={method === "email" ? "you@example.co.za" : "+27 82 555 0142"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-1.5"
              />
            </div>
            {method === "email" && (
              <div>
                <Label htmlFor="pwd" className="text-sm">Password</Label>
                <Input
                  id="pwd"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            )}
            <Button type="submit" className="w-full h-11">
              {method === "email" ? "Sign in" : "Send OTP"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">Sign up</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;
