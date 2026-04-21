import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCampaignStatus } from "../../utils/formatters";

// Import các component con
import CampaignHeader from "./components/CampaignHeader";
import CampaignFilter from "./components/CampaignFilter";
import CampaignStatGrid from "./components/CampaignStatGrid";
import CampaignTable from "./components/CampaignTable";
import CampaignChart from "./components/CampaignChart";
import CampaignFormModal from "./CampaignFormModal";
import CampaignDetailPanel from "./components/CampaignDetailPanel";

const CampaignPage = () => {
  // === 1. QUẢN LÝ STATE ===
  const [campaigns, setCampaigns] = useState([]);
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State điều khiển Giao diện (Modal & Panel)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // State Bộ lọc
  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
    fromDate: "",
    toDate: "",
  });

  // === 2. GỌI API ===
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Gọi đồng thời 3 API để có dữ liệu tính toán thống kê
      const [campRes, leadRes, custRes] = await Promise.all([
        axios.get("http://localhost:8080/api/v1/campaigns"),
        axios.get("http://localhost:8080/api/v1/leads"),
        axios.get("http://localhost:8080/api/v1/customers"),
      ]);
      setCampaigns(campRes.data);
      setLeads(leadRes.data);
      setCustomers(custRes.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu hệ thống:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // === 3. XỬ LÝ SỰ KIỆN (HANDLERS) ===

  // Mở chi tiết chiến dịch (Gọi API lấy Stat tổng hợp từ Backend)
  const handleOpenDetail = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/campaigns/${id}`,
      );
      setSelectedCampaign(res.data);
      setIsPanelOpen(true);
    } catch (error) {
      console.error("Lỗi tải chi tiết:", error);
      alert("Không thể tải thông tin chi tiết chiến dịch này.");
    }
  };

  const handleOpenAdd = () => {
    setEditingCampaign(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (campaign) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleDeleteCampaign = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chiến dịch "${name}"?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/campaigns/${id}`);
        fetchData(); // Reload lại toàn bộ data
      } catch (error) {
        alert(
          "Lỗi khi xóa: " + (error.response?.data?.message || error.message),
        );
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // === 4. LOGIC LỌC & TÍNH TOÁN DỮ LIỆU ===
  const filteredCampaigns = campaigns.filter((c) => {
    const statusLabel = getCampaignStatus(c.startDate, c.endDate).label;
    const matchKeyword = c.name
      .toLowerCase()
      .includes(filters.keyword.toLowerCase());
    const matchStatus = filters.status === "" || statusLabel === filters.status;
    const matchDate =
      (!filters.fromDate ||
        new Date(c.startDate) >= new Date(filters.fromDate)) &&
      (!filters.toDate || new Date(c.endDate) <= new Date(filters.toDate));
    return matchKeyword && matchStatus && matchDate;
  });

  // Dữ liệu phục vụ thống kê (StatCards & Charts)
  const leadsFromCampaigns = leads.filter((lead) => lead.campaignId !== null);
  const customersFromCampaigns = customers.filter(
    (cus) => cus.campaignId !== null,
  );

  // === 5. GIAO DIỆN ===
  return (
    <div className="space-y-8 relative">
      {/* Tiêu đề & Nút thêm mới */}
      <CampaignHeader onOpenAdd={handleOpenAdd} />

      {/* Thanh bộ lọc */}
      <CampaignFilter filters={filters} onFilterChange={handleFilterChange} />

      {/* Các thẻ chỉ số thống kê (Dự thu/Thực thu/Leads/Khách hàng) */}
      <CampaignStatGrid
        campaigns={campaigns}
        leadsFromCampaigns={leadsFromCampaigns}
        customersFromCampaigns={customersFromCampaigns}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bảng danh sách chiến dịch */}
        <CampaignTable
          filteredCampaigns={filteredCampaigns}
          isLoading={isLoading}
          onOpenEdit={handleOpenEdit}
          onDelete={handleDeleteCampaign}
          onOpenDetail={handleOpenDetail} // Truyền sự kiện xem chi tiết
        />

        {/* Biểu đồ xu hướng chuyển đổi (Leads vs Customers) */}
        <CampaignChart leads={leads} customers={customers} />
      </div>

      {/* Panel Chi tiết trượt từ bên phải */}
      <CampaignDetailPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        campaign={selectedCampaign}
        onEdit={handleOpenEdit}
      />

      {/* Modal Form Thêm/Sửa */}
      <CampaignFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchData}
        currentCampaign={editingCampaign}
      />
    </div>
  );
};

export default CampaignPage;
