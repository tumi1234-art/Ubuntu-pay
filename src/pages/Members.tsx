import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UserPlus, Search, ArrowLeft } from "lucide-react";
import { formatZAR } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/lib/auth";

const initialsOf = (n: string) => n.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");

const Members = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { membership } = useMe();
  const stokvelId = membership?.stokvel_id;
  const isAdmin = membership?.role === "admin" || membership?.role === "treasurer";

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid">("all");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["members", stokvelId],
    enabled: !!stokvelId,
    queryFn: async () => {
      const start = new Date(); start.setDate(1);
      const monthStart = start.toISOString().slice(0, 10);
      const [m, c] = await Promise.all([
        supabase.from("members").select("*").eq("stokvel_id", stokvelId!).order("joined", { ascending: true }),
        supabase.from("contributions").select("member_id").eq("stokvel_id", stokvelId!).gte("date", monthStart).neq("status", "rejected"),
      ]);
      if (m.error) throw m.error;
      if (c.error) throw c.error;
      const paidIds = new Set((c.data ?? []).map((x) => x.member_id));
      return (m.data ?? []).map((x) => ({ ...x, paidThisMonth: paidIds.has(x.id) }));
    },
  });
  const list = data ?? [];

  const filtered = list.filter((m) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "paid" && !m.paidThisMonth) return false;
    if (filter === "unpaid" && m.paidThisMonth) return false;
    return true;
  });

  const addMember = async () => {
    if (!name.trim()) { toast({ title: "Name required", variant: "destructive" }); return; }
    if (!stokvelId) return;
    setSaving(true);
    const { error } = await supabase.from("members").insert({
      stokvel_id: stokvelId, name: name.trim(), phone: phone.trim() || null, email: email.trim() || null, role: "member",
    });
    setSaving(false);
    if (error) { toast({ title: "Could not add member", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Member added", description: `${name} joined the stokvel.` });
    setName(""); setPhone(""); setEmail(""); setOpen(false);
    qc.invalidateQueries({ queryKey: ["members", stokvelId] });
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/")} className="p-1.5 -ml-1.5 rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold">Members</h1>
            <p className="text-xs text-muted-foreground">{list.length} members in your group</p>
          </div>
        </div>
        {isAdmin && (
          <Button size="sm" className="rounded-full" onClick={() => setOpen(true)}><UserPlus className="w-4 h-4" /> Add</Button>
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Add new member</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" /></div>
              <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+27 82 ..." /></div>
              <div><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" /></div>
              <Button onClick={addMember} disabled={saving} className="w-full">{saving ? "Saving…" : "Add member"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      {isAdmin && membership?.stokvel?.invite_code && (
        <div className="px-5 mb-3">
          <Card className="p-4 flex items-center justify-between gap-3 bg-primary-light border-primary/30">
            <div>
              <p className="text-xs text-muted-foreground">Invite code — share so people can join</p>
              <p className="font-display text-2xl font-bold tracking-widest">{membership.stokvel.invite_code}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => { navigator.clipboard?.writeText(membership.stokvel.invite_code!); toast({ title: "Invite code copied" }); }}>Copy</Button>
          </Card>
        </div>
      )}


      <div className="px-5 mb-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search members" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 mt-3">
          {(["all", "paid", "unpaid"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <main className="px-5 space-y-2">
        {isLoading && <p className="text-sm text-muted-foreground text-center py-6">Loading members…</p>}
        {filtered.map((m) => (
          <Card key={m.id} className="p-4 border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                {initialsOf(m.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate">{m.name}</p>
                  {m.role !== "member" && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">{m.role}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{m.phone || m.email || "No contact details"}</p>
              </div>
              <Badge className={m.paidThisMonth ? "bg-primary-light text-accent-foreground hover:bg-primary-light" : "bg-warning/15 text-warning hover:bg-warning/15"}>
                {m.paidThisMonth ? "Paid" : "Unpaid"}
              </Badge>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border text-xs">
              <span className="text-muted-foreground">Total contributed</span>
              <span className="font-semibold">{formatZAR(Number(m.total_contributed))}</span>
            </div>
          </Card>
        ))}
        {!isLoading && filtered.length === 0 && (
          <Card className="p-8 text-center border-dashed">
            <p className="text-sm text-muted-foreground">
              {list.length === 0 ? "No members yet — tap Add to invite your group." : "No members match your search"}
            </p>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Members;
