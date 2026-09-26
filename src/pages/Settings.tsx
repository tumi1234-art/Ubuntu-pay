import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, Users, Bell, CreditCard, LogOut, ChevronRight, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveStokvel, saveUser, useStokvel, useUser, usePlan, useView, saveView } from "@/lib/userStore";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useUser();
  const stokvel = useStokvel();
  const plan = usePlan();
  const view = useView();

  const [section, setSection] = useState<null | "profile" | "group" | "notif" | "sub">(null);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [groupName, setGroupName] = useState(stokvel.name);
  const [groupAmount, setGroupAmount] = useState(String(stokvel.contributionAmount));
  const [notifContrib, setNotifContrib] = useState(true);
  const [notifLoans, setNotifLoans] = useState(true);
  const [notifReports, setNotifReports] = useState(false);

  const items = [
    { key: "profile", icon: User, label: "Profile", desc: "Name, email, phone" },
    { key: "group", icon: Users, label: "Group settings", desc: "Stokvel details" },
    { key: "notif", icon: Bell, label: "Notifications", desc: "Reminders & alerts" },
    { key: "sub", icon: CreditCard, label: "Subscription", desc: `Current: ${plan}` },
  ] as const;

  const saveProfile = () => {
    if (!name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    saveUser({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    toast({ title: "Profile updated", description: "Your details are saved." });
    setSection(null);
  };

  const saveGroup = () => {
    const amt = Number(groupAmount);
    if (!groupName.trim() || !Number.isFinite(amt) || amt <= 0) {
      toast({ title: "Invalid input", variant: "destructive" });
      return;
    }
    saveStokvel({ name: groupName.trim(), contributionAmount: amt });
    toast({ title: "Group settings updated" });
    setSection(null);
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <header className="px-5 pt-6 pb-4 flex items-center gap-2">
        <button onClick={() => (section ? setSection(null) : navigate("/"))} className="p-1.5 -ml-1.5 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">{section ? items.find((i) => i.key === section)?.label : "Settings"}</h1>
          <p className="text-xs text-muted-foreground">{section ? "Update your details" : "Manage your account"}</p>
        </div>
      </header>

      <main className="px-5 space-y-3">
        {!section && (
          <>
            <Card className="p-4 border-border shadow-card flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">{user.initials}</div>
              <div className="flex-1">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role} · {stokvel.name}</p>
              </div>
            </Card>

            <Card className="p-4 border-border shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold">View as</p>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Preview the app from a different role</p>
              <div className="grid grid-cols-2 gap-2">
                {(["admin", "member"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => { saveView(v); toast({ title: `Switched to ${v} view` }); }}
                    className={`py-2 rounded-xl text-xs font-semibold capitalize transition ${view === v ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </Card>
            {items.map(({ key, icon: Icon, label, desc }) => (
              <Card key={key} onClick={() => setSection(key)} className="p-4 border-border shadow-card flex items-center gap-3 cursor-pointer hover:border-primary/40 transition">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Card>
            ))}
            <Button variant="outline" className="w-full mt-4 text-destructive hover:text-destructive" onClick={() => { toast({ title: "Signed out" }); navigate("/home"); }}>
              <LogOut className="w-4 h-4" /> Sign out
            </Button>
          </>
        )}

        {section === "profile" && (
          <Card className="p-5 border-border shadow-card space-y-3">
            <div><Label className="text-sm">Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" maxLength={80} /></div>
            <div><Label className="text-sm">Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" maxLength={120} /></div>
            <div><Label className="text-sm">Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" maxLength={30} /></div>
            <Button className="w-full" onClick={saveProfile}>Save changes</Button>
          </Card>
        )}

        {section === "group" && (
          <Card className="p-5 border-border shadow-card space-y-3">
            <div><Label className="text-sm">Group name</Label><Input value={groupName} onChange={(e) => setGroupName(e.target.value)} className="mt-1" maxLength={80} /></div>
            <div><Label className="text-sm">Contribution amount (R)</Label><Input type="number" value={groupAmount} onChange={(e) => setGroupAmount(e.target.value)} className="mt-1" /></div>
            <Button className="w-full" onClick={saveGroup}>Save changes</Button>
          </Card>
        )}

        {section === "notif" && (
          <Card className="p-5 border-border shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-semibold">Contribution reminders</p><p className="text-xs text-muted-foreground">Get notified before due dates</p></div>
              <Switch checked={notifContrib} onCheckedChange={setNotifContrib} />
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-semibold">Loan updates</p><p className="text-xs text-muted-foreground">New loans & repayments</p></div>
              <Switch checked={notifLoans} onCheckedChange={setNotifLoans} />
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-semibold">Monthly reports</p><p className="text-xs text-muted-foreground">Email summary each month</p></div>
              <Switch checked={notifReports} onCheckedChange={setNotifReports} />
            </div>
            <Button className="w-full" onClick={() => { toast({ title: "Notification preferences saved" }); setSection(null); }}>Save</Button>
          </Card>
        )}

        {section === "sub" && (
          <Card className="p-5 border-border shadow-card space-y-3">
            <div className="bg-primary-light rounded-xl p-4">
              <p className="text-xs text-muted-foreground">Current plan</p>
              <p className="font-display font-bold text-lg">{plan}</p>
              <p className="text-xs text-muted-foreground mt-1">Manage or upgrade anytime</p>
            </div>
            <Button className="w-full" onClick={() => navigate("/pricing")}>Change plan</Button>
            <Button variant="outline" className="w-full text-destructive">Cancel subscription</Button>
          </Card>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Settings;
