import { useNavigate } from "react-router-dom";
import { ArrowLeft, QrCode } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const ScanQR = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <header className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Scan QR Code</h1>
          <p className="text-sm text-muted-foreground">Scan to pay instantly</p>
        </div>
      </header>
      <main className="px-5 pb-24 flex flex-col items-center justify-center" style={{ minHeight: "60vh" }}>
        <div className="w-64 h-64 border-2 border-dashed border-primary rounded-2xl flex items-center justify-center bg-primary-light mb-6">
          <QrCode className="w-24 h-24 text-primary/40" />
        </div>
        <p className="text-center text-muted-foreground text-sm">
          Point your camera at a QR code to make a payment
        </p>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Camera access is required for this feature
        </p>
      </main>
      <BottomNav />
    </div>
  );
};

export default ScanQR;
