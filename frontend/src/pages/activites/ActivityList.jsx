import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { Plus, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

import ActivityFormModal from "./components/ActivityFormModal";
import ActivityFilter from "./components/ActivityFilter.jsx";

import { CallTable } from "./components/tables/CallTable";
import { MeetingTable } from "./components/tables/MeetingTable";
import { NoteTable } from "./components/tables/NoteTable";
import { EmailTable } from "./components/tables/EmailTable";

import { usePermission } from "../../hooks/usePermission";

const ActivityList = () => {
  const navigate = useNavigate();

  const { hasPermission } = usePermission();
  const canView = hasPermission("activities.view");
  const canCreate = hasPermission("activities.create");
  const canUpdate = hasPermission("activities.update");
  const canDelete = hasPermission("activities.delete");


  const currentUserId = parseInt(localStorage.getItem("user_id") || "1", 10);

  const [callActivites, setCallActivities] = useState([]);
  const [meetingActivites, setMeetingActivities] = useState([]);
  const [noteActivites, setNoteActivities] = useState([]);
  const [emailQuoteActivites, setEmailQuoteActivities] = useState([]);
  const [emailTransactionActivites, setEmailTransactionActivities] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState("CALL");
  const [keyword, setKeyword] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    activityTypes: ["CALL"],  
    parentTypes: [], 
    isPriority: [],
    isCompleted: [],  
    callTypes: [] 
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // STATE ĐIỀU HƯỚNG ROW MỚI
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const tableContainerRef = useRef(null);

  const activityTypes = [
    { id: "CALL", name: "Cuộc gọi" },
    { id: "MEETING", name: "Cuộc họp" },
    { id: "EMAIL_QUOTE", name: "Báo giá" },
    { id: "NOTE", name: "Ghi chú" },
    { id: "EMAIL_TRANSACTION", name: "Email giao dịch" },
  ];

  const parentTypes = [
    { id: "LEAD", name: "Tiềm năng" },
    { id: "CUSTOMER", name: "Khách hàng" },
    { id: "OPPORTUNITY", name: "Cơ hội" },
  ];

  const isFilterActive = () => {
    const { activityTypes, ...restFilters } = filters;
    return Object.values(restFilters).some(arr => Array.isArray(arr) && arr.length > 0);
  };

  const activeFiltersCount = Object.entries(filters).reduce((acc, [key, curr]) => {
    if (key === "activityTypes") return acc;
    return acc + (Array.isArray(curr) ? curr.length : 0);
  }, 0);

  const clearAllTableStates = () => {
    setCallActivities([]); setMeetingActivities([]); setNoteActivities([]);
    setEmailQuoteActivities([]); setEmailTransactionActivities([]);
  };

  const assignDataToTargetState = (targetType, dataArray) => {
    if (targetType === "CALL") setCallActivities(dataArray);
    else if (targetType === "MEETING") setMeetingActivities(dataArray);
    else if (targetType === "NOTE") setNoteActivities(dataArray);
    else if (targetType === "EMAIL_QUOTE") setEmailQuoteActivities(dataArray);
    else if (targetType === "EMAIL_TRANSACTION") setEmailTransactionActivities(dataArray);
  };

  const fetchActivities = async () => {
    setIsLoading(true); setError(null);
    try {
      let response;
      const cleanToggle = (arr) => (arr && arr.length > 0 ? arr[0] : null);
      const selectedCallTypeFilter = cleanToggle(filters.callTypes);

      if (activeType === "CALL" && selectedCallTypeFilter) {
        response = await api.get(`/activities/activity-type/callType/${selectedCallTypeFilter}`, {
          params: { page: currentPage - 1, size: pageSize },
        });
      } else {
        response = await api.get(`/activities/activity-type/${activeType}`, {
          params: { page: currentPage - 1, size: pageSize, keyword: keyword.trim() || null },
        });
      }

      const responseData = response.data;
      const dataList = responseData.data || responseData.content || [];

      clearAllTableStates();
      assignDataToTargetState(activeType, dataList);
      setTotalPages(responseData.totalPages || 1);
      setTotalElements(responseData.totalElements || 0);
    } catch (err) {
      console.error(err); setError("Không thể tải danh sách hoạt động.");
    } finally { setIsLoading(false); }
  };

  const fetchAdvanceSearch = async () => {
    setIsLoading(true); setError(null);
    try {
      const cleanToggle = (arr, totalOptions) => {
        if (!arr || arr.length === 0 || arr.length === totalOptions) return null;
        return arr[0];
      };

      const selectedType = filters.activityTypes.length > 0 ? filters.activityTypes[0] : activeType;
      const apiParams = {
        page: currentPage - 1, size: pageSize, activityType: selectedType, 
        parentTypes: filters.parentTypes.length > 0 ? filters.parentTypes : null, 
        isPriority: cleanToggle(filters.isPriority, 2), isCompleted: cleanToggle(filters.isCompleted, 2),
        callType: cleanToggle(filters.callTypes, 2), keyword: keyword.trim() || null
      };

      const response = await api.get(`/activities/advanced-search`, {
        params: apiParams, paramsSerializer: { indexes: null }
      });

      const responseData = response.data;
      const data = responseData.data || responseData.content || [];

      if (activeType !== selectedType) setActiveType(selectedType);

      clearAllTableStates();
      assignDataToTargetState(selectedType, data);
      setTotalElements(responseData.totalElements || 0);
      setTotalPages(responseData.totalPages || 1);
    } catch (err) {
      console.error(err); setError("Lỗi kết nối bộ lọc nâng cao");
    } finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (isFilterActive()) fetchAdvanceSearch(); else fetchActivities();
  }, [activeType, currentPage, pageSize, filters, keyword]);

  // RESET SELECTION KHI DATA THAY ĐỔI
  useEffect(() => {
    setSelectedIndex(-1);
    setSelectedRow(null);
  }, [callActivites, meetingActivites, noteActivites, emailQuoteActivites, emailTransactionActivites, activeType, currentPage]);

  // SỰ KIỆN PHÍM TẮT VÀ MŨI TÊN (ĐÃ FIX CHUẨN)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (isModalOpen || isFilterOpen) return;

      let currentData = [];
      if (activeType === "CALL") currentData = callActivites;
      else if (activeType === "MEETING") currentData = meetingActivites;
      else if (activeType === "NOTE") currentData = noteActivites;
      else if (activeType === "EMAIL_QUOTE") currentData = emailQuoteActivites;
      else if (activeType === "EMAIL_TRANSACTION") currentData = emailTransactionActivites;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev < currentData.length - 1 ? prev + 1 : prev;
            if (currentData[next]) setSelectedRow(currentData[next]);
            return next;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : 0;
            if (currentData[next]) setSelectedRow(currentData[next]);
            return next;
          });
          break;
      }

      if (e.altKey) {
        if ((e.code === "KeyN" || e.key.toLowerCase() === "m") && canCreate) {
          e.preventDefault();
          openCreateModal();
        }
        if ((e.code === "KeyE" || e.key.toLowerCase() === "e") && canUpdate && selectedRow) {
          e.preventDefault();
          openEditModal(selectedRow);
        }
        if ((e.code === "KeyD" || e.key.toLowerCase() === "d") && canDelete && selectedRow) {
          e.preventDefault();
          handleDelete(selectedRow.id);
        }
        if ((e.code === "KeyV" || e.key.toLowerCase() === "v") && canView && selectedRow) {
          e.preventDefault();
          navigate(`/activities/${selectedRow.id}`);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, isFilterOpen, activeType, selectedRow, callActivites, meetingActivites, noteActivites, emailQuoteActivites, emailTransactionActivites, canCreate, canUpdate, canDelete, canView, navigate]);

  // TỰ ĐỘNG CUỘN UI BẢNG (AUTO SCROLL)
  useEffect(() => {
    if (selectedIndex === -1 || !tableContainerRef.current) return;
    const activeRow = tableContainerRef.current.querySelector(`tr[data-index="${selectedIndex}"]`);
    if (activeRow) {
      const container = tableContainerRef.current;
      const rowTop = activeRow.offsetTop;
      const rowBottom = rowTop + activeRow.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      if (rowTop < containerTop) {
        container.scrollTo({ top: rowTop, behavior: "smooth" });
      } else if (rowBottom > containerBottom) {
        container.scrollTo({ top: rowBottom - container.clientHeight, behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  const handleSortCallType = async () => {
    const currentCT = filters.callTypes[0];
    const nextCT = currentCT === "OUTBOUND" ? ["INBOUND"] : currentCT === "INBOUND" ? [] : ["OUTBOUND"];
    setFilters((prev) => ({ ...prev, callTypes: nextCT }));
    setCurrentPage(1);
  };

  const handleSortParentType = () => {
    const currentPT = filters.parentTypes[0];
    const nextPT = currentPT === "LEAD" ? ["CUSTOMER"] : currentPT === "CUSTOMER" ? ["OPPORTUNITY"] : currentPT === "OPPORTUNITY" ? [] : ["LEAD"];
    setFilters((prev) => ({ ...prev, parentTypes: nextPT }));
    setCurrentPage(1);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    if (field === "activityTypes" && Array.isArray(value) && value.length > 0) setActiveType(value[0]);
    setCurrentPage(1); 
  };

  const handleClearFilters = () => {
    setFilters({ activityTypes: [activeType], parentTypes: [], isPriority: [], isCompleted: [], callTypes: [] });
    setKeyword(""); setCurrentPage(1);
  };

  const handleActivieType = (type) => {
    setActiveType(type);
    setFilters((prev) => ({ ...prev, activityTypes: [type] }));
    setCurrentPage(1);
  };

  const openCreateModal = () => { setSelectedActivity(null); setIsModalOpen(true); };
  const openEditModal = (activity) => { setSelectedActivity(activity); setIsModalOpen(true); };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hoạt động này?")) {
      try {
        await api.delete(`/activities/${id}`);
        toast.success("Xóa hoạt động thành công!");
        if (isFilterActive()) fetchAdvanceSearch(); else fetchActivities();
      } catch (err) { 
        const errorMessage = err.response?.data?.message || "Thao tác xóa thất bại.";
        toast.error(errorMessage);
        console.error(err);
      }
    }
  };

  const handleToggleCompleted = async (activity) => {
    try {
      const updatedActivity = { ...activity, isCompleted: !activity.isCompleted, updatedBy: currentUserId };
      await api.put(`/activities/${activity.id}`, updatedActivity);
      toast.success("Cập nhật trạng thái thành công!");
      if (isFilterActive()) fetchAdvanceSearch(); else fetchActivities();
    } catch (error) { console.error(error); }
  };

  const handleTogglePriority = async (activity) => {
    try {
      const updatedActivity = { ...activity, isPriority: !activity.isPriority, updatedBy: currentUserId };
      await api.put(`/activities/${activity.id}`, updatedActivity);
      toast.success("Cập nhật độ ưu tiên thành công!");
      if (isFilterActive()) fetchAdvanceSearch(); else fetchActivities();
    } catch (error) { console.error(error); }
  };

  const getVisiblePages = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] space-y-4 relative overflow-hidden text-[11px]">

      <div className="shrink-0">
        <div className="flex justify-between items-end gap-4">
            <div>
                <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">Quản lý các hoạt động chăm sóc</h2>
            </div>
            <div className="flex-1 max-w-lg flex items-center gap-3">
                <div className="flex-1 relative group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo nội dung, chủ đề..."
                        value={keyword}
                        onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/80 hover:bg-slate-100/80 border-2 border-transparent rounded-full text-sm font-medium outline-none focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-400 text-slate-800"
                    />
                </div>
                {/* HIỂN THỊ NÚT TẠO MỚI THEO QUYỀN */}
                {canCreate && (
                  <button
                      onClick={openCreateModal}
                      className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-blue-800 text-white rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all outline-none"
                  >
                      <Plus size={18} strokeWidth={3} /> Thêm hoạt động (Alt+N)
                  </button>
                )}
            </div>
        </div>
      </div>
      
      {/* ... (Đoạn Tabs và Filter giữ nguyên) ... */}
      <div className="flex items-center justify-between bg-white p-2 rounded-xl shadow-sm shrink-0 border border-slate-100">
        <div className="flex items-center">
            {activityTypes.map((type) => (
                <button
                key={type.id}
                onClick={() => handleActivieType(type.id)}
                className={`px-5 py-2.5 font-bold text-sm transition-all rounded-lg ${
                    activeType === type.id
                    ? "bg-primary/10 text-primary"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
                >
                {type.name}
                </button>
            ))}
        </div>
        <button
            onClick={() => setIsFilterOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all outline-none ${
            activeFiltersCount > 0
                ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
            }`}
        >
            <Filter size={16} strokeWidth={2.5} />
            Bộ lọc
            {activeFiltersCount > 0 && (
            <span className="w-5 h-5 flex items-center justify-center bg-blue-600 text-white font-black text-[10px] rounded-full animate-pulse">
                {activeFiltersCount}
            </span>
            )}
        </button>
      </div>
      
      

      <div className="flex-1 bg-white border border-slate-200 overflow-hidden relative flex flex-col rounded-2xl shadow-sm">
        <div ref={tableContainerRef} className="flex-1 overflow-auto custom-scrollbar">
          {error ? (
            <div className="flex items-center justify-center py-12 text-red-500 font-bold">Lỗi: {error}</div>
          ) : (
            <>
              {activeType === "CALL" && <CallTable data={callActivites} onEdit={openEditModal} onDelete={handleDelete} onToggleCompleted={handleToggleCompleted} onTogglePriority={handleTogglePriority} onSortCallType={handleSortCallType} onSortParentType={handleSortParentType} canView={canView} canUpdate={canUpdate} canDelete={canDelete} selectedRow={selectedRow} onRowClick={(act, idx) => {setSelectedRow(act); setSelectedIndex(idx)}} onRowDoubleClick={(act) => navigate(`/activities/${act.id}`)} />}
              {activeType === "MEETING" && <MeetingTable data={meetingActivites} onEdit={openEditModal} onDelete={handleDelete} onToggleCompleted={handleToggleCompleted} onTogglePriority={handleTogglePriority} onSortParentType={handleSortParentType} canView={canView} canUpdate={canUpdate} canDelete={canDelete} selectedRow={selectedRow} onRowClick={(act, idx) => {setSelectedRow(act); setSelectedIndex(idx)}} onRowDoubleClick={(act) => navigate(`/activities/${act.id}`)} />}
              {activeType === "NOTE" && <NoteTable data={noteActivites} onEdit={openEditModal} onDelete={handleDelete} onToggleCompleted={handleToggleCompleted} onTogglePriority={handleTogglePriority} onSortParentType={handleSortParentType} canView={canView} canUpdate={canUpdate} canDelete={canDelete} selectedRow={selectedRow} onRowClick={(act, idx) => {setSelectedRow(act); setSelectedIndex(idx)}} onRowDoubleClick={(act) => navigate(`/activities/${act.id}`)} />}
              {activeType === "EMAIL_QUOTE" && <EmailTable data={emailQuoteActivites} onEdit={openEditModal} onDelete={handleDelete} onToggleCompleted={handleToggleCompleted} onTogglePriority={handleTogglePriority} onSortParentType={handleSortParentType} labelSubject="Chủ đề Báo giá" canView={canView} canUpdate={canUpdate} canDelete={canDelete} selectedRow={selectedRow} onRowClick={(act, idx) => {setSelectedRow(act); setSelectedIndex(idx)}} onRowDoubleClick={(act) => navigate(`/activities/${act.id}`)} />}
              {activeType === "EMAIL_TRANSACTION" && <EmailTable data={emailTransactionActivites} onEdit={openEditModal} onDelete={handleDelete} onToggleCompleted={handleToggleCompleted} onTogglePriority={handleTogglePriority} onSortParentType={handleSortParentType} labelSubject="Chủ đề Giao dịch" canView={canView} canUpdate={canUpdate} canDelete={canDelete} selectedRow={selectedRow} onRowClick={(act, idx) => {setSelectedRow(act); setSelectedIndex(idx)}} onRowDoubleClick={(act) => navigate(`/activities/${act.id}`)} />}
            </>
          )}
        </div>

        <div className="px-6 py-3 bg-slate-50 flex items-center justify-between border-t border-slate-100 shrink-0 z-10 relative">
          <div className="flex items-center gap-3">
            <p className="text-xs text-slate-500 font-medium">
              Hiển thị <span className="font-bold text-slate-800">{activeType === "CALL" ? callActivites.length : activeType === "MEETING" ? meetingActivites.length : activeType === "NOTE" ? noteActivites.length : activeType === "EMAIL_QUOTE" ? emailQuoteActivites.length : emailTransactionActivites.length}</span> / <span className="font-bold text-slate-800">{totalElements}</span> hoạt động
            </p>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none font-semibold text-slate-700 cursor-pointer hover:border-slate-300">
              <option value={10}>10 / trang</option><option value={50}>50 / trang</option><option value={100}>100 / trang</option><option value={250}>250 / trang</option>
            </select>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1 || isLoading} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 outline-none transition-colors"><ChevronLeft size={16} /></button>
              {getVisiblePages(currentPage, totalPages).map((p, idx) => p === "..." ? (<span key={`ell-${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs font-bold select-none">...</span>) : (<button key={`page-${p}`} onClick={() => setCurrentPage(p)} disabled={isLoading} className={`w-8 h-8 rounded-lg text-xs font-bold outline-none transition-all ${currentPage === p ? "bg-primary text-white border-primary shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{p}</button>))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages || isLoading} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 outline-none transition-colors"><ChevronRight size={16} /></button>
            </div>
          )}
        </div>
      </div>

      <ActivityFilter isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} filters={filters} onFilterChange={handleFilterChange} clearFilters={handleClearFilters} activityTypes={activityTypes} parentTypes={parentTypes} />

      {isModalOpen && (
        <ActivityFormModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedActivity(null); }} onSave={isFilterActive() ? fetchAdvanceSearch : fetchActivities} initialData={selectedActivity} />
      )}
    </div>
  );
};

export default ActivityList;