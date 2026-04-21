import React, { useState, useEffect } from "react";
import axios from "axios";
import LeadFormModal from "./LeadFormModal";

// Import các Component đã được bóc tách
import LeadHeader from "./components/LeadHeader";
import LeadFilter from "./components/LeadFilter";
import LeadStatGrid from "./components/LeadStatGrid";
import LeadTable from "./components/LeadTable";

const LeadPage = () => {
  // === 1. STATE MANAGEMENT ===
  const [leads, setLeads] = useState([]);
  const [sources, setSources] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  // State Filter
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    statusId: "",
    sourceId: "",
    campaignId: "",
    provinceId: "",
    branchId: "",
    assignedTo: "",
  });

  // === 2. API CALLS ===
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [leadRes, srcRes, camRes, statusRes] = await Promise.all([
        axios.get("http://localhost:8080/api/v1/leads"),
        axios.get("http://localhost:8080/api/v1/sources"),
        axios.get("http://localhost:8080/api/v1/campaigns"),
        axios.get("http://localhost:8080/api/v1/lead-statuses"),
      ]);
      setLeads(leadRes.data);
      setSources(srcRes.data);
      setCampaigns(camRes.data);
      setStatuses(statusRes.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/leads");
      setLeads(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu Lead:", error);
    }
  };

  // === 3. HANDLERS ===
  const handleOpenAdd = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleDeleteLead = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khách hàng "${name}"?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/leads/${id}`);
        fetchLeads();
      } catch (error) {
        alert(
          "Lỗi khi xóa khách hàng: " +
            (error.response?.data?.message || error.message),
        );
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset về trang 1
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      statusId: "",
      sourceId: "",
      campaignId: "",
      provinceId: "",
      branchId: "",
      assignedTo: "",
    });
    setCurrentPage(1); // Reset về trang 1
  };

  // === 4. FILTER LOGIC ===
  const filteredLeads = leads.filter((lead) => {
    const kw = filters.keyword.toLowerCase();
    const matchKeyword =
      kw === "" ||
      (lead.fullName || "").toLowerCase().includes(kw) ||
      (lead.phone || "").includes(kw) ||
      (lead.email || "").toLowerCase().includes(kw) ||
      (lead.companyName || "").toLowerCase().includes(kw);

    const matchStatus =
      filters.statusId === "" || lead.statusId?.toString() === filters.statusId;
    const matchSource =
      filters.sourceId === "" || lead.sourceId?.toString() === filters.sourceId;
    const matchCampaign =
      filters.campaignId === "" ||
      lead.campaignId?.toString() === filters.campaignId;
    const matchProvince =
      filters.provinceId === "" ||
      lead.provinceId?.toString() === filters.provinceId;
    const matchBranch =
      filters.branchId === "" || lead.branchId?.toString() === filters.branchId;
    const matchAssignedTo =
      filters.assignedTo === "" ||
      lead.assignedTo?.toString() === filters.assignedTo;

    return (
      matchKeyword &&
      matchStatus &&
      matchSource &&
      matchCampaign &&
      matchProvince &&
      matchBranch &&
      matchAssignedTo
    );
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // === 5. RENDER ===
  return (
    <div className="space-y-8 flex-1 relative">
      {/* 1. Header Component */}
      <LeadHeader onOpenAdd={handleOpenAdd} />

      {/* 2. Filter Component */}
      <LeadFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        showAdvanced={showAdvanced}
        setShowAdvanced={setShowAdvanced}
        clearFilters={clearFilters}
        statuses={statuses}
        sources={sources}
        campaigns={campaigns}
      />

      {/* 3. Thống kê Component */}
      <LeadStatGrid filteredLeads={filteredLeads} />

      {/* 4. Bảng dữ liệu Component */}
      <LeadTable
        filteredLeads={paginatedLeads} 
        totalFiltered={filteredLeads.length}
        isLoading={isLoading}
        onOpenEdit={handleOpenEdit}
        onDelete={handleDeleteLead}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {/* 5. Modal Component */}
      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchLeads}
        currentLead={editingLead}
      />
    </div>
  );
};

export default LeadPage;
