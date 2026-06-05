import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import toast from "react-hot-toast";

import LeadHeader from "./components/LeadHeader";
import LeadFilter from "./components/LeadFilter";
import LeadTable from "./components/LeadTable";
import LeadFormModal from "./LeadFormModal";

// IMPORT HOOK PHÂN QUYỀN
import { usePermission } from "../../hooks/usePermission";

const LeadPage = () => {
  const navigate = useNavigate();
  // --- GỌI HOOK KIỂM TRA QUYỀN ---
  const { hasPermission } = usePermission();
  const canView = hasPermission("leads.view");
  const canCreate = hasPermission("leads.create");
  const canUpdate = hasPermission("leads.update");
  const canDelete = hasPermission("leads.delete");

  const [leads, setLeads] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [sources, setSources] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [branchProvinces, setBranchProvinces] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { roleId: 1, id: 1, branchId: 1 };

  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const initialFilters = { keyword: "", statusIds: [], sourceIds: [], campaignIds: [] };
  const [filters, setFilters] = useState(initialFilters);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedLeadForRow, setSelectedLeadForRow] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const tableContainerRef = useRef(null);

  useEffect(() => {
    setSelectedIndex(-1);
    setSelectedLeadForRow(null);
  }, [leads]);

  // --- CHẶN PHÍM TẮT DỰA VÀO QUYỀN ---
  // --- CHẶN PHÍM TẮT DỰA VÀO QUYỀN & TRẠNG THÁI ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (isModalOpen || isFilterSidebarOpen) return;
      
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev < leads.length - 1 ? prev + 1 : prev;
            if (leads[next]) setSelectedLeadForRow(leads[next]);
            return next;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : 0;
            if (leads[next]) setSelectedLeadForRow(leads[next]);
            return next;
          });
          break;
      }

      if (e.altKey) {
        // Biến kiểm tra Lead đã chuyển đổi chưa
        const isConverted = selectedLeadForRow && 
          (selectedLeadForRow.statusId === 3 || selectedLeadForRow.statusName === "Đã chuyển đổi");

        // Alt + N: Thêm mới
        if ((e.code === "KeyN" || e.key.toLowerCase() === "n") && canCreate) { 
          e.preventDefault(); 
          handleOpenAdd(); 
        }
        
        // Alt + V: Xem chi tiết
        if ((e.code === "KeyV" || e.key.toLowerCase() === "v") && canView) { 
          e.preventDefault(); 
          if (selectedLeadForRow) handleOpenDetail(selectedLeadForRow); 
        }

        // Alt + E: Sửa (Có chặn nếu đã chuyển đổi)
        if ((e.code === "KeyE" || e.key.toLowerCase() === "e") && canUpdate) { 
          e.preventDefault(); 
          if (selectedLeadForRow) {
            if (isConverted) {
              toast.error("Hồ sơ đã chuyển đổi, không thể chỉnh sửa!");
            } else {
              handleOpenEdit(selectedLeadForRow); 
            }
          } 
        }

        // Alt + D: Xóa (Có chặn nếu đã chuyển đổi)
        if ((e.code === "KeyD" || e.key.toLowerCase() === "d") && canDelete) { 
          e.preventDefault(); 
          if (selectedLeadForRow) {
            if (isConverted) {
              toast.error("Hồ sơ đã chuyển đổi, không thể xóa!");
            } else {
              handleDeleteLead(selectedLeadForRow.id, selectedLeadForRow.fullName); 
            }
          } 
        }
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [leads, selectedLeadForRow, isModalOpen, isFilterSidebarOpen, canCreate, canUpdate, canDelete, canView]);
  // CHIẾT XUẤT LẠI CÁC HÀM CŨ CỦA BẠN CHO GỌN:
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
      else if (rowBottom > containerBottom) { container.scrollTo({ top: rowBottom - container.clientHeight, behavior: "smooth" }); }
    }
  }, [selectedIndex]);

  useEffect(() => {
    const fetchDictionaries = async () => {
      try {
        const [srcRes, camRes, statusRes, bpRes, userRes] = await Promise.all([
          api.get("/sources"),
          api.get("/campaigns/options"),
          api.get("/lead-statuses"),
          api.get("/branch-provinces"),
          api.get("/users", { params: { size: 100 } }),
        ]);
        setSources(srcRes.data);
        setCampaigns(camRes.data);
        setStatuses(statusRes.data);
        setBranchProvinces(bpRes.data);
        setUsers(userRes.data.content || userRes.data);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Không thể tải danh mục cấu hình!";
        toast.error(errorMessage);
        
        console.error(error);
      }
    };
    fetchDictionaries();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { fetchLeads(); }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, pageSize, filters]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage - 1,
        size: pageSize,
        keyword: filters.keyword || null,
        statusIds: filters.statusIds.length > 0 ? filters.statusIds.join(",") : null,
        sourceIds: filters.sourceIds.length > 0 ? filters.sourceIds.join(",") : null,
        campaignIds: filters.campaignIds.length > 0 ? filters.campaignIds.join(",") : null,
      };
      const response = await api.get("/leads", { params });
      setLeads(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Không thể tải danh sách Lead!";
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDetail = (lead) => navigate(`/leads/${lead.id}`);
  const handleOpenAdd = () => { setEditingLead(null); setIsModalOpen(true); };
  const handleOpenEdit = (lead) => { setEditingLead(lead); setIsModalOpen(true); };

  const handleDeleteLead = async (id, name) => {
    if (window.confirm(`Xóa tiềm năng "${name}"?`)) {
      try {
        await api.delete(`/leads/${id}`);
        toast.success(`Đã xóa ${name}`);
        fetchLeads();
        setSelectedLeadForRow(null);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Xóa thất bại!";
        toast.error(errorMessage);
        console.error("Lỗi khi xóa Lead:", error);
      }
    }
  };

  const handleFilterArrayChange = (field, id) => {
    setFilters((prev) => {
      const currentArray = prev[field];
      if (currentArray.includes(id)) return { ...prev, [field]: currentArray.filter((item) => item !== id) };
      return { ...prev, [field]: [...currentArray, id] };
    });
    setCurrentPage(1);
  };

  const handleFilterTextChange = (value) => { setFilters((prev) => ({ ...prev, keyword: value })); setCurrentPage(1); };
  const clearFilters = () => { setFilters(initialFilters); setCurrentPage(1); };

  const renderActiveFilterTags = () => {
    const activeTags = [];
    if (filters.keyword) activeTags.push({ type: "text", key: "keyword", label: `Tìm: ${filters.keyword}` });
    filters.statusIds.forEach((id) => { const obj = statuses.find((s) => s.id.toString() === id); if (obj) activeTags.push({ type: "array", field: "statusIds", id: id, label: `Trạng thái: ${obj.name}` }); });
    filters.sourceIds.forEach((id) => { const obj = sources.find((s) => s.id.toString() === id); if (obj) activeTags.push({ type: "array", field: "sourceIds", id: id, label: `Nguồn: ${obj.name}` }); });
    filters.campaignIds.forEach((id) => { const obj = campaigns.find((c) => c.id.toString() === id); if (obj) activeTags.push({ type: "array", field: "campaignIds", id: id, label: `Chiến dịch: ${obj.name}` }); });

    if (activeTags.length === 0) return null;
    return (
      <div className="flex gap-2 mb-4 items-center flex-wrap">
        <span className="text-sm font-semibold text-slate-500">Đang lọc:</span>
        {activeTags.map((tag, index) => (
          <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold shadow-sm">
            {tag.label}
            <button onClick={() => tag.type === "array" ? handleFilterArrayChange(tag.field, tag.id) : handleFilterTextChange("")} className="hover:text-red-500 ml-1 outline-none">×</button>
          </div>
        ))}
        <button onClick={clearFilters} className="text-xs text-error font-bold ml-2 hover:underline outline-none">Xóa tất cả</button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] space-y-4 relative overflow-hidden">
     
      
      {/* TRUYỀN QUYỀN XUỐNG HEADER VÀ TABLE */}
      <LeadHeader onOpenAdd={handleOpenAdd} canCreate={canCreate} />
      
      {renderActiveFilterTags()}

      <LeadTable
        filteredLeads={leads} isLoading={isLoading} onOpenDetail={handleOpenDetail} onOpenEdit={handleOpenEdit} onDelete={handleDeleteLead}
        currentPage={currentPage} totalPages={totalPages} totalElements={totalElements} setCurrentPage={setCurrentPage} pageSize={pageSize} setPageSize={setPageSize}
        onRowClick={(lead, index) => { setSelectedLeadForRow(lead); setSelectedIndex(index); }}
        tableContainerRef={tableContainerRef} selectedLeadForRow={selectedLeadForRow} onOpenFilter={() => setIsFilterSidebarOpen(true)}
        canView={canView} canUpdate={canUpdate} canDelete={canDelete} // <--- TRUYỀN XUỐNG ĐÂY
      />

      {/* ... (Các phần khác giữ nguyên) */}
      <LeadFilter
        isOpen={isFilterSidebarOpen} onClose={() => setIsFilterSidebarOpen(false)} filters={filters}
        onFilterTextChange={handleFilterTextChange} onFilterArrayChange={handleFilterArrayChange} clearFilters={clearFilters}
        statuses={statuses} sources={sources} campaigns={campaigns}
      />
      
      <LeadFormModal
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        onSave={() => { fetchLeads(); toast.success("Đã lưu thông tin Lead!"); }}
        currentLead={editingLead} statuses={statuses} sources={sources} campaigns={campaigns}
        branchProvinces={branchProvinces} users={users} currentUser={currentUser} 
      />
    </div>
  );
};
export default LeadPage;