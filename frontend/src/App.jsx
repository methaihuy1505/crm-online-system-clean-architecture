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

import AddProduct from "./pages/product/ProductInput";
import ProductInventory from "./pages/product/ProductPage";
import ProductEdit from "./pages/product/ProductEdit";
import MetadataPage from "./pages/opportunity/metadata/MetadataPage";
import SalesOpportunities from "./pages/opportunity/Opportunities";
import EditOpportunityStatus from "./pages/opportunity/metadata/StatusInput";
import EditStage from "./pages/opportunity/metadata/StageInput";
import LostReasons from "./pages/opportunity/metadata/ReasonInput";
import OpportunityLineItems from "./pages/opportunity/opportunityitem/OppotunityItem";
import OpportunityItemAdd from "./pages/opportunity/opportunityitem/OpportunityItemAdd";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route element={<MainLayout />}>
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

          <Route path="/productimport" element={<AddProduct />} />
          <Route path="/productpage" element={<ProductInventory />} />
          <Route path="/productedit/:id" element={<ProductEdit />} />
          <Route path="/metadatapage" element={<MetadataPage />} />
          <Route path="/opportunities" element={<SalesOpportunities />} />
          <Route
            path="/editopportunitystatus/:id?"
            element={<EditOpportunityStatus />}
          />
          <Route path="/editstage/:id?" element={<EditStage />} /> 
          <Route path="/lostreason/:id?" element={<LostReasons />} />
          <Route
            path="/opportunities/:id/items"
            element={<OpportunityLineItems />}
          />
          <Route
            path="/opportunities/:opportunityId/items/add"
            element={<OpportunityItemAdd />}
          />
          <Route
            path="/opportunity-items/:itemId/edit"
            element={<OpportunityItemAdd />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;