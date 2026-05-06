import React, { useState, useEffect } from "react";
import axios from "axios";
import CampaignHeader from "./components/CampaignHeader";
import CampaignFilter from "./components/CampaignFilter";
import CampaignStatGrid from "./components/CampaignStatGrid";
import CampaignTable from "./components/CampaignTable";
import CampaignFormModal from "./CampaignFormModal";
import CampaignDetailPanel from "./components/CampaignDetailPanel";

const CampaignPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [selectedCampaignForDetail, setSelectedCampaignForDetail] =
    useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // === ĐỔI status THÀNH statuses (Mảng) ===
  const initialFilters = {
    keyword: "",
    statuses: [],
    fromDate: "",
    toDate: "",
  };
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey) {
        if (e.code === "KeyN" || e.key.toLowerCase() === "n") {
          e.preventDefault();
          handleOpenAdd();
        }
        if (e.code === "KeyE" || e.key.toLowerCase() === "e") {
          e.preventDefault();
          if (selectedRow) handleOpenEdit(selectedRow);
        }
        if (e.code === "KeyD" || e.key.toLowerCase() === "d") {
          e.preventDefault();
          if (selectedRow)
            handleDeleteCampaign(selectedRow.id, selectedRow.name);
        }
        if (e.code === "KeyV" || e.key.toLowerCase() === "v") {
          e.preventDefault();
          if (selectedRow) handleOpenDetail(selectedRow.id);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedRow]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCampaigns();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [currentPage, pageSize, filters]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/campaigns/statistics",
      );
      setStats(res.data);
    } catch (error) {
      console.error("Lỗi lấy thống kê:", error);
    }
  };

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/campaigns", {
        params: {
          page: currentPage - 1,
          size: pageSize,
          keyword: filters.keyword || null,
          // NỐI MẢNG THÀNH CHUỖI GỬI XUỐNG BACKEND
          statuses:
            filters.statuses.length > 0 ? filters.statuses.join(",") : null,
          fromDate: filters.fromDate || null,
          toDate: filters.toDate || null,
        },
      });
      setCampaigns(res.data.content || res.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Lỗi tải danh sách chiến dịch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDetail = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/campaigns/${id}`,
      );
      setSelectedCampaignForDetail(res.data);
      setIsPanelOpen(true);
    } catch (error) {
      console.error("Lỗi tải chi tiết chiến dịch", error);
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
    if (window.confirm(`Xóa chiến dịch "${name}"?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/campaigns/${id}`);
        setSelectedRow(null);
        fetchCampaigns();
        fetchStats();
      } catch (error) {
        console.error("Xóa thất bại!",error);
      }
    }
  };

  // Logic xử lý input chữ (keyword, date)
  const handleFilterTextChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  // Logic xử lý mảng (statuses)
  const handleFilterArrayChange = (name, value) => {
    setFilters((prev) => {
      const currentArray = prev[name];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value) // Bỏ chọn
        : [...currentArray, value]; // Thêm mới
      return { ...prev, [name]: newArray };
    });
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
        key: "keyword",
        label: `Tìm: ${filters.keyword}`,
        type: "text",
      });
    if (filters.fromDate)
      activeTags.push({
        key: "fromDate",
        label: `Từ: ${new Date(filters.fromDate).toLocaleDateString("vi-VN")}`,
        type: "text",
      });
    if (filters.toDate)
      activeTags.push({
        key: "toDate",
        label: `Đến: ${new Date(filters.toDate).toLocaleDateString("vi-VN")}`,
        type: "text",
      });

    // In từng trạng thái đang chọn ra màn hình
    filters.statuses.forEach((st) => {
      activeTags.push({
        key: `status-${st}`,
        label: `Trạng thái: ${st}`,
        type: "array",
        field: "statuses",
        value: st,
      });
    });

    if (activeTags.length === 0) return null;
    return (
      <div className="flex gap-2 mb-4 items-center flex-wrap">
        <span className="text-sm font-semibold text-slate-500">Đang lọc:</span>
        {activeTags.map((tag) => (
          <div
            key={tag.key}
            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold shadow-sm"
          >
            {tag.label}
            <button
              onClick={() =>
                tag.type === "text"
                  ? handleFilterTextChange(tag.key, "")
                  : handleFilterArrayChange(tag.field, tag.value)
              }
              className="hover:text-red-500 ml-1 outline-none"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={clearFilters}
          className="text-xs text-error font-bold ml-2 hover:underline outline-none"
        >
          Xóa tất cả
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 relative flex-1">
      <CampaignHeader onOpenAdd={handleOpenAdd} />
      <CampaignStatGrid stats={stats} />
      {renderActiveFilterTags()}

      <CampaignTable
        filteredCampaigns={campaigns}
        isLoading={isLoading}
        onOpenEdit={handleOpenEdit}
        onDelete={handleDeleteCampaign}
        onOpenDetail={handleOpenDetail}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        onRowClick={setSelectedRow}
        selectedRow={selectedRow}
        onOpenFilter={() => setIsFilterSidebarOpen(true)}
      />

      <CampaignFilter
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        filters={filters}
        onFilterTextChange={handleFilterTextChange}
        onFilterArrayChange={handleFilterArrayChange}
        clearFilters={clearFilters}
      />

      <CampaignDetailPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        campaign={selectedCampaignForDetail}
        onEdit={handleOpenEdit}
      />

      <CampaignFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => {
          fetchCampaigns();
          fetchStats();
        }}
        currentCampaign={editingCampaign}
      />
    </div>
  );
};

export default CampaignPage;
