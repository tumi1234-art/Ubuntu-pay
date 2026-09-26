import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Upload, ShieldCheck, ShieldAlert, ShieldX, Loader2, FileImage, Sparkles } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/lib/auth";

type Verdict = "genuine" | "suspicious" | "fake" | "not_a_receipt";

interface VerifyResult {
  verdict: Verdict;
  confidence: number;
  amount?: string;
  currency?: string;
  date?: string;
  reference?: string;
  bank?: string;
  recipient?: string;
  sender?: string;
  red_flags: string[];
  summary: string;
}

const verdictMeta: Record<Verdict, { label: string; tone: string; Icon: typeof ShieldCheck }> = {
  genuine: { label: "Genuine receipt", tone: "bg-primary/10 text-primary border-primary/30", Icon: ShieldCheck },
  suspicious: { label: "Suspicious", tone: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30", Icon: ShieldAlert },
  fake: { label: "Likely fake", tone: "bg-destructive/10 text-destructive border-destructive/30", Icon: ShieldX },
  not_a_receipt: { label: "Not a receipt", tone: "bg-muted text-muted-foreground border-border", Icon: ShieldAlert },
};

const fileToBase64 = (file: File) =>
  new Promise<{ base64: string; mimeType: string }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      const [meta, b64] = res.split(",");
      const mt = meta.match(/data:(.*?);base64/)?.[1] || file.type || "image/jpeg";
      resolve({ base64: b64, mimeType: mt });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Contribute = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const { membership } = useMe();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const onPick = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image.", variant: "destructive" });
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 8MB.", variant: "destructive" });
      return;
    }
    setFile(f);
    setResult(null);
    setPreview(URL.createObjectURL(f));
  };

  const verify = async () => {
    if (!file) {
      toast({ title: "Add a receipt", description: "Upload a proof of payment first.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { base64, mimeType } = await fileToBase64(file);
      const { data, error } = await supabase.functions.invoke("verify-receipt", {
        body: { imageBase64: base64, mimeType, expectedReference: reference || undefined },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setResult(data as VerifyResult);
    } catch (e: any) {
      toast({ title: "Verification failed", description: e.message || "Try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!result || result.verdict === "fake" || result.verdict === "not_a_receipt") {
      toast({ title: "Cannot submit", description: "Receipt did not pass verification.", variant: "destructive" });
      return;
    }
    if (!membership) { toast({ title: "Join a stokvel first", variant: "destructive" }); return; }
    const amount = Number(String(result.amount || "0").replace(/[^\d.]/g, ""));
    if (!amount) { toast({ title: "No amount found on receipt", variant: "destructive" }); return; }
    const { error } = await supabase.from("contributions").insert({
      member_id: membership.id, stokvel_id: membership.stokvel_id, amount,
      reference: result.reference || reference || null,
      verdict: result.verdict, confidence: result.confidence, red_flags: result.red_flags ?? [],
    });
    if (error) { toast({ title: "Could not save", description: error.message, variant: "destructive" }); return; }
    setSubmitted(true);
    toast({ title: "Contribution submitted", description: `R ${amount} saved — awaiting admin confirmation.` });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto relative flex flex-col items-center justify-center px-5">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-primary mx-auto" />
          <h2 className="text-xl font-bold">Contribution Submitted!</h2>
          {result?.amount && <p className="text-muted-foreground">R {result.amount} has been recorded.</p>}
          {result?.reference && <p className="text-sm text-muted-foreground">Ref: {result.reference}</p>}
          <p className="text-xs text-muted-foreground">Awaiting admin confirmation.</p>
          <div className="flex gap-3 pt-4 justify-center">
            <Button variant="outline" onClick={() => { setSubmitted(false); setFile(null); setPreview(""); setResult(null); setReference(""); }}>
              New contribution
            </Button>
            <Button onClick={() => navigate("/")}>Back home</Button>
          </div>
        </div>
      </div>
    );
  }

  const Meta = result ? verdictMeta[result.verdict] : null;

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <header className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Make a contribution</h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Upload your proof of payment — AI verifies it
          </p>
        </div>
      </header>

      <main className="px-5 space-y-4">
        <Card className="p-4 space-y-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => onPick(e.target.files?.[0] ?? null)}
          />
          {preview ? (
            <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
              <img src={preview} alt="Receipt preview" className="w-full max-h-72 object-contain" />
            </div>
          ) : (
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-lg py-10 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              <FileImage className="w-8 h-8" />
              <span className="text-sm font-medium">Tap to upload or take a photo</span>
              <span className="text-xs">PNG / JPG up to 8MB</span>
            </button>
          )}
          {preview && (
            <Button variant="outline" className="w-full" onClick={() => inputRef.current?.click()}>
              <Upload className="w-4 h-4" /> Replace image
            </Button>
          )}
        </Card>

        <Card className="p-4 space-y-3">
          <div>
            <Label className="text-xs">Reference (optional)</Label>
            <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="April contribution" className="mt-1" />
          </div>
        </Card>

        <Button className="w-full h-12" onClick={verify} disabled={loading || !file}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning…</> : <><ShieldCheck className="w-4 h-4" /> Verify with AI</>}
        </Button>

        {result && Meta && (
          <Card className={`p-4 space-y-3 border ${Meta.tone}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Meta.Icon className="w-5 h-5" />
                <span className="font-semibold text-sm">{Meta.label}</span>
              </div>
              <Badge variant="secondary">{Math.round(result.confidence)}% confidence</Badge>
            </div>
            <p className="text-sm">{result.summary}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {result.amount && <div><span className="text-muted-foreground">Amount: </span>{result.currency || "R"} {result.amount}</div>}
              {result.date && <div><span className="text-muted-foreground">Date: </span>{result.date}</div>}
              {result.bank && <div><span className="text-muted-foreground">Bank: </span>{result.bank}</div>}
              {result.reference && <div className="col-span-2"><span className="text-muted-foreground">Ref: </span>{result.reference}</div>}
              {result.sender && <div><span className="text-muted-foreground">From: </span>{result.sender}</div>}
              {result.recipient && <div><span className="text-muted-foreground">To: </span>{result.recipient}</div>}
            </div>
            {result.red_flags?.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold">Red flags</p>
                <ul className="text-xs list-disc list-inside space-y-0.5">
                  {result.red_flags.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
            <Button
              className="w-full"
              variant={result.verdict === "genuine" ? "default" : "outline"}
              onClick={submit}
              disabled={result.verdict === "fake" || result.verdict === "not_a_receipt"}
            >
              Submit contribution
            </Button>
          </Card>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Contribute;
