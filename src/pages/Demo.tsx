import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FlaskConical } from "lucide-react";
import ubuntuPayLogo from "@/assets/ubuntupay-logo.png";
import { supabase } from "@/integrations/supabase/client";

// Hidden demo entry point: creates (or reuses) a pre-made demo account with a
// stokvel already set up, signs in, and lands on the dashboard. The real
// Register/Login pages are untouched.
const Demo = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      try {
        const { data, error: fnErr } = await supabase.functions.invoke("demo-login");
        if (fnErr || !data?.email) throw new Error(fnErr?.message ?? data?.error ?? "Demo setup failed");
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (signInErr) throw signInErr;
        navigate("/", { replace: true });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Demo login failed");
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center px-5">
      <Card className="w-full max-w-sm p-8 text-center shadow-elevated border-border">
        <img src={ubuntuPayLogo} alt="Ubuntu Pay" className="w-12 h-12 rounded-lg mx-auto mb-4" />
        {error ? (
          <>
            <FlaskConical className="w-8 h-8 text-destructive mx-auto mb-3" />
            <h1 className="font-display font-bold text-lg mb-1">Demo login failed</h1>
            <p className="text-sm text-muted-foreground mb-5">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
              <Button asChild><Link to="/login">Go to sign in</Link></Button>
            </div>
          </>
        ) : (
          <>
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <h1 className="font-display font-bold text-lg mb-1">Preparing demo…</h1>
            <p className="text-sm text-muted-foreground">Signing you into a ready-made demo stokvel.</p>
          </>
        )}
      </Card>
    </div>
  );
};

export default Demo;
