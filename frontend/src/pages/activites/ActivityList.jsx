import React, { useState, useEffect } from "react";
import api from "../../lib/api";
import {
  Eye,
  Edit,
  Trash2,
  PlusCircle as Plus,
  Search,
  ListFilter,
  ChevronsUpDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import ActivityFormModal from "../../components/activity/ActivityFormModal";
import Pagination from "../../components/Pagination";
import {
  MOCK_USERS_DATA,
  MOCK_LEADS_DATA,
  MOCK_CUSTOMERS_DATA,
  MOCK_OPPORTUNITIES_DATA,
  getNameById,
  getRelatedName,
} from "../../mockdata/mockdata.jsx";
import ActivityFilter from "../../components/activity/ActivityFilter.jsx";
// Helper: Format date
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const ActivityList = () => {
  // 1. Dữ liệu từng loại
  const [callActivites, setCallActivities] = useState([]);
  const [meetingActivites, setMeetingActivities] = useState([]);
  const [noteActivites, setNoteActivities] = useState([]);
  const [emailQuoteActivites, setEmailQuoteActivities] = useState([]);
  const [emailTransactionActivites, setEmailTransactionActivities] = useState(
    [],
  );

  // 2. Trạng thái chung
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState("CALL");
  const [isFillterActive, setFilterActive] = useState(false);
  // 3. Trạng thái Bộ lọc
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
  // 4. Trạng thái Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  //5.Phân trang
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 200; // Số bản ghi trên mỗi trang
  const [totalCallPages, setCallTotalPages] = useState(0);
  const [totalMeetingPages, setMeetingTotalPages] = useState(0);
  const [totalNotePages, setNoteTotalPages] = useState(0);
  const [totalEmailQuotePages, setEmailQuoteTotalPages] = useState(0);
  const [totalEmailTransactionPages, setEmailTransactionTotalPages] =useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // số phần tử tối đa
  const [totalCallElements, setTotalCallElements] = useState(0);
  const [totalMeetingElements, setTotalMeetingElements] = useState(0);
  const [totalNoteElements, setTotalNoteElements] = useState(0);
  const [totalEmailQuoteElements, setTotalEmailQuoteElements] = useState(0);
  const [totalEmailTransactionElements, setTotalEmailTransactionElements] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  // --- HÀM GỌI API ---
  const fetchActivities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const responseCall = await api.get("/activities/activity-type/CALL", {
        params: {
          page: currentPage,
          size: pageSize,
        },
      });

      setCallActivities(responseCall.data.data);
      setCallTotalPages(responseCall.data.totalPages);
      setTotalPages(responseCall.data.totalPages);
      setTotalElements(responseCall.data.totalElements);
      setTotalCallElements(responseCall.data.totalElements);
      console.log("Total elements:", responseCall.data.totalElements);
      const responseMeeting = await api.get(
        "/activities/activity-type/MEETING",
        {
          params: {
            page: currentPage,
            size: pageSize,
          },
        },
      );
      setMeetingActivities(responseMeeting.data.data);
      setMeetingTotalPages(responseMeeting.data.totalPages);
      setTotalMeetingElements(responseMeeting.data.totalElements);
      const responseNote = await api.get("/activities/activity-type/NOTE", {
        params: {
          page: currentPage,
          size: pageSize,
        },
      });
      setNoteActivities(responseNote.data.data);
      setNoteTotalPages(responseNote.data.totalPages);
      setTotalNoteElements(responseNote.data.totalElements);
      const responseEmailQuote = await api.get(
        "/activities/activity-type/EMAIL_QUOTE",
        {
          params: {
            page: currentPage,
            size: pageSize,
          },
        },
      );
      setEmailQuoteActivities(responseEmailQuote.data.data);
      setEmailQuoteTotalPages(responseEmailQuote.data.totalPages);
      setTotalEmailQuoteElements(responseEmailQuote.data.totalElements);
      const responseEmailTrans = await api.get(
        "/activities/activity-type/EMAIL_TRANSACTION",
        {
          params: {
            page: currentPage,
            size: pageSize,
          },
        },
      );
      setEmailTransactionActivities(responseEmailTrans.data.data);
      setEmailTransactionTotalPages(responseEmailTrans.data.totalPages);
      setTotalEmailTransactionElements(responseEmailTrans.data.totalElements);
    } catch (err) {
      console.error("Lỗi khi fetch activities:", err);
      setError(err.message || "Failed to fetch activities");
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
      else if (activity.activityType === "MEETING")
        setMeetingActivities([activity]);
      else if (activity.activityType === "NOTE") setNoteActivities([activity]);
      else if (activity.activityType === "EMAIL_QUOTE")
        setEmailQuoteActivities([activity]);
      else if (activity.activityType === "EMAIL_TRANSACTION")
        setEmailTransactionActivities([activity]);

      setActiveType(activity.activityType);
      setTotalPages(1);
    } catch (err) {
      console.error("Lỗi khi fetch activity:", err);
      setError("Không tìm thấy hoạt động với ID này");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchActivitiesByCallType = async (callType) => {
    setIsLoading(true);
    setError(null);
    try {
      if (callType == "") {
        fetchActivities();
        return;
      }
      const response = await api.get(
        `activities/activity-type/callType/${callType}`,
      );
      setCallActivities(response.data.data);
    } catch (err) {
      console.error("Lỗi khi fetch activities theo callType:", err);
      setError(err.message || "Failed to fetch activities by call type");
    } finally {
      setIsLoading(false);
    }
  };
const fetchAdvanceSearch = async () => {
  setIsLoading(true);
  setError(null);
  try {
    //Nếu chọn đủ cả 2 (Tất cả) hoặc không chọn gì -> Trả về null
    const cleanToggle = (arr, totalOptions) => {
      if (!arr || arr.length === 0 || arr.length === totalOptions) return null;
      return arr[0]; // Trả về giá trị đơn (true/false hoặc Enum string)
    };

    //Lấy giá trị activityType duy nhất (vì state của mình là mảng [ID])
    const selectedType = filters.activityTypes.length > 0 ? filters.activityTypes[0] : null;

    //Chuẩn bị Params để gửi lên Backend
    const apiParams = {
      page: currentPage,
      size: pageSize,
      activityType: selectedType, // Backend nhận đơn
      parentTypes: filters.parentTypes.length > 0 ? filters.parentTypes : null, // Backend nhận List
      isPriority: cleanToggle(filters.isPriority, 2),
      isCompleted: cleanToggle(filters.isCompleted, 2),
      callType: cleanToggle(filters.callTypes, 2)
    };

    //Gọi API
    const response = await api.get(`/activities/advanced-search`, {
      params: apiParams,
      // Quan trọng: Để gửi mảng ?parentTypes=LEAD&parentTypes=CUSTOMER
      paramsSerializer: {
        indexes: null 
      }
    });

    const data = response.data.data;
    
    // Cập nhật Type đang hoạt động để UI biết hiển thị bảng nào
    setActiveType(selectedType);

    // 5. Cập nhật dữ liệu vào các State tương ứng
    if (selectedType === "CALL") setCallActivities(data);
    else if (selectedType === "MEETING") setMeetingActivities(data);
    else if (selectedType === "NOTE") setNoteActivities(data);
    else if (selectedType === "EMAIL_QUOTE") setEmailQuoteActivities(data);
    else if (selectedType === "EMAIL_TRANSACTION") setEmailTransactionActivities(data);

    // Cập nhật phân trang
    setTotalElements(response.data.totalElements);
    setTotalPages(response.data.totalPages);

  } catch (err) {
    console.error("Lỗi khi fetch activities nâng cao:", err);
    setError(err.response?.data?.message || "Lỗi kết nối Server");
  } finally {
    setIsLoading(false);
  }
};
  const isFilterActive = () => {
  return Object.values(filters).some(arr => Array.isArray(arr) && arr.length > 0);
};
  // Gọi lần đầu
  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (isFilterActive()) {
      fetchAdvanceSearch();
    } else {
      fetchActivities();
    }
  }, [filters, currentPage]);

  // Logic Phím tắt
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        openCreateModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- ACTIONS ---
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
        alert("Xóa thất bại!");
      }
    }
  };
  const handlerCallType = () => {
    if (callType === "") {
      setCallType("INBOUND");
    } else if (callType === "INBOUND") {
      setCallType("OUTBOUND");
    } else {
      setCallType("");
      fetchActivities();
    }
    fetchActivitiesByCallType(callType);
  };
  const handleParentType = async () => {
    if (filterParentType === "") {
      setFilterParentType("LEAD");
    } else if (filterParentType === "LEAD") {
      setFilterParentType("CUSTOMER");
    } else if (filterParentType === "CUSTOMER") {
      setFilterParentType("OPPORTUNITY");
    } else if (filterParentType === "OPPORTUNITY") {
      setFilterParentType("");
    }
    if (filterParentType === "") {
      fetchActivities();
    } else {
      api
        .get(
          `/activities/activity-type/${activeType}/parent-type/${filterParentType}`,
        )
        .then((response) => {
          const data = response.data.data;
          if (activeType === "CALL") setCallActivities(data);
          else if (activeType === "MEETING") setMeetingActivities(data);
          else if (activeType === "NOTE") setNoteActivities(data);
          else if (activeType === "EMAIL_QUOTE") setEmailQuoteActivities(data);
          else if (activeType === "EMAIL_TRANSACTION")
            setEmailTransactionActivities(data);
        })
        .catch((err) => {
          console.error("Lỗi khi fetch activities theo parentType:", err);
          setError(err.message || "Failed to fetch activities by parent type");
        })
        .finally(() => setIsLoading(false));
    }
  };
  const handleClearFilters = () => {
  setFilters({
    activityTypes: [],
    parentTypes: [],
    isPriority: [],
    isCompleted: [],
    callTypes: []
  });
  setCurrentPage(0);
};
  // --- CHUYỂN TAB ---
  const handleActivieType = (type) => {
    setActiveType(type);
    //chuyển cho bộ lọc nâng cao cx thay đổi theo
    setFilters((prev) => ({ ...prev, activityTypes: [type] }));
    if (type === "CALL") {
      setTotalPages(totalCallPages);
      setTotalElements(totalCallElements);
    } else if (type === "MEETING") {
      setTotalPages(totalMeetingPages);
      setTotalElements(totalMeetingElements);
    } else if (type === "NOTE") {
      setTotalPages(totalNotePages);
      setTotalElements(totalNoteElements);
    } else if (type === "EMAIL_QUOTE") {
      setTotalPages(totalEmailQuotePages);
      setTotalElements(totalEmailQuoteElements);
    } else if (type === "EMAIL_TRANSACTION") {
      setTotalPages(totalEmailTransactionPages);
      setTotalElements(totalEmailTransactionElements);
    }
    setCurrentPage(0);
  };
  // --- CẬP NHẬT NHANH (TOGGLE) ---
  const handleToggleCompleted = async (activity) => {
    try {
      const updatedActivity = {
        ...activity,
        isCompleted: !activity.isCompleted,
      };
      await api.put(`/activities/${activity.id}`, updatedActivity);
      fetchActivities();
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      alert("Không thể cập nhật trạng thái!");
    }
  };

  const handleTogglePriority = async (activity) => {
    try {
      const updatedActivity = { ...activity, isPriority: !activity.isPriority };
      await api.put(`/activities/${activity.id}`, updatedActivity);
      fetchActivities();
    } catch (error) {
      console.error("Lỗi cập nhật độ ưu tiên:", error);
      alert("Không thể cập nhật độ ưu tiên!");
    }
  };

  const renderActions = (activity) => (
    <div className="flex gap-2 justify-center">
      <button
        onClick={() => openEditModal(activity)}
        className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1.5 rounded-[5px]"
        title="Sửa"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDelete(activity.id)}
        className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-[5px]"
        title="Xóa"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <Link
        to={`/activities/${activity.id}`}
        className="text-green-600 hover:text-green-900 bg-green-50 p-1.5 rounded-[5px]"
        title="Chi tiết"
      >
        <Eye className="w-4 h-4" />
      </Link>
    </div>
  );

  const renderCompletedCheckbox = (activity) => (
    <div className="flex justify-center">
      <input
        type="checkbox"
        checked={activity.isCompleted || false}
        onChange={() => handleToggleCompleted(activity)}
        className="w-4 h-4 text-blue-600 rounded-[5px] focus:ring-blue-500 cursor-pointer"
      />
    </div>
  );

  const renderPriorityCheckbox = (activity) => (
    <div className="flex justify-center">
      <input
        type="checkbox"
        checked={activity.isPriority || false}
        onChange={() => handleTogglePriority(activity)}
        className="w-4 h-4 text-amber-500 rounded-[5px] focus:ring-amber-500 cursor-pointer"
      />
    </div>
  );

  const renderRelated = (activity) => (
    <span className="text-[11px] bg-slate-100 px-2 py-1 rounded-[5px] whitespace-nowrap text-slate-600 font-medium">
      {getRelatedName(activity.parentType, activity.parentId)}
    </span>
  );

  const renderCallType = (type) => {
    if (type === "INBOUND")
      return (
        <span className="text-[11px] font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded-[5px] whitespace-nowrap">
          Gọi Đến
        </span>
      );
    if (type === "OUTBOUND")
      return (
        <span className="text-[11px] font-semibold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-[5px] whitespace-nowrap">
          Gọi Đi
        </span>
      );
    return (
      <span className="text-[11px] font-semibold px-2 py-1 bg-slate-50 text-slate-600 rounded-[5px] whitespace-nowrap">
        {type || "-"}
      </span>
    );
  };

  return (
    <div className="space-y-6 flex-1 relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
  <div>
    <h1 className="text-3xl font-headline font-extrabold text-primary tracking-tight mb-2">
      Quản lý các hoạt động chăm sóc
    </h1>
    {/* Bạn có thể thay đổi biến số lượng nếu cần giống mẫu: {totalActivities || 0} */}
    <p className="text-slate-500 font-medium mt-1">
      Quản lý và theo dõi các hoạt động chăm sóc khách hàng.
    </p>
  </div>
  <button
    onClick={openCreateModal}
    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-bold text-sm shadow-lg shadow-primary/20 outline-none transition-all"
  >
    <Plus size={18} strokeWidth={2.5} /> Tạo hoạt động (Alt + N)
  </button>
</div>

      {/* FILTERS & SEARCH */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Tìm kiếm theo ID */}
        <div className="md:col-span-2 flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm theo ID..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchActivitiesById(keyword)}
            className="w-full px-4 py-2 border border-slate-300 rounded-[5px] focus:ring-blue-500 text-[11px]"
          />
          <button
            onClick={() => fetchActivitiesById(keyword)}
            className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-[5px] transition-colors"
          >
            <Search className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Button mở sidebar bộ lọc nâng cao */}
        <button
          onClick={() => setIsAdvancedFilterOpen(true)}
          className="flex items-center justify-start gap-2 px-0 py-2 bg-transparent text-[11px] font-bold text-slate-700 hover:text-primary transition-all group"
        >
          <span className="material-symbols-outlined text-primary text-[18px] group-hover:scale-110 transition-transform">
            tune
          </span>
          <span className="hover group-hover:border-primary">Bộ lọc</span>
        </button>
        <ActivityFilter
          isOpen={isAdvancedFilterOpen}
          onClose={() => setIsAdvancedFilterOpen(false)}
          filters={filters}
          onFilterChange={(field, value) =>
            setFilters((prev) => ({ ...prev, [field]: value }))
          }
          clearFilters={handleClearFilters}
          activityTypes={activityTypes}
          parentTypes={parentTypes}
        />
      </div>

      {/* TABS */}
      <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
        {["CALL", "MEETING", "NOTE", "EMAIL_QUOTE", "EMAIL_TRANSACTION"].map(
          (type) => (
            <button
              key={type}
              onClick={() => handleActivieType(type)}
              className={`px-4 py-2 rounded-t-[5px] font-medium flex items-center gap-2 text-[11px] ${
                activeType === type
                  ? "bg-white text-blue-600 border-t border-l border-r border-slate-200"
                  : "text-gray-500 hover:bg-slate-100"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {type === "CALL" && "call"}
                {type === "MEETING" && "event"}
                {type === "NOTE" && "note"}
                {type === "EMAIL_QUOTE" && "email"}
                {type === "EMAIL_TRANSACTION" && "mail"}
              </span>
              {type.replace("_", " ")}
            </button>
          ),
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="bg-white rounded-b-[5px] shadow-sm border border-slate-200 border-t-0 flex-1 flex flex-col overflow-hidden">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-10">
            <span className="material-symbols-outlined animate-spin text-gray-400 text-[40px]">
              sync
            </span>
            <span className="ml-3 text-slate-500">Đang tải dữ liệu...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-10">{error}</div>
        ) : (
          <div className="overflow-x-auto text-[11px]">
            {activeType === "CALL" && (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-2 font-semibold text-slate-600 whitespace-nowrap">
                      ID
                    </th>
                    <th className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                      Chủ đề
                    </th>
                    <th className="p-2 font-semibold text-slate-600 whitespace-nowrap">
                      Ngày gọi
                    </th>
                    <th
                      className="p-3 font-semibold text-slate-600 text-center cursor-pointer hover:bg-slate-200 transition whitespace-nowrap"
                      onClick={handlerCallType}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Loại
                        <ChevronsUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                      Kết quả
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Quan trọng
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Đã hoàn thành
                    </th>
                    <th
                      className="p-3 font-semibold text-slate-600 cursor-pointer hover:bg-slate-200 transition whitespace-nowrap"
                      onClick={handleParentType}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Liên quan
                        <ChevronsUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="p-2 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Người tạo
                    </th>
                    <th className="p-2 font-semibold text-slate-600 text-center whitespace-nowrap">
                      TaskId
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {callActivites.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50">
                      <td className="p-2 text-slate-500 whitespace-nowrap">
                        <span className="font-mono bg-slate-100 px-2 py-1 rounded-[5px]">
                          #{act.id}
                        </span>
                      </td>
                      <td
                        className="p-3 font-medium text-slate-800 truncate max-w-[150px] whitespace-nowrap"
                        title={act.subject}
                      >
                        {act.subject}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {formatDate(act.activityDate)}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {renderCallType(act.callType)}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {act.callResult || "-"}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderPriorityCheckbox(act)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderCompletedCheckbox(act)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderRelated(act)}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {getNameById(act.createdBy, MOCK_USERS_DATA)}
                      </td>
                      <td className="p-2 text-center whitespace-nowrap">
                        {act.taskId || "-"}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderActions(act)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* ========================================== */}
            {/* BẢNG 2: MEETING */}
            {/* ========================================== */}
            {activeType === "MEETING" && (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                      ID
                    </th>
                    <th className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                      Chủ đề
                    </th>
                    <th className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                      Ngày bắt đầu
                    </th>
                    <th className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                      Ngày kết thúc
                    </th>
                    <th className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                      Địa điểm
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Quan trọng
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Đã hoàn thành
                    </th>
                    <th
                      className="p-3 font-semibold text-slate-600 cursor-pointer hover:bg-slate-200 transition whitespace-nowrap"
                      onClick={handleParentType}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Liên quan
                        <ChevronsUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      TaskId
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Người tạo
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {meetingActivites.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        <span className="font-mono bg-slate-100 px-2 py-1 rounded-[5px]">
                          #{act.id}
                        </span>
                      </td>
                      <td
                        className="p-3 font-medium text-slate-800 truncate max-w-[150px] whitespace-nowrap"
                        title={act.subject}
                      >
                        {act.subject}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {formatDate(act.startDate || act.activityDate)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {formatDate(act.endDate)}
                      </td>
                      <td
                        className="p-3 truncate max-w-[120px] whitespace-nowrap"
                        title={act.location}
                      >
                        {act.location || "-"}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderPriorityCheckbox(act)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderCompletedCheckbox(act)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderRelated(act)}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {act.taskId || "-"}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {getNameById(act.createdBy, MOCK_USERS_DATA)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderActions(act)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* ========================================== */}
            {/* BẢNG 3: NOTE */}
            {/* ========================================== */}
            {activeType === "NOTE" && (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                      ID
                    </th>
                    <th className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                      Chủ đề
                    </th>
                    <th className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                      Ngày ghi chú
                    </th>
                    <th className="p-3 font-semibold text-slate-600 w-1/3 whitespace-nowrap">
                      Nội dung (Mô tả)
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Quan trọng
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Đã hoàn thành
                    </th>
                    <th
                      className="p-3 font-semibold text-slate-600 cursor-pointer hover:bg-slate-200 transition whitespace-nowrap"
                      onClick={handleParentType}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Liên quan
                        <ChevronsUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Người tạo
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      TaskId
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {noteActivites.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        <span className="font-mono bg-slate-100 px-2 py-1 rounded-[5px]">
                          #{act.id}
                        </span>
                      </td>
                      <td
                        className="p-3 font-medium text-slate-800 truncate max-w-[150px] whitespace-nowrap"
                        title={act.subject}
                      >
                        {act.subject}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {formatDate(act.activityDate)}
                      </td>
                      <td className="p-3 whitespace-pre-wrap whitespace-nowrap">
                        {act.description}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderPriorityCheckbox(act)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderCompletedCheckbox(act)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderRelated(act)}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {getNameById(act.createdBy, MOCK_USERS_DATA)}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {act.taskId || "-"}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderActions(act)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* ========================================== */}
            {/* BẢNG 4: EMAIL QUOTE */}
            {/* ========================================== */}
            {activeType === "EMAIL_QUOTE" && (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                      ID
                    </th>
                    <th className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                      Chủ đề Email
                    </th>
                    <th className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                      Ngày gửi
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Quan trọng
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Đã hoàn thành
                    </th>
                    <th
                      className="p-3 font-semibold text-slate-600 cursor-pointer hover:bg-slate-200 transition whitespace-nowrap"
                      onClick={handleParentType}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Liên quan
                        <ChevronsUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Người tạo
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      TaskId
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {emailQuoteActivites.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        <span className="font-mono bg-slate-100 px-2 py-1 rounded-[5px]">
                          #{act.id}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-800 truncate max-w-[150px] whitespace-nowrap">
                        {act.subject}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {formatDate(act.activityDate)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderPriorityCheckbox(act)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderCompletedCheckbox(act)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderRelated(act)}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {getNameById(act.createdBy, MOCK_USERS_DATA)}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {act.taskId || "-"}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderActions(act)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* ========================================== */}
            {/* BẢNG 5: EMAIL TRANSACTION */}
            {/* ========================================== */}
            {activeType === "EMAIL_TRANSACTION" && (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                      ID
                    </th>
                    <th className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                      Chủ đề Email
                    </th>
                    <th className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                      Ngày gửi
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Quan trọng
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Đã hoàn thành
                    </th>
                    <th
                      className="p-3 font-semibold text-slate-600 cursor-pointer hover:bg-slate-200 transition whitespace-nowrap"
                      onClick={handleParentType}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Liên quan
                        <ChevronsUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Người tạo
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      TaskId
                    </th>
                    <th className="p-3 font-semibold text-slate-600 text-center whitespace-nowrap">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {emailTransactionActivites.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        <span className="font-mono bg-slate-100 px-2 py-1 rounded-[5px]">
                          #{act.id}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-800 truncate max-w-[150px] whitespace-nowrap">
                        {act.subject}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {formatDate(act.activityDate)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderPriorityCheckbox(act)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderCompletedCheckbox(act)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderRelated(act)}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {getNameById(act.createdBy, MOCK_USERS_DATA)}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {act.taskId || "-"}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {renderActions(act)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          onChangePage={(currentPage) => {
            setCurrentPage(currentPage);
          }}
        />
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <ActivityFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedActivity(null);
          }}
          onSave={fetchActivities}
          initialData={selectedActivity}
        />
      )}
    </div>
  );
};

export default ActivityList;
