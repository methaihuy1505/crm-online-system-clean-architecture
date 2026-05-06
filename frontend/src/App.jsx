import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import LeadPage from "./pages/leads/LeadPage";
import LeadDetailPage from "./pages/leads/LeadDetailPage";
import CustomerDetailPage from "./pages/customers/CustomerDetailPage";

import CampaignPage from "./pages/campaigns/CampaignPage";
import CustomerPage from "./pages/customers/CustomerPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/leads" replace />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="/leads" element={<LeadPage />} />
          <Route path="/leads/:id" element={<LeadDetailPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route
            path="/dashboard"
            element={
              <div className="p-4 text-primary font-bold">
                Trang Bảng điều khiển đang phát triển...
              </div>
            }
          />
          <Route path="/campaigns" element={<CampaignPage />} />
          <Route
            path="/settings"
            element={
              <div className="p-4 text-primary font-bold">
                Trang Cài đặt đang phát triển...
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
