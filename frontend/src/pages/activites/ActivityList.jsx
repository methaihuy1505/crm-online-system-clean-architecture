import React, { useState, useEffect } from "react";
import api from "../../lib/api";
import { PlusCircle as Plus, Search } from "lucide-react";
import ActivityFormModal from "./components/ActivityFormModal";
import Pagination from "../../components/Pagination";
import ActivityFilter from "./components/ActivityFilter.jsx";

import { CallTable } from "./components/tables/CallTable";
import { MeetingTable } from "./components/tables/MeetingTable";
import { NoteTable } from "./components/tables/NoteTable";
import { EmailTable } from "./components/tables/EmailTable";

const ActivityList = () => {
  const [callActivites, setCallActivities] = useState([]);
  const [meetingActivites, setMeetingActivities] = useState([]);
  const [noteActivites, setNoteActivities] = useState([]);
  const [emailQuoteActivites, setEmailQuoteActivities] = useState([]);
  const [emailTransactionActivites, setEmailTransactionActivities] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState("CALL");
  const [keyword, setKeyword] = useState("");
  const [filterParentType, setFilterParentType] = useState("");
  const [callType, setCallType] = useState("");
  
  const [filters, setFilters] = useState({
    activityTypes: [],  
    parentTypes: [], 
    isPriority: [],
    isCompleted: [],  
    callTypes: [] 
  });

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 200; 
  
  const [totalCallPages, setCallTotalPages] = useState(0);
  const [totalMeetingPages, setMeetingTotalPages] = useState(0);
  const [totalNotePages, setNoteTotalPages] = useState(0);
  const [totalEmailQuotePages, setEmailQuoteTotalPages] = useState(0);
  const [totalEmailTransactionPages, setEmailTransactionTotalPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [totalCallElements, setTotalCallElements] = useState(0);
  const [totalMeetingElements, setTotalMeetingElements] = useState(0);
  const [totalNoteElements, setTotalNoteElements] = useState(0);
  const [totalEmailQuoteElements, setTotalEmailQuoteElements] = useState(0);
  const [totalEmailTransactionElements, setTotalEmailTransactionElements] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchActivities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const responseCall = await api.get("/activities/activity-type/CALL", { params: { page: currentPage, size: pageSize } });
      setCallActivities(responseCall.data.data);
      setCallTotalPages(responseCall.data.totalPages);
      setTotalCallElements(responseCall.data.totalElements);
      
      if (activeType === "CALL") {
        setTotalPages(responseCall.data.totalPages);
        setTotalElements(responseCall.data.totalElements);
      }

      const responseMeeting = await api.get("/activities/activity-type/MEETING", { params: { page: currentPage, size: pageSize } });
      setMeetingActivities(responseMeeting.data.data);
      setMeetingTotalPages(responseMeeting.data.totalPages);
      setTotalMeetingElements(responseMeeting.data.totalElements);

      const responseNote = await api.get("/activities/activity-type/NOTE", { params: { page: currentPage, size: pageSize } });
      setNoteActivities(responseNote.data.data);
      setNoteTotalPages(responseNote.data.totalPages);
      setTotalNoteElements(responseNote.data.totalElements);

      const responseEmailQuote = await api.get("/activities/activity-type/EMAIL_QUOTE", { params: { page: currentPage, size: pageSize } });
      setEmailQuoteActivities(responseEmailQuote.data.data);
      setEmailQuoteTotalPages(responseEmailQuote.data.totalPages);
      setTotalEmailQuoteElements(responseEmailQuote.data.totalElements);

      const responseEmailTrans = await api.get("/activities/activity-type/EMAIL_TRANSACTION", { params: { page: currentPage, size: pageSize } });
      setEmailTransactionActivities(responseEmailTrans.data.data);
      setEmailTransactionTotalPages(responseEmailTrans.data.totalPages);
      setTotalEmailTransactionElements(responseEmailTrans.data.totalElements);

    } catch (err) {
      console.error("Lỗi tải data hoạt động thật:", err);
      setError("Không thể tải danh sách hoạt động.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivitiesById = async (id) => {
    if (!id || id.trim() === "") {
      fetchActivities();
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/activities/${id}`);
      const activity = response.data;

      if (activity.activityType === "CALL") setCallActivities([activity]);
      else if (activity.activityType === "MEETING") setMeetingActivities([activity]);
      else if (activity.activityType === "NOTE") setNoteActivities([activity]);
      else if (activity.activityType === "EMAIL_QUOTE") setEmailQuoteActivities([activity]);
      else if (activity.activityType === "EMAIL_TRANSACTION") setEmailTransactionActivities([activity]);

      setActiveType(activity.activityType);
      setTotalPages(1);
      setTotalElements(1);
    } catch (err) {
      setError("Không tìm thấy nhật ký hoạt động với ID này.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivitiesByCallType = async (selectedCallType) => {
    setIsLoading(true);
    setError(null);
    try {
      if (selectedCallType === "") {
        fetchActivities();
        return;
      }
      const response = await api.get(`/activities/activity-type/callType/${selectedCallType}`);
      setCallActivities(response.data.data);
      setTotalPages(1);
    } catch (err) {
      setError("Lỗi lọc nhanh hướng cuộc gọi.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdvanceSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const cleanToggle = (arr, totalOptions) => {
        if (!arr || arr.length === 0 || arr.length === totalOptions) return null;
        return arr[0];
      };

      const selectedType = filters.activityTypes.length > 0 ? filters.activityTypes[0] : null;

      const apiParams = {
        page: currentPage,
        size: pageSize,
        activityType: selectedType, 
        parentTypes: filters.parentTypes.length > 0 ? filters.parentTypes : null, 
        isPriority: cleanToggle(filters.isPriority, 2),
        isCompleted: cleanToggle(filters.isCompleted, 2),
        callType: cleanToggle(filters.callTypes, 2)
      };

      const response = await api.get(`/activities/advanced-search`, {
        params: apiParams,
        paramsSerializer: { indexes: null }
      });

      const data = response.data.data;
      if (selectedType) setActiveType(selectedType);

      if (activeType === "CALL") setCallActivities(data);
      else if (activeType === "MEETING") setMeetingActivities(data);
      else if (activeType === "NOTE") setNoteActivities(data);
      else if (activeType === "EMAIL_QUOTE") setEmailQuoteActivities(data);
      else if (activeType === "EMAIL_TRANSACTION") setEmailTransactionActivities(data);

      setTotalElements(response.data.totalElements);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Lỗi kết nối bộ lọc nâng cao");
    } finally {
      setIsLoading(false);
    }
  };

  const isFilterActive = () => {
    return Object.values(filters).some(arr => Array.isArray(arr) && arr.length > 0);
  };

  useEffect(() => {
    if (isFilterActive()) fetchAdvanceSearch(); else fetchActivities();
  }, [filters, currentPage]);

  const openCreateModal = () => {
    setSelectedActivity(null);
    setIsModalOpen(true);
  };

  const openEditModal = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhật ký hoạt động này?")) {
      try {
        await api.delete(`/activities/${id}`);
        fetchActivities();
      } catch (err) {
        alert("Xóa nhật ký hoạt động thất bại!");
      }
    }
  };

  const handlerCallType = () => {
    let nextType = "";
    if (callType === "") nextType = "INBOUND";
    else if (callType === "INBOUND") nextType = "OUTBOUND";
    setCallType(nextType);
    fetchActivitiesByCallType(nextType);
  };

  const handleParentType = async () => {
    let nextParentType = "";
    if (filterParentType === "") nextParentType = "LEAD";
    else if (filterParentType === "LEAD") nextParentType = "CUSTOMER";
    else if (filterParentType === "CUSTOMER") nextParentType = "OPPORTUNITY";
    setFilterParentType(nextParentType);

    if (nextParentType === "") {
      fetchActivities();
    } else {
      setIsLoading(true);
      api.get(`/activities/activity-type/${activeType}/parent-type/${nextParentType}`)
        .then((response) => {
          const data = response.data.data;
          if (activeType === "CALL") setCallActivities(data);
          else if (activeType === "MEETING") setMeetingActivities(data);
          else if (activeType === "NOTE") setNoteActivities(data);
          else if (activeType === "EMAIL_QUOTE") setEmailQuoteActivities(data);
          else if (activeType === "EMAIL_TRANSACTION") setEmailTransactionActivities(data);
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  };

  const handleClearFilters = () => {
    setFilters({ activityTypes: [], parentTypes: [], isPriority: [], isCompleted: [], callTypes: [] });
    setCallType(""); setFilterParentType(""); setKeyword(""); setCurrentPage(0);
  };

  const handleActivieType = (type) => {
    setActiveType(type);
    setFilters((prev) => ({ ...prev, activityTypes: [type] }));
    if (type === "CALL") { setTotalPages(totalCallPages); setTotalElements(totalCallElements); }
    else if (type === "MEETING") { setTotalPages(totalMeetingPages); setTotalElements(totalMeetingElements); }
    else if (type === "NOTE") { setTotalPages(totalNotePages); setTotalElements(totalNoteElements); }
    else if (type === "EMAIL_QUOTE") { setTotalPages(totalEmailQuotePages); setTotalElements(totalEmailQuoteElements); }
    else if (type === "EMAIL_TRANSACTION") { setTotalPages(totalEmailTransactionPages); setTotalElements(totalEmailTransactionElements); }
    setCurrentPage(0);
  };

  const handleToggleCompleted = async (activity) => {
    try {
      const updatedActivity = { ...activity, isCompleted: !activity.isCompleted };
      await api.put(`/activities/${activity.id}`, updatedActivity);
      if (isFilterActive()) fetchAdvanceSearch(); else fetchActivities();
    } catch (error) {
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  const handleTogglePriority = async (activity) => {
    try {
      const updatedActivity = { ...activity, isPriority: !activity.isPriority };
      await api.put(`/activities/${activity.id}`, updatedActivity);
      if (isFilterActive()) fetchAdvanceSearch(); else fetchActivities();
    } catch (error) {
      alert("Cập nhật độ ưu tiên thất bại!");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        openCreateModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="p-6 bg-[#F9FAFB] min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Quản lý các hoạt động chăm sóc</h1>
        <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-[5px] font-semibold flex items-center gap-2 text-[11px]">
          Tạo hoạt động (Alt + N)
        </button>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-2 flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm theo ID hoạt động..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchActivitiesById(keyword)}
            className="w-full px-4 py-2 border border-slate-300 rounded-[5px] text-[11px]"
          />
          <button onClick={() => fetchActivitiesById(keyword)} className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-[5px]">
            <Search className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <button onClick={() => setIsAdvancedFilterOpen(true)} className="flex items-center gap-2 text-[11px] font-bold text-slate-700 hover:text-primary group">
          <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
          <span>Bộ lọc nâng cao</span>
        </button>
        
        <ActivityFilter
          isOpen={isAdvancedFilterOpen} onClose={() => setIsAdvancedFilterOpen(false)}
          filters={filters} onFilterChange={(field, value) => setFilters((prev) => ({ ...prev, [field]: value }))}
          clearFilters={handleClearFilters} activityTypes={activityTypes} parentTypes={parentTypes}
        />
      </div>

      <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
        {["CALL", "MEETING", "NOTE", "EMAIL_QUOTE", "EMAIL_TRANSACTION"].map((type) => (
          <button
            key={type} onClick={() => handleActivieType(type)}
            className={`px-4 py-2 rounded-t-[5px] font-medium flex items-center gap-2 text-[11px] transition-all ${
              activeType === type ? "bg-white text-blue-600 border-t border-l border-r border-slate-200" : "text-gray-500 hover:bg-slate-100"
            }`}
          >
            {type.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-b-[5px] shadow-sm border border-slate-200 border-t-0 flex-1 flex flex-col overflow-hidden">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-10">
            Đang tải dữ liệu hoạt động
            </div>
        ) : error ? (
          <div className="text-red-500 text-center p-10 font-semibold">{error}</div>
        ) : (
          <div className="overflow-x-auto text-[11px]">
            {activeType === "CALL" && <CallTable data={callActivites} onEdit={openEditModal} onDelete={handleDelete} onToggleCompleted={handleToggleCompleted} onTogglePriority={handleTogglePriority} onSortCallType={handlerCallType} onSortParentType={handleParentType} />}
            {activeType === "MEETING" && <MeetingTable data={meetingActivites} onEdit={openEditModal} onDelete={handleDelete} onToggleCompleted={handleToggleCompleted} onTogglePriority={handleTogglePriority} onSortParentType={handleParentType} />}
            {activeType === "NOTE" && <NoteTable data={noteActivites} onEdit={openEditModal} onDelete={handleDelete} onToggleCompleted={handleToggleCompleted} onTogglePriority={handleTogglePriority} onSortParentType={handleParentType} />}
            {activeType === "EMAIL_QUOTE" && <EmailTable data={emailQuoteActivites} onEdit={openEditModal} onDelete={handleDelete} onToggleCompleted={handleToggleCompleted} onTogglePriority={handleTogglePriority} onSortParentType={handleParentType} labelSubject="Chủ đề Báo giá" />}
            {activeType === "EMAIL_TRANSACTION" && <EmailTable data={emailTransactionActivites} onEdit={openEditModal} onDelete={handleDelete} onToggleCompleted={handleToggleCompleted} onTogglePriority={handleTogglePriority} onSortParentType={handleParentType} labelSubject="Chủ đề Giao dịch" />}
          </div>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} totalElements={totalElements} onChangePage={(page) => setCurrentPage(page)} />
      </div>

      {isModalOpen && <ActivityFormModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedActivity(null); }} onSave={isFilterActive() ? fetchAdvanceSearch : fetchActivities} initialData={selectedActivity} />}
    </div>
  );
};

export default ActivityList;