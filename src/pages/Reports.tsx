import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, FileText, FileSpreadsheet, Download, TrendingUp, Banknote, Users, Wallet } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, Legend } from "recharts";
import { monthlyChart, members, loans, contributions, transactions, formatZAR } from "@/lib/mockData";
import { useStokvel } from "@/lib/userStore";
import { generateStatementPDF } from "@/lib/pdfGenerator";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const stokvel = useStokvel();
  const [tab, setTab] = useState("overview");

  const stats = [
    { label: "Balance", value: formatZAR(stokvel.balance), icon: Wallet, trend: "+12%" },
    { label: "Contributions", value: formatZAR(contributions.reduce((s, c) => s + c.amount, 0)), icon: TrendingUp, trend: "+8%" },
    { label: "Loans Out", value: formatZAR(loans.filter((l) => l.status === "Active").reduce((s, l) => s + l.remaining, 0)), icon: Banknote, trend: "-3%" },
    { label: "Members", value: String(members.length), icon: Users, trend: "+1" },
  ];

  const paidVsUnpaid = [
    { name: "Paid", value: members.filter((m) => m.paidThisMonth).length, fill: "hsl(var(--primary))" },
    { name: "Unpaid", value: members.filter((m) => !m.paidThisMonth).length, fill: "hsl(var(--warning))" },
  ];

  const topContributors = [...members]
    .sort((a, b) => b.totalContributed - a.totalContributed)
    .slice(0, 5)
    .map((m) => ({ name: m.name.split(" ")[0], amount: m.totalContributed }));

  const exportPDF = () => {
    generateStatementPDF(transactions, "April 2026");
    toast({ title: "PDF generated", description: "Your statement was downloaded." });
  };

  const exportCSV = () => {
    const header = "Date,Member,Type,Amount,Balance\n";
    const rows = transactions.map((t) => `${t.date},${t.member},${t.type},${t.amount},${t.balance}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "UbuntuPay_Report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV downloaded" });
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <header className="px-5 pt-6 pb-4 flex items-center gap-2">
        <button onClick={() => navigate("/")} className="p-1.5 -ml-1.5 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">Reports & Analytics</h1>
          <p className="text-xs text-muted-foreground">Financial overview, charts & exports</p>
        </div>
      </header>

      <main className="px-5">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="exports">Exports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-2">
              {stats.map(({ label, value, icon: Icon, trend }) => (
                <Card key={label} className="p-3.5 border-border shadow-card">
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary mb-2">
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                  <p className="font-display font-bold text-base leading-tight">{value}</p>
                  <span className="text-[10px] font-medium text-primary">{trend}</span>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-4 mt-4">
            <Card className="p-4 border-border shadow-card">
              <p className="text-sm font-semibold mb-1">Contribution trend</p>
              <p className="text-xs text-muted-foreground mb-3">Last 6 months</p>
              <div className="h-44 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyChart}>
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: number) => formatZAR(v)} />
                    <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#grad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4 border-border shadow-card">
              <p className="text-sm font-semibold mb-3">Monthly bars</p>
              <div className="h-40 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: number) => formatZAR(v)} />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4 border-border shadow-card">
              <p className="text-sm font-semibold mb-3">Paid vs unpaid this month</p>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paidVsUnpaid} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2}>
                      {paidVsUnpaid.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4 border-border shadow-card">
              <p className="text-sm font-semibold mb-3">Top contributors</p>
              <div className="h-44 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topContributors} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: number) => formatZAR(v)} />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="exports" className="space-y-2 mt-4">
            <Card className="p-4 border-border shadow-card">
              <p className="text-sm font-semibold mb-3">Generate report</p>
              <div className="space-y-2">
                <Button onClick={exportPDF} className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 text-primary" /> Monthly statement (PDF)
                  <Download className="w-4 h-4 ml-auto" />
                </Button>
                <Button onClick={exportCSV} className="w-full justify-start" variant="outline">
                  <FileSpreadsheet className="w-4 h-4 text-primary" /> Transaction log (CSV)
                  <Download className="w-4 h-4 ml-auto" />
                </Button>
                <Button onClick={exportPDF} className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 text-primary" /> Member statements (PDF)
                  <Download className="w-4 h-4 ml-auto" />
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
};

export default Reports;
