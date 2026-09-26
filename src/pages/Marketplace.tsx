import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Search, Star, MapPin, Users, ShieldCheck, CheckCircle2 } from "lucide-react";
import { marketStokvels, MarketStokvel } from "@/lib/marketplaceData";
import { useToast } from "@/hooks/use-toast";
import { formatZAR } from "@/lib/mockData";

const REQ_KEY = "ubuntupay_join_requests";

const Marketplace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [selected, setSelected] = useState<MarketStokvel | null>(null);
  const [requests, setRequests] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(REQ_KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(REQ_KEY, JSON.stringify(requests));
  }, [requests]);

  const cats = ["All", "Savings", "Burial", "Investment", "Grocery", "Education"];

  const filtered = marketStokvels.filter((s) => {
    if (cat !== "All" && s.category !== cat) return false;
    if (search && !`${s.name} ${s.location}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const requestJoin = (s: MarketStokvel) => {
    if (requests.includes(s.id)) {
      toast({ title: "Already requested", description: "Waiting for admin approval." });
      return;
    }
    setRequests([...requests, s.id]);
    toast({ title: "Join request sent", description: `${s.admin} will review your request.` });
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <header className="px-5 pt-6 pb-4 flex items-center gap-2">
        <button onClick={() => navigate("/")} className="p-1.5 -ml-1.5 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">Stokvel Marketplace</h1>
          <p className="text-xs text-muted-foreground">Discover & join verified stokvels</p>
        </div>
      </header>

      <div className="px-5 mb-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or location" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${cat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <main className="px-5 space-y-3">
        {filtered.map((s) => {
          const requested = requests.includes(s.id);
          return (
            <Card key={s.id} onClick={() => setSelected(s)} className="p-4 border-border shadow-card cursor-pointer hover:border-primary/40 transition">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold">
                  {s.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold truncate">{s.name}</p>
                    {s.verified && <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{s.location}</span>
                    <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-warning text-warning" />{s.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{s.category}</Badge>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{formatZAR(s.contribution)}/{s.frequency === "Monthly" ? "mo" : "wk"}</Badge>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Fee {s.feePct}%</Badge>
                  </div>
                </div>
                {requested && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-border text-xs">
                <span className="flex items-center gap-1 text-muted-foreground"><Users className="w-3 h-3" /> {s.members}/{s.capacity} members</span>
                <span className="text-primary font-semibold">{requested ? "Pending approval" : "View details →"}</span>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card className="p-8 text-center border-dashed">
            <p className="text-sm text-muted-foreground">No stokvels match your search</p>
          </Card>
        )}
      </main>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-sm">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selected.name}
                  {selected.verified && <ShieldCheck className="w-4 h-4 text-primary" />}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <p className="text-sm text-muted-foreground">{selected.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-muted rounded-lg p-2"><p className="text-muted-foreground">Contribution</p><p className="font-semibold">{formatZAR(selected.contribution)}/{selected.frequency === "Monthly" ? "mo" : "wk"}</p></div>
                  <div className="bg-muted rounded-lg p-2"><p className="text-muted-foreground">Members</p><p className="font-semibold">{selected.members}/{selected.capacity}</p></div>
                  <div className="bg-muted rounded-lg p-2"><p className="text-muted-foreground">Admin fee</p><p className="font-semibold">{selected.feePct}%</p></div>
                  <div className="bg-muted rounded-lg p-2"><p className="text-muted-foreground">Loan interest</p><p className="font-semibold">{selected.interestPct}%</p></div>
                </div>
                <div className="text-xs text-muted-foreground">Admin: <span className="text-foreground font-medium">{selected.admin}</span></div>
                <Button className="w-full" onClick={() => requestJoin(selected)} disabled={requests.includes(selected.id)}>
                  {requests.includes(selected.id) ? "Request pending" : "Request to join"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Marketplace;
