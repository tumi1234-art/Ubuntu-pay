import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sparkles, Users, Wallet, CheckCircle2, Plus, X } from "lucide-react";
import ubuntuPayLogo from "@/assets/ubuntupay-logo.png";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [groupName, setGroupName] = useState("");
  const [amount, setAmount] = useState("1000");
  const [frequency, setFrequency] = useState("Monthly");
  const [payout, setPayout] = useState("Annual");

  const [memberInputs, setMemberInputs] = useState<{ name: string; phone: string }[]>([
    { name: "", phone: "" },
  ]);

  const [contribMember, setContribMember] = useState("");
  const [contribAmount, setContribAmount] = useState(amount);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const addMemberRow = () => setMemberInputs([...memberInputs, { name: "", phone: "" }]);
  const removeMemberRow = (i: number) => setMemberInputs(memberInputs.filter((_, idx) => idx !== i));
  const updateMember = (i: number, field: "name" | "phone", value: string) => {
    const next = [...memberInputs];
    next[i][field] = value;
    setMemberInputs(next);
  };

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-5">
          <img src={ubuntuPayLogo} alt="Ubuntu Pay" className="w-9 h-9 rounded-lg" />
          <span className="font-display font-bold">Ubuntu Pay</span>
        </div>
        <Progress value={progress} className="mb-5" />

        <Card className="p-8 shadow-elevated border-border">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center text-primary mx-auto mb-5">
                <Sparkles className="w-7 h-7" />
              </div>
              <h1 className="font-display font-bold text-2xl mb-2">Welcome to Ubuntu Pay</h1>
              <p className="text-muted-foreground mb-6">Let's set up your stokvel in just a few steps. It only takes a minute.</p>
              <Button className="w-full h-11" onClick={next}>Get started</Button>
            </div>
          )}

          {/* Step 1: Create stokvel */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg">Create your stokvel</h2>
                  <p className="text-xs text-muted-foreground">Tell us about your group</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Group name</Label>
                  <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Ubuntu Savings Group" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm">Contribution amount (R)</Label>
                  <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Frequency</Label>
                    <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                      <option>Weekly</option><option>Monthly</option><option>Quarterly</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-sm">Payout cycle</Label>
                    <select value={payout} onChange={(e) => setPayout(e.target.value)} className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                      <option>Monthly</option><option>Quarterly</option><option>Annual</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={back} className="flex-1">Back</Button>
                <Button onClick={() => { if (!groupName) { toast({ title: "Group name required", variant: "destructive" }); return; } next(); }} className="flex-1">Continue</Button>
              </div>
            </div>
          )}

          {/* Step 2: Add members */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg">Add members</h2>
                  <p className="text-xs text-muted-foreground">You can invite more later</p>
                </div>
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {memberInputs.map((m, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input placeholder="Name" value={m.name} onChange={(e) => updateMember(i, "name", e.target.value)} />
                      <Input placeholder="Phone" value={m.phone} onChange={(e) => updateMember(i, "phone", e.target.value)} />
                    </div>
                    {memberInputs.length > 1 && (
                      <button onClick={() => removeMemberRow(i)} className="p-2 text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={addMemberRow} className="mt-3 w-full">
                <Plus className="w-4 h-4" /> Add another
              </Button>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={back} className="flex-1">Back</Button>
                <Button onClick={next} className="flex-1">Continue</Button>
              </div>
            </div>
          )}

          {/* Step 3: First contribution */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg">Record first contribution</h2>
                  <p className="text-xs text-muted-foreground">Optional — you can skip this</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Member</Label>
                  <Input value={contribMember} onChange={(e) => setContribMember(e.target.value)} placeholder="Member name" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm">Amount (R)</Label>
                  <Input type="number" value={contribAmount} onChange={(e) => setContribAmount(e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={back} className="flex-1">Back</Button>
                <Button onClick={next} className="flex-1">Continue</Button>
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {step === 4 && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-2">Your stokvel is now active!</h2>
              <p className="text-muted-foreground mb-6">"{groupName || 'Your group'}" is ready to go. Welcome to Ubuntu Pay.</p>
              <Button className="w-full h-11" onClick={() => navigate("/")}>Go to dashboard</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
