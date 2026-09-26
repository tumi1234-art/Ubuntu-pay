import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Shield, User } from "lucide-react";
import ubuntuPayLogo from "@/assets/ubuntupay-logo.png";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const registrationSchema = z.object({
  name: z.string().trim().min(1, "Please enter your full name.").max(100, "Name must be 100 characters or fewer."),
  email: z.string().trim().email("Please enter a valid email address.").max(255, "Email must be 255 characters or fewer."),
  phone: z.string().trim().max(30, "Phone number must be 30 characters or fewer."),
  password: z.string().min(8, "Password needs at least 8 characters.").max(128, "Password must be 128 characters or fewer."),
});

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "member">("admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    const fields = form.elements;
    const readField = (fieldName: string, fallback: string) => {
      const field = fields.namedItem(fieldName);
      return field instanceof HTMLInputElement ? field.value : fallback;
    };
    const result = registrationSchema.safeParse({
      name: readField("name", name),
      email: readField("email", email),
      phone: readField("phone", phone),
      password: passwordRef.current?.value ?? readField("password", password),
    });

    if (!result.success) {
      const issue = result.error.issues[0];
      toast({ title: "Check your details", description: issue?.message ?? "Please check the form and try again.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: result.data.name, phone: result.data.phone, role },
        },
      });
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
        return;
      }
      if (!data.session) {
        toast({ title: "Check your email", description: "Tap the link we sent to confirm your account, then sign in." });
        navigate("/login");
        return;
      }
      toast({ title: "Account created!", description: "Let's set up your stokvel." });
      navigate("/setup");
    } finally {
      setIsSubmitting(false);
    }
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
              <Input id="name" name="name" autoComplete="name" maxLength={100} required placeholder="Thabo Mokoena" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" maxLength={255} required placeholder="you@example.co.za" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm">Phone</Label>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="+27 82 555 0142" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="pwd" className="text-sm">Password</Label>
              <Input ref={passwordRef} id="password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
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

            <Button type="submit" disabled={isSubmitting} className="w-full h-11">
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
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
