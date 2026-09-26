import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Landing from "./pages/Landing.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import OTP from "./pages/OTP.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Members from "./pages/Members.tsx";
import Contributions from "./pages/Contributions.tsx";
import Loans from "./pages/Loans.tsx";
import Reports from "./pages/Reports.tsx";
import Pricing from "./pages/Pricing.tsx";
import Settings from "./pages/Settings.tsx";
import Notifications from "./pages/Notifications.tsx";
import Pay from "./pages/Pay.tsx";
import Statements from "./pages/Statements.tsx";
import SendMoney from "./pages/SendMoney.tsx";
import RequestMoney from "./pages/RequestMoney.tsx";
import TransactionHistory from "./pages/TransactionHistory.tsx";
import ScanQR from "./pages/ScanQR.tsx";
import Savings from "./pages/Savings.tsx";
import Contribute from "./pages/Contribute.tsx";
import CreditScore from "./pages/CreditScore.tsx";
import Marketplace from "./pages/Marketplace.tsx";
import MerchantMarket from "./pages/MerchantMarket.tsx";
import Governance from "./pages/Governance.tsx";
import Voting from "./pages/Voting.tsx";
import UploadReceipt from "./pages/UploadReceipt.tsx";
import Setup from "./pages/Setup.tsx";
import Demo from "./pages/Demo.tsx";
import { RequireAuth } from "@/lib/auth";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
          <Route path="/home" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
          <Route path="/members" element={<RequireAuth><Members /></RequireAuth>} />
          <Route path="/contributions" element={<RequireAuth><Contributions /></RequireAuth>} />
          <Route path="/loans" element={<RequireAuth><Loans /></RequireAuth>} />
          <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
          <Route path="/statements" element={<RequireAuth><Statements /></RequireAuth>} />
          <Route path="/pay" element={<RequireAuth><Pay /></RequireAuth>} />
          <Route path="/send" element={<RequireAuth><SendMoney /></RequireAuth>} />
          <Route path="/request" element={<RequireAuth><RequestMoney /></RequireAuth>} />
          <Route path="/history" element={<RequireAuth><TransactionHistory /></RequireAuth>} />
          <Route path="/scan" element={<RequireAuth><ScanQR /></RequireAuth>} />
          <Route path="/savings" element={<RequireAuth><Savings /></RequireAuth>} />
          <Route path="/contribute" element={<RequireAuth><Contribute /></RequireAuth>} />
          <Route path="/credit-score" element={<RequireAuth><CreditScore /></RequireAuth>} />
          <Route path="/marketplace" element={<RequireAuth><Marketplace /></RequireAuth>} />
          <Route path="/merchants" element={<RequireAuth><MerchantMarket /></RequireAuth>} />
          <Route path="/governance" element={<RequireAuth><Governance /></RequireAuth>} />
          <Route path="/voting" element={<RequireAuth><Voting /></RequireAuth>} />
          <Route path="/upload-receipt" element={<RequireAuth><UploadReceipt /></RequireAuth>} />
          <Route path="/setup" element={<RequireAuth allowNoStokvel><Setup /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
