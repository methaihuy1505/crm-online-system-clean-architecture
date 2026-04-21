import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CustomerHeader from "./components/CustomerHeader";
import CustomerStats from "./components/CustomerStats";
import CustomerFilter from "./components/CustomerFilter";
import CustomerTable from "./components/CustomerTable";
import CustomerDetailPanel from "./components/CustomerDetailPanel";
import CustomerFormModal from "./components/CustomerFormModal";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE TỪ ĐIỂN (DICTIONARY) DÙNG CHUNG ---
  const [statuses, setStatuses] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [sources, setSources] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  // --- STATE BỘ LỌC (FILTER) ---
  const initialFilters = {
    keyword: "",
    statusId: "",
    rankId: "",
    isOrganization: "",
    provinceId: "",
    branchId: "",
    assignedUserId: "",
    sourceId: "",
    campaignId: "", // Bổ sung 2 trường mới
  };
  const [filters, setFilters] = useState(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // State điều khiển Panel & Form
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  // Gọi API lấy toàn bộ dữ liệu (Khách hàng + Các danh mục)
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [cusRes, statRes, rankRes, srcRes, campRes] = await Promise.all([
        axios.get("http://localhost:8080/api/v1/customers"),
        axios.get("http://localhost:8080/api/v1/customer-statuses"),
        axios.get("http://localhost:8080/api/v1/customer-ranks"),
        axios.get("http://localhost:8080/api/v1/sources"),
        axios.get("http://localhost:8080/api/v1/campaigns"),
      ]);
      setCustomers(cusRes.data);
      setStatuses(statRes.data);
      setRanks(rankRes.data);
      setSources(srcRes.data);
      setCampaigns(campRes.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => setFilters(initialFilters);

  // Lọc dữ liệu Frontend
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const kw = filters.keyword.toLowerCase();
      const matchKeyword =
        !kw ||
        customer.name?.toLowerCase().includes(kw) ||
        customer.customerCode?.toLowerCase().includes(kw) ||
        customer.mainPhone?.includes(kw) ||
        customer.emailOfficial?.toLowerCase().includes(kw) ||
        customer.taxCode?.includes(kw);

      const matchStatus =
        !filters.statusId || customer.statusId?.toString() === filters.statusId;
      const matchRank =
        !filters.rankId || customer.rankId?.toString() === filters.rankId;
      const matchSource =
        !filters.sourceId || customer.sourceId?.toString() === filters.sourceId;
      // const matchCampaign = !filters.campaignId || customer.campaignId?.toString() === filters.campaignId; // (Tạm khóa campaign nếu backend DTO chưa trả ra, mở ra nếu có)

      const matchType =
        filters.isOrganization === ""
          ? true
          : filters.isOrganization === "true"
            ? customer.isOrganization === true
            : customer.isOrganization === false;

      return (
        matchKeyword && matchStatus && matchRank && matchType && matchSource
      );
    });
  }, [customers, filters]);

  // Các hàm tương tác UI
  const handleOpenDetail = (customer) => {
    setSelectedCustomer(customer);
    setIsPanelOpen(true);
  };
  const handleCloseDetail = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedCustomer(null), 300);
  };
  const handleOpenAdd = () => {
    setCustomerToEdit(null);
    setIsFormOpen(true);
  };
  const handleOpenEdit = (customer) => {
    setCustomerToEdit(customer);
    setIsFormOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Xóa mềm Khách hàng "${name}"?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/customers/${id}`);
        fetchData(); // Reload
        if (selectedCustomer?.id === id) handleCloseDetail();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const stats = {
    totalB2B: customers.filter((c) => c.isOrganization).length,
    totalB2C: customers.filter((c) => !c.isOrganization).length,
    totalDiamond: customers.filter((c) => c.rankName === "Kim cương").length,
  };

  return (
    <div className="space-y-8 relative">
      <CustomerHeader
        totalCustomers={filteredCustomers.length}
        onOpenAdd={handleOpenAdd}
      />
      <CustomerStats stats={stats} />

      {/* Truyền các danh mục xuống Filter */}
      <CustomerFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        showAdvanced={showAdvanced}
        setShowAdvanced={setShowAdvanced}
        clearFilters={clearFilters}
        statuses={statuses}
        ranks={ranks}
        sources={sources}
        campaigns={campaigns}
      />

      <CustomerTable
        customers={filteredCustomers}
        isLoading={isLoading}
        onOpenDetail={handleOpenDetail}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <CustomerDetailPanel
        isOpen={isPanelOpen}
        onClose={handleCloseDetail}
        customer={selectedCustomer}
        onEdit={handleOpenEdit}
      />

      {/* Truyền các danh mục xuống Modal */}
      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={customerToEdit}
        onSuccess={fetchData}
        statuses={statuses}
        ranks={ranks}
        sources={sources}
        campaigns={campaigns}
      />
    </div>
  );
};

export default CustomerPage;
