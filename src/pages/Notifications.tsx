import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { notifications } from "@/lib/mockData";

const iconFor = (t: string) => t === "success" ? CheckCircle2 : t === "warning" ? AlertCircle : Info;

const Notifications = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <header className="px-5 pt-6 pb-4 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">Notifications</h1>
          <p className="text-xs text-muted-foreground">{notifications.filter(n => !n.read).length} unread</p>
        </div>
      </header>
      <main className="px-5 space-y-2">
        {notifications.map((n) => {
          const Icon = iconFor(n.type);
          return (
            <Card key={n.id} className={`p-4 flex items-start gap-3 border-border shadow-card ${!n.read ? "bg-primary-light/40" : ""}`}>
              <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.body}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.date).toLocaleDateString("en-ZA")}</p>
              </div>
            </Card>
          );
        })}
      </main>
      <BottomNav />
    </div>
  );
};

export default Notifications;
