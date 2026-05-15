import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import LeadPage from "./pages/leads/LeadPage";
import AddProduct from "./pages/product/ProductInput";
import ProductInventory from "./pages/product/ProductPage";
import ProductEdit from "./pages/product/ProductEdit";
import MetadataPage from "./pages/opportunity/metadata/MetadataPage";
import SalesOpportunities from "./pages/opportunity/Opportunities";
import EditOpportunityStatus from "./pages/opportunity/metadata/StatusInput";
// import EditStage from "./pages/opportunity/metadata/StageInput";
// import LostReasons from "./pages/opportunity/metadata/ReasonInput";
import OpportunityLineItems from "./pages/opportunity/opportunityitem/OppotunityItem";
import OpportunityItemAdd from "./pages/opportunity/opportunityitem/OpportunityItemAdd";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/productpage" replace />} />
          <Route path="/leads" element={<LeadPage />} />
          <Route path="/productimport" element={<AddProduct />} />
          <Route path="/productpage" element={<ProductInventory />} />
          <Route path="/productedit/:id" element={<ProductEdit />} />{" "}
          <Route path="/metadatapage" element={<MetadataPage />} />
          <Route path="/opportunities" element={<SalesOpportunities />} />
          <Route
            path="/editopportunitystatus/:id?"
            element={<EditOpportunityStatus />}
          />{" "}
          {/* <Route path="/editstage/:id?" element={<EditStage />} />{" "}
          <Route path="/lostreason/:id?" element={<LostReasons />} />{" "} */}
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
