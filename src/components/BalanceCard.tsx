import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";

const BalanceCard = () => {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl p-5 text-primary-foreground"
      style={{ background: "var(--gradient-balance)" }}
    >
      <div className="flex items-center gap-2 mb-3 opacity-90">
        <Wallet className="w-5 h-5" />
        <span className="text-sm font-medium">Stokvel Balance</span>
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight mb-1">
        R 45,230.00
      </h2>
      <p className="text-xs opacity-75 mb-4">Last updated just now</p>
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/contribute")}
          className="flex items-center gap-1.5 bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm"
        >
          <ArrowUpRight className="w-4 h-4" />
          Contribute
        </button>
        <button
          onClick={() => navigate("/request")}
          className="flex items-center gap-1.5 bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm"
        >
          <ArrowDownLeft className="w-4 h-4" />
          Request
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;
