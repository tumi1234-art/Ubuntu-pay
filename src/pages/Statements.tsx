import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileText, Calendar, Eye } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { generateStatementPDF } from "@/lib/pdfGenerator";
import { useTransactions, monthLabel } from "@/lib/useTransactions";

const Statements = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { transactions: all, isLoading } = useTransactions();
  const months = Array.from(new Set([monthLabel(new Date()), ...all.map((t) => monthLabel(t.date))]));
  const [picked, setSelectedMonth] = useState<string | null>(null);
  const selectedMonth = picked ?? months[0];
  const transactions = all.filter((t) => monthLabel(t.date) === selectedMonth);
  const [viewOpen, setViewOpen] = useState(false);

  const totalIn = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const closing = transactions[0]?.balance ?? 0;

  const handleDownloadPDF = () => {
    try {
      generateStatementPDF(transactions, selectedMonth);
      toast({ title: "PDF Downloaded", description: `${selectedMonth} statement saved.` });
    } catch {
      toast({ title: "Download failed", description: "Could not generate PDF", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <header className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Financial Statements</h1>
          <p className="text-sm text-muted-foreground">View & download statements</p>
        </div>
      </header>

      <main className="px-5 pb-24 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMonth === m ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">{selectedMonth} Statement</p>
              <p className="text-xs text-muted-foreground">{transactions.length} transactions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setViewOpen(true)} className="gap-1.5">
              <Eye className="w-4 h-4" />
              View
            </Button>
            <Button size="sm" onClick={handleDownloadPDF} className="gap-1.5">
              <Download className="w-4 h-4" />
              PDF
            </Button>
          </div>
        </div>

        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedMonth} Statement</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-primary-light p-2">
                  <p className="text-[10px] text-muted-foreground">Money in</p>
                  <p className="text-sm font-bold text-primary">R {totalIn.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <p className="text-[10px] text-muted-foreground">Money out</p>
                  <p className="text-sm font-bold text-destructive">R {totalOut.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <p className="text-[10px] text-muted-foreground">Balance</p>
                  <p className="text-sm font-bold">R {closing.toLocaleString()}</p>
                </div>
              </div>
              <div className="border border-border rounded-lg divide-y">
                {transactions.map((t, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 text-xs">
                    <div>
                      <p className="font-medium">{t.member}</p>
                      <p className="text-muted-foreground text-[11px]">{t.type} · {new Date(t.date).toLocaleDateString("en-ZA", { day: "2-digit", month: "short" })}</p>
                    </div>
                    <p className={`font-bold ${t.amount >= 0 ? "text-primary" : "text-destructive"}`}>
                      {t.amount >= 0 ? "+" : ""}R {Math.abs(t.amount).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-2">
          {isLoading && <p className="text-sm text-muted-foreground text-center py-6">Loading…</p>}
          {!isLoading && transactions.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No transactions in {selectedMonth}.</p>}
          {transactions.map((t, i) => (
            <div key={i} className="bg-card rounded-xl p-3 border border-border flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-[60px]">
                <Calendar className="w-3 h-3" />
                {new Date(t.date).toLocaleDateString("en-ZA", { day: "2-digit", month: "short" })}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{t.member}</p>
                <p className="text-xs text-muted-foreground">{t.type}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${t.amount >= 0 ? "text-primary" : "text-destructive"}`}>
                  {t.amount >= 0 ? "+" : ""}R {Math.abs(t.amount).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">R {t.balance.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Statements;
