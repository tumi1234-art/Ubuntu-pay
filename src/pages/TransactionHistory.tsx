import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useTransactions } from "@/lib/useTransactions";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { transactions, isLoading } = useTransactions();

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <header className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Transaction History</h1>
          <p className="text-sm text-muted-foreground">All stokvel transactions</p>
        </div>
      </header>
      <main className="px-5 pb-24 space-y-2">
        {isLoading && <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>}
        {!isLoading && transactions.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No transactions yet. Confirmed payments will show here.</p>}
        {transactions.map((t, i) => (
          <div key={t.id} className="bg-card rounded-xl p-3 border border-border flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
              t.positive ? "bg-primary-light text-primary" : "bg-destructive/10 text-destructive"
            }`}>
              {t.positive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{t.member}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(t.date).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })}
                <span>· {t.type}</span>
              </div>
            </div>
            <span className={`text-sm font-bold ${t.positive ? "text-primary" : "text-destructive"}`}>
              {t.positive ? "+" : "-"}R {Math.abs(t.amount).toLocaleString()}
            </span>
          </div>
        ))}
      </main>
      <BottomNav />
    </div>
  );
};

export default TransactionHistory;
