import React, { useState, useEffect } from "react";
import axios from "axios";
import LeadFormModal from "./LeadFormModal";

const LeadPage = () => {
  const [leads, setLeads] = useState([]);
  // Bổ sung state lưu danh mục để bộ lọc chạy được
  const [sources, setSources] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const [filters, setFilters] = useState({
    keyword: "",
    statusId: "",
    sourceId: "",
    campaignId: "",
    provinceId: "",
    branchId: "",
    assignedTo: "",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Gọi đồng thời cả danh sách Lead và các danh mục cho bộ lọc
      const [leadRes, srcRes, camRes] = await Promise.all([
        axios.get("http://localhost:8080/api/v1/leads"),
        axios.get("http://localhost:8080/api/v1/sources"),
        axios.get("http://localhost:8080/api/v1/campaigns"),
      ]);
      setLeads(leadRes.data);
      setSources(srcRes.data);
      setCampaigns(camRes.data);
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

  const handleOpenAdd = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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
  };

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

  const totalCalls = filteredLeads.reduce(
    (sum, lead) => sum + (lead.totalCalls || 0),
    0,
  );
  const totalMeetings = filteredLeads.reduce(
    (sum, lead) => sum + (lead.totalMeetings || 0),
    0,
  );
  const totalEmails = filteredLeads.reduce(
    (sum, lead) => sum + (lead.totalEmails || 0),
    0,
  );

  const formatCurrency = (amount) => {
    if (!amount) return "Chưa cập nhật";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getInitials = (fullName) => {
    if (!fullName) return "KH";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getStatusStyle = (statusName) => {
    switch (statusName) {
      case "Mới":
        return "bg-slate-100 text-slate-700";
      case "Đang liên hệ":
        return "bg-blue-100 text-blue-700";
      case "Đã chuyển đổi":
        return "bg-green-100 text-green-700";
      default:
        return "bg-surface-container-high text-on-surface-variant";
    }
  };

  const getStatusDotColor = (statusName) => {
    switch (statusName) {
      case "Mới":
        return "bg-slate-500";
      case "Đang liên hệ":
        return "bg-blue-600";
      case "Đã chuyển đổi":
        return "bg-green-600";
      default:
        return "bg-outline";
    }
  };

  return (
    <div className="space-y-8 flex-1 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">
            Khách hàng tiềm năng
          </h2>
          <p className="text-on-surface-variant mt-1">
            Quản lý và theo dõi các cơ hội kinh doanh mới trong hệ thống.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-gradient-to-br from-[#000666] to-[#1A237E] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          <span>Thêm Lead mới</span>
        </button>
      </div>

      <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5 lg:col-span-2">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
              Tìm kiếm
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
                search
              </span>
              <input
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
                className="w-full bg-surface-container-lowest border-none rounded-lg text-sm pl-9 pr-4 py-2.5 focus:ring-1 focus:ring-primary/20"
                placeholder="Tên, Email, SĐT, Tên công ty..."
                type="text"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
              Trạng thái
            </label>
            <select
              name="statusId"
              value={filters.statusId}
              onChange={handleFilterChange}
              className="w-full bg-surface-container-lowest border-none rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary/20"
            >
              <option value="">Tất cả Trạng thái</option>
              <option value="1">Mới</option>
              <option value="2">Đang liên hệ</option>
              <option value="3">Tiềm năng</option>
              <option value="4">Đã chuyển đổi</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex-1 bg-surface-container-high text-primary font-semibold py-2.5 rounded-lg hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              {showAdvanced ? "Thu gọn" : "Nâng cao"}
            </button>
            {(filters.keyword ||
              filters.statusId ||
              filters.sourceId ||
              filters.campaignId ||
              filters.provinceId ||
              filters.branchId ||
              filters.assignedTo) && (
              <button
                onClick={clearFilters}
                className="px-3 bg-error/10 text-error font-semibold py-2.5 rounded-lg hover:bg-error/20 transition-colors flex items-center justify-center"
                title="Xóa bộ lọc"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-surface-variant/50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
                Người phụ trách
              </label>
              <select
                name="assignedTo"
                value={filters.assignedTo}
                onChange={handleFilterChange}
                className="w-full bg-surface-container-lowest border-none rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary/20"
              >
                <option value="">Tất cả</option>
                <option value="1">Nguyễn Văn A</option>
                <option value="2">Lê Thu Hà</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
                Nguồn khách
              </label>
              <select
                name="sourceId"
                value={filters.sourceId}
                onChange={handleFilterChange}
                className="w-full bg-surface-container-lowest border-none rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary/20"
              >
                <option value="">Tất cả</option>
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
                Chiến dịch
              </label>
              <select
                name="campaignId"
                value={filters.campaignId}
                onChange={handleFilterChange}
                className="w-full bg-surface-container-lowest border-none rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary/20"
              >
                <option value="">Tất cả</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
                Chi nhánh
              </label>
              <select
                name="branchId"
                value={filters.branchId}
                onChange={handleFilterChange}
                className="w-full bg-surface-container-lowest border-none rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary/20"
              >
                <option value="">Tất cả</option>
                <option value="1">Trụ sở chính</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
                Tỉnh thành
              </label>
              <select
                name="provinceId"
                value={filters.provinceId}
                onChange={handleFilterChange}
                className="w-full bg-surface-container-lowest border-none rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary/20"
              >
                <option value="">Tất cả</option>
                <option value="1">Hà Nội</option>
                <option value="2">TP. Hồ Chí Minh</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Tổng số cuộc gọi
            </p>
            <h3 className="text-3xl font-headline font-extrabold text-primary mt-1">
              {totalCalls}
            </h3>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">
                trending_up
              </span>{" "}
              Dựa trên kết quả lọc
            </p>
          </div>
          <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">call</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-secondary-container shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Gặp mặt trực tiếp
            </p>
            <h3 className="text-3xl font-headline font-extrabold text-primary mt-1">
              {totalMeetings}
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">
                schedule
              </span>{" "}
              Lịch hẹn đã hoàn tất
            </p>
          </div>
          <div className="w-12 h-12 bg-secondary-container/10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary">
              groups
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-on-primary-container shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Tổng Email gửi
            </p>
            <h3 className="text-3xl font-headline font-extrabold text-primary mt-1">
              {totalEmails}
            </h3>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">bolt</span>{" "}
              Chiến dịch tiếp thị
            </p>
          </div>
          <div className="w-12 h-12 bg-on-primary-container/10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container">
              mail
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
                  Tên liên hệ
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
                  Loại hình KD
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
                  Thông tin liên lạc
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
                  Doanh thu dự kiến
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
                  Mã số/Nguồn
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap text-center">
                  Trạng thái
                </th>
                {/* Ghim tiêu đề cột thao tác */}
                <th className="sticky right-0 z-20 bg-surface-container-low px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap text-center shadow-[-8px_0_10px_-4px_rgba(0,0,0,0.05)]">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-surface-variant/30">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-on-surface-variant"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">
                      search_off
                    </span>
                    Không tìm thấy khách hàng nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-surface-container-low transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {getInitials(lead.fullName)}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface text-sm">
                            {lead.fullName}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            {lead.companyName || "Khách cá nhân"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {lead.companyName ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold">
                          Tổ chức
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-teal-50 border border-teal-100 text-teal-700 text-[10px] font-bold">
                          Cá nhân
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-on-surface">
                          <span className="material-symbols-outlined text-[14px]">
                            call
                          </span>{" "}
                          {lead.phone || "Chưa có SĐT"}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                          <span className="material-symbols-outlined text-[14px]">
                            mail
                          </span>{" "}
                          {lead.email || "Chưa có email"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p
                        className={`text-xs font-bold ${lead.expectedRevenue ? "text-primary" : "text-on-surface-variant"}`}
                      >
                        {formatCurrency(lead.expectedRevenue)}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-[10px] font-medium text-on-surface">
                          MST: {lead.taxCode || "---"}
                        </p>
                        <p className="text-[10px] text-on-surface-variant">
                          Nguồn: {lead.sourceName || "Tự nhiên"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(lead.statusName)}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(lead.statusName)}`}
                        ></span>
                        {lead.statusName || "Chưa rõ"}
                      </span>
                    </td>
                    {/* Ghim cột thao tác bám lề phải */}
                    <td className="sticky right-0 z-10 bg-surface-container-lowest group-hover:bg-surface-container-low transition-colors px-6 py-5 shadow-[-8px_0_10px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-1.5 hover:bg-surface-container-high rounded-md text-on-surface-variant"
                          title="Xem chi tiết"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            visibility
                          </span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(lead)}
                          className="p-1.5 hover:bg-primary/5 rounded-md text-primary"
                          title="Chỉnh sửa"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            edit
                          </span>
                        </button>
                        <button
                          className="p-1.5 hover:bg-error/5 rounded-md text-error"
                          title="Xóa"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-surface-container-low/30 flex items-center justify-between border-t border-surface-variant/30">
          <p className="text-xs text-on-surface-variant">
            Hiển thị {filteredLeads.length} trên tổng số {leads.length} khách
            hàng
          </p>
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30"
              disabled={true}
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold">
              1
            </button>
            <button className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

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
