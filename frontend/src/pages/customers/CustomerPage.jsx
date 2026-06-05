import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import toast from "react-hot-toast";

import CustomerHeader from "./components/CustomerHeader";
import CustomerFilter from "./components/CustomerFilter";
import CustomerTable from "./components/CustomerTable";
import CustomerFormModal from "./components/CustomerFormModal";

// IMPORT HOOK QUYỀN
import { usePermission } from "../../hooks/usePermission";

const CustomerPage = () => {
  const navigate = useNavigate();
  
  // KIỂM TRA QUYỀN
  const { hasPermission } = usePermission();
  const canView = hasPermission("customers.view");
  const canCreate = hasPermission("customers.create");
  const canUpdate = hasPermission("customers.update");
  const canDelete = hasPermission("customers.delete");

  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ... (giữ nguyên các state: currentPage, pageSize, totalPages, totalElements, statuses, ranks, sources, campaigns, filters, etc.)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [statuses, setStatuses] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [sources, setSources] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [branchProvinces, setBranchProvinces] = useState([]);

  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const initialFilters = { keyword: "", isOrganization: "", statusIds: [], rankIds: [], sourceIds: [], campaignIds: [], };
  const [filters, setFilters] = useState(initialFilters);

  const [selectedCustomerForRow, setSelectedCustomerForRow] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  const tableContainerRef = useRef(null);

  useEffect(() => {
    setSelectedIndex(-1);
    setSelectedCustomerForRow(null);
  }, [customers]);

  // XỬ LÝ PHÍM TẮT KÈM ĐIỀU KIỆN QUYỀN
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (isFormOpen || isFilterSidebarOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev < customers.length - 1 ? prev + 1 : prev;
            if (customers[next]) setSelectedCustomerForRow(customers[next]);
            return next;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : 0;
            if (customers[next]) setSelectedCustomerForRow(customers[next]);
            return next;
          });
          break;
      }

      if (e.altKey) {
        if ((e.code === "KeyN" || e.key.toLowerCase() === "n") && canCreate) {
          e.preventDefault();
          handleOpenAdd();
        }
        if ((e.code === "KeyE" || e.key.toLowerCase() === "e") && canUpdate) {
          e.preventDefault();
          if (selectedCustomerForRow) handleOpenEdit(selectedCustomerForRow);
        }
        if ((e.code === "KeyD" || e.key.toLowerCase() === "d") && canDelete) {
          e.preventDefault();
          if (selectedCustomerForRow) handleDelete(selectedCustomerForRow.id, selectedCustomerForRow.name);
        }
        if ((e.code === "KeyV" || e.key.toLowerCase() === "v") && canView) {
          e.preventDefault();
          if (selectedCustomerForRow) handleOpenDetail(selectedCustomerForRow);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [customers, selectedCustomerForRow, isFormOpen, isFilterSidebarOpen, canCreate, canUpdate, canDelete, canView]);

  // ... (Giữ nguyên phần auto-scroll, fetchDictionaries, fetchCustomers, handle actions, clearFilters, renderActiveFilterTags)
  
  // CHIẾT XUẤT LẠI CÁC HÀM XỬ LÝ:
  useEffect(() => {
    if (selectedIndex === -1 || !tableContainerRef.current) return;
    const activeRow = tableContainerRef.current.querySelector(`tr[data-index="${selectedIndex}"]`);
    if (activeRow) {
      const container = tableContainerRef.current;
      const rowTop = activeRow.offsetTop;
      const rowBottom = rowTop + activeRow.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      if (rowTop < containerTop) { container.scrollTo({ top: rowTop, behavior: "smooth" }); } 
      else if (rowBottom > containerBottom) { container.scrollTo({ top: rowBottom - container.clientHeight, behavior: "smooth", }); }
    }
  }, [selectedIndex]);

  useEffect(() => {
    const fetchDictionaries = async () => {
      try {
        const [statRes, rankRes, srcRes, campRes,bpRes] = await Promise.all([
          api.get("/customer-statuses"), api.get("/customer-ranks"), api.get("/sources"), api.get("/campaigns/options"),api.get("/branch-provinces")
        ]);
        setStatuses(statRes.data); setRanks(rankRes.data); setSources(srcRes.data); setCampaigns(campRes.data);setBranchProvinces(bpRes.data);
      } catch (error) { 
        const errorMessage = error.response?.data?.message || "Lỗi khi tải danh mục hệ thống!";
        toast.error(errorMessage);
        console.error(error);
      }
    };
    fetchDictionaries();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => { fetchCustomers(); }, 500);
    return () => clearTimeout(delayDebounce);
  }, [currentPage, pageSize, filters]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage - 1, size: pageSize, keyword: filters.keyword || null, isOrganization: filters.isOrganization || null,
        statusIds: filters.statusIds.length > 0 ? filters.statusIds.join(",") : null, rankIds: filters.rankIds.length > 0 ? filters.rankIds.join(",") : null,
        sourceIds: filters.sourceIds.length > 0 ? filters.sourceIds.join(",") : null, campaignIds: filters.campaignIds.length > 0 ? filters.campaignIds.join(",") : null,
      };
      const res = await api.get("/customers", { params });
      setCustomers(res.data.content); setTotalPages(res.data.totalPages); setTotalElements(res.data.totalElements);
    } catch (error) { 
      const errorMessage = error.response?.data?.message || "Lỗi tải danh sách khách hàng!";
      toast.error(errorMessage);
      console.error(error);
    } finally { setIsLoading(false); }
  };

  const handleOpenDetail = (customer) => navigate(`/customers/${customer.id}`);
  const handleOpenAdd = () => { setCustomerToEdit(null); setIsFormOpen(true); };
  const handleOpenEdit = (customer) => { setCustomerToEdit(customer); setIsFormOpen(true); };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Xóa Khách hàng "${name}"?`)) {
      try { await api.delete(`/customers/${id}`); toast.success(`Đã xóa Khách hàng ${name}`); fetchCustomers(); } 
      catch (error) { 
        const errorMessage = error.response?.data?.message || "Xóa thất bại!";
        toast.error(errorMessage);
        console.error(error);
      }
    }
  };

  const handleFilterTextChange = (field, value) => { setFilters((prev) => ({ ...prev, [field]: value })); setCurrentPage(1); };
  const handleFilterArrayChange = (field, id) => {
    setFilters((prev) => {
      const currentArray = prev[field];
      if (currentArray.includes(id)) return { ...prev, [field]: currentArray.filter((item) => item !== id) };
      return { ...prev, [field]: [...currentArray, id] };
    });
    setCurrentPage(1);
  };
  const clearFilters = () => { setFilters(initialFilters); setCurrentPage(1); };

  const renderActiveFilterTags = () => {
    const activeTags = [];
    if (filters.keyword) activeTags.push({ type: "text", key: "keyword", label: `Tìm: ${filters.keyword}` });
    if (filters.isOrganization !== "") activeTags.push({ type: "text", key: "isOrganization", label: `Loại: ${filters.isOrganization === "true" ? "Tổ chức" : "Cá nhân"}` });
    filters.statusIds.forEach((id) => { const obj = statuses.find((s) => s.id.toString() === id); if (obj) activeTags.push({ type: "array", field: "statusIds", id: id, label: `Trạng thái: ${obj.name}` }); });
    filters.rankIds.forEach((id) => { const obj = ranks.find((r) => r.id.toString() === id); if (obj) activeTags.push({ type: "array", field: "rankIds", id: id, label: `Hạng: ${obj.name}` }); });
    filters.sourceIds.forEach((id) => { const obj = sources.find((s) => s.id.toString() === id); if (obj) activeTags.push({ type: "array", field: "sourceIds", id: id, label: `Nguồn: ${obj.name}` }); });
    filters.campaignIds.forEach((id) => { const obj = campaigns.find((c) => c.id.toString() === id); if (obj) activeTags.push({ type: "array", field: "campaignIds", id: id, label: `Chiến dịch: ${obj.name}` }); });
    if (activeTags.length === 0) return null;
    return (
      <div className="flex gap-2 mb-4 items-center flex-wrap shrink-0">
        <span className="text-sm font-semibold text-slate-500">Đang lọc:</span>
        {activeTags.map((tag, index) => (
          <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold shadow-sm">
            {tag.label}
            <button onClick={() => tag.type === "array" ? handleFilterArrayChange(tag.field, tag.id) : handleFilterTextChange(tag.key, "")} className="hover:text-red-500 ml-1 outline-none">×</button>
          </div>
        ))}
        <button onClick={clearFilters} className="text-xs text-error font-bold ml-2 hover:underline outline-none">Xóa tất cả</button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] space-y-4 relative overflow-hidden">
      
      <div className="shrink-0">
        {/* TRUYỀN QUYỀN QUA HEADER */}
        <CustomerHeader
          totalCustomers={totalElements}
          onOpenAdd={handleOpenAdd}
          canCreate={canCreate}
        />
      </div>
      {renderActiveFilterTags()}

      {/* TRUYỀN QUYỀN QUA TABLE */}
      <CustomerTable
        customers={customers} isLoading={isLoading} onOpenDetail={handleOpenDetail} onEdit={handleOpenEdit} onDelete={handleDelete}
        currentPage={currentPage} totalPages={totalPages} totalElements={totalElements} setCurrentPage={setCurrentPage} pageSize={pageSize} setPageSize={setPageSize}
        onRowClick={(customer, index) => { setSelectedCustomerForRow(customer); setSelectedIndex(index); }}
        tableContainerRef={tableContainerRef} selectedCustomerForRow={selectedCustomerForRow} onOpenFilter={() => setIsFilterSidebarOpen(true)}
        canView={canView} canUpdate={canUpdate} canDelete={canDelete}
      />

      <CustomerFilter
        isOpen={isFilterSidebarOpen} onClose={() => setIsFilterSidebarOpen(false)} filters={filters}
        onFilterTextChange={handleFilterTextChange} onFilterArrayChange={handleFilterArrayChange} clearFilters={clearFilters}
        statuses={statuses} ranks={ranks} sources={sources} campaigns={campaigns}
      />
      <CustomerFormModal
        isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} initialData={customerToEdit}
        onSuccess={() => { fetchCustomers(); toast.success("Đã lưu thông tin Khách hàng!"); }}
        statuses={statuses} ranks={ranks} sources={sources} campaigns={campaigns} branchProvinces={branchProvinces}
      />
    </div>
  );
};
export default CustomerPage;