import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

const activities = [
  { name: "Sipho N.", type: "Contribution", amount: "+R 500", positive: true },
  { name: "Nomsa K.", type: "Loan Repayment", amount: "+R 1,200", positive: true },
  { name: "Thandi M.", type: "Withdrawal", amount: "-R 2,000", positive: false },
];

const RecentActivity = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-base">Recent Activity</h3>
        <button
          onClick={() => navigate("/history")}
          className="text-sm text-primary font-medium hover:underline"
        >
          See all
        </button>
      </div>
      <div className="space-y-3">
        {activities.map((a, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-card rounded-xl p-3 shadow-sm border border-border"
          >
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{a.name}</p>
              <p className="text-xs text-muted-foreground">{a.type}</p>
            </div>
            <span
              className={`text-sm font-bold ${
                a.positive ? "text-primary" : "text-destructive"
              }`}
            >
              {a.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
