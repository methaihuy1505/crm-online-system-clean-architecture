import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./components/layout/MainLayout";

import DashboardPage from "./pages/dashboard/DashboardPage";
import LeadPage from "./pages/leads/LeadPage";
import LeadDetailPage from "./pages/leads/LeadDetailPage";
import CustomerPage from "./pages/customers/CustomerPage";
import CustomerDetailPage from "./pages/customers/CustomerDetailPage";
import CampaignPage from "./pages/campaigns/CampaignPage";

import ActivityList from "./pages/activites/ActivityList";
import ActivityDetail from "./pages/activites/ActivityDetail";
import TaskList from "./pages/task/TaskList";
import DetailTask from "./pages/task/DetailTask";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route element={<MainLayout />}>
          {/* Chuyển hướng mặc định về Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} /> 

          <Route path="/dashboard" element={<DashboardPage />} /> 
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/leads" element={<LeadPage />} />
          <Route path="/leads/:id" element={<LeadDetailPage />} />
          <Route path="/campaigns" element={<CampaignPage />} />
          <Route
            path="/settings"
            element={
              <div className="p-4 text-primary font-bold">
                Trang Cài đặt đang phát triển...
              </div>
            }
          />
          <Route path="/activities" element={<ActivityList />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/task" element={<TaskList />} />
          <Route path="/tasks/:id" element={<DetailTask />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;