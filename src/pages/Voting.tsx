import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Vote as VoteIcon, Plus, Clock, CheckCircle2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsAdmin, useUser } from "@/lib/userStore";

interface Poll {
  id: string;
  title: string;
  description: string;
  options: { label: string; votes: number }[];
  voters: string[]; // user names that voted
  createdBy: string;
  deadline: string;
  status: "Open" | "Closed";
}

const STORE_KEY = "ubuntupay_polls";

const seed: Poll[] = [
  {
    id: "p1",
    title: "Increase monthly contribution to R 1,200?",
    description: "Proposal to raise the standard monthly contribution from R 1,000 to R 1,200 starting July 2026.",
    options: [
      { label: "Yes, increase", votes: 7 },
      { label: "No, keep R 1,000", votes: 4 },
    ],
    voters: ["Bongani Dlamini", "Lerato Mokoena"],
    createdBy: "Thandi Nkosi",
    deadline: "2026-05-30",
    status: "Open",
  },
  {
    id: "p2",
    title: "Elect new treasurer",
    description: "Vote for the next treasurer of Ubuntu Stokvel for the 2026/27 cycle.",
    options: [
      { label: "Sipho Mahlangu", votes: 5 },
      { label: "Nomsa Khumalo", votes: 6 },
      { label: "Abstain", votes: 1 },
    ],
    voters: [],
    createdBy: "Thandi Nkosi",
    deadline: "2026-06-10",
    status: "Open",
  },
  {
    id: "p3",
    title: "Annual payout date",
    description: "Choose the preferred date for the annual member payout.",
    options: [
      { label: "15 December", votes: 8 },
      { label: "20 December", votes: 3 },
    ],
    voters: [],
    createdBy: "Admin",
    deadline: "2026-04-30",
    status: "Closed",
  },
];

const load = (): Poll[] => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : seed;
  } catch {
    return seed;
  }
};
const save = (p: Poll[]) => localStorage.setItem(STORE_KEY, JSON.stringify(p));

const Voting = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = useIsAdmin();
  const user = useUser();
  const [polls, setPolls] = useState<Poll[]>(load);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", description: "", deadline: "", options: "Yes\nNo" });

  useEffect(() => save(polls), [polls]);

  const castVote = (pollId: string, optionIdx: number) => {
    setPolls((prev) =>
      prev.map((p) => {
        if (p.id !== pollId || p.status !== "Open") return p;
        if (p.voters.includes(user.name)) {
          toast({ title: "Already voted", description: "You can only vote once per poll." });
          return p;
        }
        const options = p.options.map((o, i) => (i === optionIdx ? { ...o, votes: o.votes + 1 } : o));
        return { ...p, options, voters: [...p.voters, user.name] };
      }),
    );
    toast({ title: "Vote submitted", description: "Thanks for participating." });
  };

  const closePoll = (id: string) => {
    setPolls((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Closed" } : p)));
    toast({ title: "Poll closed" });
  };

  const createPoll = () => {
    const opts = draft.options.split("\n").map((s) => s.trim()).filter(Boolean);
    if (!draft.title || opts.length < 2) {
      toast({ title: "Missing info", description: "Add a title and at least 2 options." });
      return;
    }
    const p: Poll = {
      id: `p${Date.now()}`,
      title: draft.title,
      description: draft.description,
      options: opts.map((o) => ({ label: o, votes: 0 })),
      voters: [],
      createdBy: user.name,
      deadline: draft.deadline || "—",
      status: "Open",
    };
    setPolls([p, ...polls]);
    setDraft({ title: "", description: "", deadline: "", options: "Yes\nNo" });
    setOpen(false);
    toast({ title: "Poll created" });
  };

  const openPolls = polls.filter((p) => p.status === "Open");
  const closedPolls = polls.filter((p) => p.status === "Closed");

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold">Member voting</h1>
            <p className="text-xs text-muted-foreground">Decide together as a group</p>
          </div>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4" /> New</Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader><DialogTitle>Create a poll</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                <Textarea placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
                <Input type="date" value={draft.deadline} onChange={(e) => setDraft({ ...draft, deadline: e.target.value })} />
                <Textarea placeholder="One option per line" rows={4} value={draft.options} onChange={(e) => setDraft({ ...draft, options: e.target.value })} />
              </div>
              <DialogFooter>
                <Button onClick={createPoll} className="w-full">Publish poll</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </header>

      <main className="px-5 space-y-4">
        <Card className="p-4 border-border shadow-card bg-primary-light/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <VoteIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{openPolls.length} active polls</p>
              <p className="text-xs text-muted-foreground">Your vote shapes the stokvel.</p>
            </div>
          </div>
        </Card>

        {openPolls.map((p) => {
          const total = p.options.reduce((s, o) => s + o.votes, 0) || 1;
          const voted = p.voters.includes(user.name);
          return (
            <Card key={p.id} className="p-4 border-border shadow-card space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                </div>
                <Badge className="bg-primary-light text-primary hover:bg-primary-light shrink-0">Open</Badge>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Closes {p.deadline}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {total} votes</span>
              </div>
              <div className="space-y-2">
                {p.options.map((o, idx) => {
                  const pct = Math.round((o.votes / total) * 100);
                  return (
                    <button
                      key={idx}
                      disabled={voted}
                      onClick={() => castVote(p.id, idx)}
                      className="w-full text-left rounded-xl border border-border p-2.5 hover:border-primary/40 transition disabled:opacity-90 disabled:cursor-default"
                    >
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span>{o.label}</span>
                        <span className="text-muted-foreground">{pct}% · {o.votes}</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </button>
                  );
                })}
              </div>
              {voted ? (
                <p className="text-[11px] text-primary flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> You have voted</p>
              ) : (
                <p className="text-[11px] text-muted-foreground">Tap an option to cast your vote.</p>
              )}
              {isAdmin && (
                <Button size="sm" variant="outline" className="w-full" onClick={() => closePoll(p.id)}>Close poll</Button>
              )}
            </Card>
          );
        })}

        {closedPolls.length > 0 && (
          <div className="pt-2">
            <h3 className="text-sm font-semibold mb-2">Closed polls</h3>
            <div className="space-y-2">
              {closedPolls.map((p) => {
                const total = p.options.reduce((s, o) => s + o.votes, 0) || 1;
                const winner = [...p.options].sort((a, b) => b.votes - a.votes)[0];
                return (
                  <Card key={p.id} className="p-3 border-border shadow-card">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{p.title}</p>
                      <Badge variant="secondary" className="text-[10px]">Closed</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Winner: <span className="text-foreground font-medium">{winner.label}</span> · {Math.round((winner.votes / total) * 100)}%
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Voting;
