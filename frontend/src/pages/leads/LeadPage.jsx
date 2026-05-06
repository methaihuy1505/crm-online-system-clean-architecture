import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LeadHeader from "./components/LeadHeader";
import LeadFilter from "./components/LeadFilter";
import LeadStatGrid from "./components/LeadStatGrid";
import LeadTable from "./components/LeadTable";
import LeadFormModal from "./LeadFormModal";

const LeadPage = () => {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [sources, setSources] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  // SỬA: Biến các trường lọc thành Mảng (Array)
  const initialFilters = {
    keyword: "",
    statusIds: [],
    sourceIds: [],
    campaignIds: [],
  };
  const [filters, setFilters] = useState(initialFilters);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedLeadForRow, setSelectedLeadForRow] = useState(null);

  // === LẮNG NGHE PHÍM TẮT TOÀN CỤC BẢNG LIST ===
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey) {
        if (e.code === "KeyN" || e.key.toLowerCase() === "n") {
          e.preventDefault();
          handleOpenAdd();
        }
        if (e.code === "KeyE" || e.key.toLowerCase() === "e") {
          e.preventDefault();
          if (selectedLeadForRow) handleOpenEdit(selectedLeadForRow);
        }
        if (e.code === "KeyD" || e.key.toLowerCase() === "d") {
          e.preventDefault();
          if (selectedLeadForRow)
            handleDeleteLead(
              selectedLeadForRow.id,
              selectedLeadForRow.fullName,
            );
        }
        // THÊM PHÍM TẮT XEM CHI TIẾT (Alt + V)
        if (e.code === "KeyV" || e.key.toLowerCase() === "v") {
          e.preventDefault();
          if (selectedLeadForRow) handleOpenDetail(selectedLeadForRow);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedLeadForRow]);

  useEffect(() => {
    const fetchDictionaries = async () => {
      try {
        const [srcRes, camRes, statusRes] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/sources"),
          axios.get("http://localhost:8080/api/v1/campaigns/options"),
          axios.get("http://localhost:8080/api/v1/lead-statuses"),
        ]);
        setSources(srcRes.data);
        setCampaigns(camRes.data);
        setStatuses(statusRes.data);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };
    fetchDictionaries();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLeads();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, pageSize, filters]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      // Ép mảng thành chuỗi phân cách dấu phẩy để Spring Boot hiểu List<Integer>
      const params = {
        page: currentPage - 1,
        size: pageSize,
        keyword: filters.keyword || null,
        statusIds:
          filters.statusIds.length > 0 ? filters.statusIds.join(",") : null,
        sourceIds:
          filters.sourceIds.length > 0 ? filters.sourceIds.join(",") : null,
        campaignIds:
          filters.campaignIds.length > 0 ? filters.campaignIds.join(",") : null,
      };

      const response = await axios.get("http://localhost:8080/api/v1/leads", {
        params,
      });
      setLeads(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Lỗi tải Lead:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDetail = (lead) => {
    navigate(`/leads/${lead.id}`);
  };
  const handleOpenAdd = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };
  const handleOpenEdit = (lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleDeleteLead = async (id, name) => {
    if (window.confirm(`Xóa tiềm năng "${name}"?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/leads/${id}`);
        fetchLeads();
        setSelectedLeadForRow(null);
      } catch (error) {
        console.error("Lỗi khi xóa!", error);
      }
    }
  };

  // Hàm xử lý riêng cho Array (Hỗ trợ Multi-select)
  const handleFilterArrayChange = (field, id) => {
    setFilters((prev) => {
      const currentArray = prev[field];
      if (currentArray.includes(id)) {
        return { ...prev, [field]: currentArray.filter((item) => item !== id) };
      }
      return { ...prev, [field]: [...currentArray, id] };
    });
    setCurrentPage(1);
  };

  const handleFilterTextChange = (value) => {
    setFilters((prev) => ({ ...prev, keyword: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const renderActiveFilterTags = () => {
    const activeTags = [];
    if (filters.keyword)
      activeTags.push({
        type: "text",
        key: "keyword",
        label: `Tìm: ${filters.keyword}`,
      });

    filters.statusIds.forEach((id) => {
      const obj = statuses.find((s) => s.id.toString() === id);
      if (obj)
        activeTags.push({
          type: "array",
          field: "statusIds",
          id: id,
          label: `Trạng thái: ${obj.name}`,
        });
    });
    filters.sourceIds.forEach((id) => {
      const obj = sources.find((s) => s.id.toString() === id);
      if (obj)
        activeTags.push({
          type: "array",
          field: "sourceIds",
          id: id,
          label: `Nguồn: ${obj.name}`,
        });
    });
    filters.campaignIds.forEach((id) => {
      const obj = campaigns.find((c) => c.id.toString() === id);
      if (obj)
        activeTags.push({
          type: "array",
          field: "campaignIds",
          id: id,
          label: `Chiến dịch: ${obj.name}`,
        });
    });

    if (activeTags.length === 0) return null;
    return (
      <div className="flex gap-2 mt-4 items-center flex-wrap">
        <span className="text-sm font-semibold text-slate-500">Đang lọc:</span>
        {activeTags.map((tag, index) => (
          <div
            key={index}
            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold shadow-sm"
          >
            {tag.label}
            <button
              onClick={() =>
                tag.type === "array"
                  ? handleFilterArrayChange(tag.field, tag.id)
                  : handleFilterTextChange("")
              }
              className="hover:text-red-500 ml-1"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={clearFilters}
          className="text-xs text-error font-bold ml-2 hover:underline"
        >
          Xóa tất cả
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 flex-1 relative">
      <LeadHeader onOpenAdd={handleOpenAdd} />
      <LeadStatGrid filteredLeads={leads} />
      {renderActiveFilterTags()}

      <LeadTable
        filteredLeads={leads}
        totalFiltered={totalElements}
        isLoading={isLoading}
        onOpenDetail={handleOpenDetail}
        onOpenEdit={handleOpenEdit}
        onDelete={handleDeleteLead}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        onRowClick={setSelectedLeadForRow}
        selectedLeadForRow={selectedLeadForRow}
        onOpenFilter={() => setIsFilterSidebarOpen(true)}
      />

      <LeadFilter
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        filters={filters}
        onFilterTextChange={handleFilterTextChange}
        onFilterArrayChange={handleFilterArrayChange}
        clearFilters={clearFilters}
        statuses={statuses}
        sources={sources}
        campaigns={campaigns}
      />

      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchLeads}
        currentLead={editingLead}
        statuses={statuses}
        sources={sources}
        campaigns={campaigns}
      />
    </div>
  );
};

export default LeadPage;
