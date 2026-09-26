import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownLeft, QrCode, History } from "lucide-react";

const actions = [
  { label: "Send Money", icon: ArrowUpRight, desc: "Transfer to a member", path: "/send" },
  { label: "Request", icon: ArrowDownLeft, desc: "Request a payment", path: "/request" },
  { label: "Scan QR", icon: QrCode, desc: "Scan to pay", path: "/scan" },
  { label: "History", icon: History, desc: "View transactions", path: "/history" },
];

const Pay = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-bold">Payments</h1>
        <p className="text-sm text-muted-foreground">Send and receive money</p>
      </header>
      <main className="px-5 pb-24 space-y-3">
        {actions.map(({ label, icon: Icon, desc, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="w-full flex items-center gap-4 bg-card rounded-xl p-4 shadow-sm border border-border hover:border-primary/30 transition-colors text-left"
          >
            <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center text-primary">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </button>
        ))}
      </main>
      <BottomNav />
    </div>
  );
};

export default Pay;
