import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft } from "lucide-react";
import ubuntuPayLogo from "@/assets/ubuntupay-logo.png";
import { useToast } from "@/hooks/use-toast";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const phone = (location.state as { phone?: string })?.phone || "your number";

  const handleVerify = () => {
    if (code.length !== 6) {
      toast({ title: "Enter the 6-digit code", variant: "destructive" });
      return;
    }
    toast({ title: "Verified!", description: "Welcome to Ubuntu Pay." });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <Card className="p-8 shadow-elevated border-border text-center">
          <img src={ubuntuPayLogo} alt="Ubuntu Pay" className="w-12 h-12 rounded-lg mx-auto mb-4" />
          <h1 className="font-display font-bold text-xl mb-1">Enter verification code</h1>
          <p className="text-sm text-muted-foreground mb-6">We sent a 6-digit code to {phone}</p>

          <div className="flex justify-center mb-6">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button className="w-full h-11" onClick={handleVerify}>Verify & continue</Button>
          <p className="text-sm text-muted-foreground mt-4">
            Didn't receive a code? <button className="text-primary font-semibold hover:underline">Resend</button>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default OTP;
