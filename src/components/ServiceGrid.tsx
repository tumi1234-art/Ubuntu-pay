import { useNavigate } from "react-router-dom";
import { CreditCard, Landmark, PiggyBank, FileText } from "lucide-react";

const services = [
  { label: "Contribute", icon: CreditCard, path: "/contribute" },
  { label: "Loans", icon: Landmark, path: "/loans" },
  { label: "Savings", icon: PiggyBank, path: "/savings" },
  { label: "Statements", icon: FileText, path: "/statements" },
];

const ServiceGrid = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h3 className="font-semibold text-base mb-3">Services</h3>
      <div className="grid grid-cols-4 gap-3">
        {services.map(({ label, icon: Icon, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-primary-light hover:bg-accent transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-primary shadow-sm">
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-foreground">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceGrid;
