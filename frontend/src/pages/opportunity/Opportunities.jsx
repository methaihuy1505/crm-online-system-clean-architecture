import React, { useState, useEffect } from "react";
import axios from "axios";
import OpportunityFormModal from "./OpportunityFormModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import OpportunityFilterPanel from "./OpportunityFilter";

const api = axios.create({ baseURL: "http://localhost:8080/api/v1" });

const iconStyle = {
  fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
};

const formatCompactCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return "0 đ";
  const num = Number(value);
  if (num >= 1000000000) {
    return `${(num / 1000000000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} Tỉ`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} Triệu`;
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

const mapStyles = (stage, status) => {
  const stageStyleMap = {
    Qualification: "bg-purple-50 text-purple-700 border border-purple-200/50",
    Discovery: "bg-amber-50 text-amber-700 border border-amber-200/50",
    Proposal: "bg-indigo-50 text-indigo-700 border border-indigo-200/50",
    Negotiation: "bg-blue-50 text-blue-700 border border-blue-200/50",
    Closing: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
    "Closed Won": "bg-green-50 text-green-700 border border-green-200",
  };
  const statusMap = {
    Active: {
      style: "bg-blue-50 border-blue-100",
      dot: "bg-[#0061a4]",
      text: "text-[#0061a4]",
    },
    "At Risk": {
      style: "bg-red-50 border-red-100",
      dot: "bg-[#ba1a1a]",
      text: "text-[#ba1a1a]",
    },
    "On Hold": {
      style: "bg-slate-50 border-slate-200",
      dot: "bg-slate-400",
      text: "text-slate-500",
    },
    Closed: {
      style: "bg-green-50 border-green-100",
      dot: "bg-green-600",
      text: "text-green-700",
    },
  };
  const st = statusMap[status] || statusMap["Active"];
  return {
    stageStyle:
      stageStyleMap[stage] ||
      "bg-slate-50 text-slate-600 border border-slate-200",
    statusStyle: st.style,
    statusDot: st.dot,
    statusTextStyle: st.text,
  };
};

export default function SalesOpportunities() {
  const [opps, setOpps] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [rightPanel, setRightPanel] = useState("stats");
  const [selectedOpp, setSelectedOpp] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [filters, setFilters] = useState({
    sort: "",
    stageIds: [],
    statusIds: [],
    reasonIds: [],
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1);

  // Reset về trang 1 khi filter/search thay đổi

  useEffect(() => {
    const fetchOpps = async () => {
      try {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (filters.sort) params.append("sort", filters.sort);
        filters.stageIds.forEach((id) => params.append("stageIds", id));
        filters.statusIds.forEach((id) => params.append("statusIds", id));
        filters.reasonIds.forEach((id) => params.append("reasonIds", id));
        params.append("page", page - 1); // BE thường dùng 0-based
        params.append("size", rowsPerPage);

        const res = await api.get(`/opportunities?${params.toString()}`);

        // Hỗ trợ cả 2 dạng response: array thuần hoặc Page object { content, totalElements }
        const raw = Array.isArray(res.data)
          ? res.data
          : (res.data.content ?? []);
        const total = Array.isArray(res.data)
          ? res.data.length
          : (res.data.totalElements ?? raw.length);

        setOpps(
          raw.map((item) => ({
            ...item,
            dbId: item.id,
            id: item.opportunityCode || `OPP-${item.id}`,
            customerName: item.customerName || `Khách hàng #${item.customerId}`,
          })),
        );
        setTotalCount(total);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu cơ hội:", err);
      }
    };

    fetchOpps();
  }, [filters, search, page, rowsPerPage, refreshTrigger]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/opportunities/${deleteTarget.dbId}`);
      setDeleteTarget(null);
      handleRefresh();
      if (selectedOpp && selectedOpp.dbId === deleteTarget.dbId) {
        setRightPanel("stats");
        setSelectedOpp(null);
      }
    } catch (err) {
      console.error("Lỗi khi xóa cơ hội:", err);
    }
  };

  const totalPages = Math.ceil(totalCount / rowsPerPage) || 1;

  return (
    <div
      className="min-h-screen bg-[#f3f4f5] flex flex-col text-[#191c1d]"
      style={{ fontFamily: "Manrope, sans-serif" }}
    >
      <main className="flex-1 w-full mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-end shrink-0 gap-4 mb-4">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                Opportunity Manager
              </p>
              <h2 className="text-3xl font-black text-[#1a237e]">
                Cơ hội bán hàng
              </h2>
            </div>
            <div className="hidden lg:flex items-center bg-[#e6e6e7] px-4 py-2.5 rounded-full w-80 lg:w-96 focus-within:bg-white border border-transparent focus-within:border-slate-200 transition-all">
              <span
                className="material-symbols-outlined text-slate-400 text-xl"
                style={iconStyle}
              >
                search
              </span>
              <input
                type="text"
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 text-[#191c1d] ml-2 outline-none"
                placeholder="Tìm kiếm..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // Reset trang ở đây
                }}
              />
            </div>

            <div className="flex gap-3 w-full lg:w-auto justify-between lg:justify-end">
              <button
                onClick={() =>
                  setRightPanel((p) => (p === "filter" ? "stats" : "filter"))
                }
                className="relative bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
              >
                <span
                  className="material-symbols-outlined text-lg"
                  style={iconStyle}
                >
                  tune
                </span>
                <span>Bộ lọc</span>
                {/* Badge khi có filter đang active */}
                {(filters.stageIds.length > 0 ||
                  filters.statusIds.length > 0 ||
                  filters.reasonIds.length > 0 ||
                  filters.sort !== "") && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#1a237e] rounded-full" />
                )}
              </button>

              <button
                onClick={() => {
                  setEditId(null);
                  setIsModalOpen(true);
                }}
                className="bg-[#1a237e] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                <span>Thêm cơ hội</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/60 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-5">Mã</th>
                    <th className="py-0.5 px-4">Tên Thương Vụ</th>
                    <th className="py-0.5 px-4">Khách Hàng</th>
                    <th className="py-0.5 px-4">Giai Đoạn</th>
                    <th className="py-0.5 px-4 text-right">Giá Trị</th>
                    <th className="py-0.5 px-4 text-center">Xác Suất</th>
                    <th className="py-0.5 px-4 text-center">Trạng Thái</th>
                    <th className="py-3 px-5 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {opps.map((opp) => {
                    const styles = mapStyles(opp.stage?.name, opp.status?.name);
                    return (
                      <tr
                        key={opp.dbId}
                        onClick={() => {
                          setSelectedOpp(opp);
                          setRightPanel("inspection");
                        }}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <td className="py-0.5 px-5 font-bold text-[#000666]">
                          {opp.id}
                        </td>
                        <td className="py-0.5 px-4 font-bold text-slate-800">
                          {opp.name}
                        </td>
                        <td className="py-0.5 px-4 text-slate-600 font-semibold">
                          {opp.customerName}
                        </td>
                        <td className="py-0.5 px-4">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold ${styles.stageStyle}`}
                          >
                            {opp.stage?.name}
                          </span>
                        </td>
                        <td className="py-0.5 px-4 text-right font-bold">
                          {formatCompactCurrency(opp.totalAmount)}
                        </td>
                        <td className="py-0.5 px-4 text-center font-bold">
                          {opp.probability}%
                        </td>
                        <td className="py-0.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold ${styles.statusStyle}`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${styles.statusDot}`}
                            />{" "}
                            {opp.status?.name}
                          </span>
                        </td>
                        <td
                          className="py-0.5 px-5 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => {
                                setEditId(opp.dbId);
                                setIsModalOpen(true);
                              }}
                              className="p-1 hover:text-blue-700 transition-all"
                            >
                              <span className="material-symbols-outlined text-base">
                                edit
                              </span>
                            </button>
                            <button
                              onClick={() => setDeleteTarget(opp)}
                              className="p-1 hover:text-red-600 transition-all"
                            >
                              <span className="material-symbols-outlined text-base">
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 text-[11px]">
              <div className="text-slate-500 font-bold">
                Mỗi trang:{" "}
                <select
                  className="bg-transparent"
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div className="flex gap-2 items-center font-bold">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="w-6 h-6 border rounded bg-white"
                >
                  {"<"}
                </button>
                <span>
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="w-6 h-6 border rounded bg-white"
                >
                  {">"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
          {rightPanel === "stats" && (
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex flex-col">
              <div className="text-[10px] font-black uppercase text-[#1A237E] tracking-widest mb-4 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">
                  monitoring
                </span>{" "}
                Số liệu tổng quan
              </div>

              <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-slate-200 bg-slate-50/50 rounded-xl">
                <span className="material-symbols-outlined text-slate-300 text-3xl mb-2">
                  analytics
                </span>
                <p className="text-xs font-bold text-slate-500 mb-1">
                  Đang thiết lập dữ liệu
                </p>
              </div>
            </div>
          )}

          {rightPanel === "inspection" && selectedOpp && (
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs p-4 animate-fade-in relative flex flex-col gap-4">
              <button
                onClick={() => setRightPanel("stats")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-md">close</span>
              </button>

              <h3 className="text-[10px] font-black uppercase text-[#1A237E] tracking-wider">
                Chi tiết thương vụ nâng cao
              </h3>

              <div className="space-y-3.5">
                <div className="p-3 bg-[#1a237e]/5 rounded-xl border border-[#1a237e]/10">
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-0.5">
                    {selectedOpp.id || selectedOpp.opportunityCode}
                  </p>
                  <p className="text-sm font-black text-[#1a237e] leading-tight mb-1">
                    {selectedOpp.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                    <span className="material-symbols-outlined text-xs">
                      person
                    </span>
                    <span>
                      {selectedOpp.customerName ||
                        `Mã KH: #${selectedOpp.customerId}`}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-semibold">
                      Giai đoạn:
                    </span>
                    <span className="font-bold text-[#1a237e]">
                      {selectedOpp.stageName ||
                        selectedOpp.stage?.name ||
                        "Chưa rõ"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-semibold">
                      Trạng thái:
                    </span>
                    <span className="font-bold text-slate-700">
                      {selectedOpp.statusName ||
                        selectedOpp.status?.name ||
                        "Chưa rõ"}
                    </span>
                  </div>

                  {(selectedOpp.lostReasonName || selectedOpp.lostReasonId) && (
                    <div className="flex justify-between items-start text-[11px] pt-1.5 border-t border-slate-200/60">
                      <span className="text-red-500 font-bold">
                        Lý do thất bại:
                      </span>
                      <span className="font-semibold text-red-600 text-right max-w-[140px] break-words">
                        {selectedOpp.lostReasonName ||
                          `Mã lý do: #${selectedOpp.lostReasonId}`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 border border-slate-100 bg-white rounded-lg shadow-2xs">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                      Tổng giá trị
                    </p>
                    <p className="text-xs font-extrabold text-slate-800">
                      {formatCompactCurrency(selectedOpp.totalAmount)}
                    </p>
                  </div>
                  <div className="p-2 border border-slate-100 bg-white rounded-lg shadow-2xs">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                      Xác suất
                    </p>
                    <p className="text-xs font-extrabold text-indigo-600">
                      {selectedOpp.probability}%
                    </p>
                  </div>
                  <div className="p-2 border border-slate-100 bg-emerald-50/30 rounded-lg">
                    <p className="text-[9px] text-emerald-600/80 font-bold uppercase tracking-wider mb-0.5">
                      Tiền đặt cọc
                    </p>
                    <p className="text-xs font-extrabold text-emerald-600">
                      {formatCompactCurrency(selectedOpp.depositAmount)}
                    </p>
                  </div>
                  <div className="p-2 border border-slate-100 bg-amber-50/30 rounded-lg">
                    <p className="text-[9px] text-amber-600/80 font-bold uppercase tracking-wider mb-0.5">
                      Còn lại phải thu
                    </p>
                    <p className="text-xs font-extrabold text-amber-600">
                      {formatCompactCurrency(
                        selectedOpp.remainingAmount ??
                          selectedOpp.totalAmount - selectedOpp.depositAmount,
                      )}
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Mô tả chi tiết
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 max-h-24 overflow-y-auto">
                    "
                    {selectedOpp.description ||
                      "Không có mô tả cho cơ hội này..."}
                    "
                  </p>
                </div>
              </div>
            </div>
          )}

          {rightPanel === "filter" && (
            <OpportunityFilterPanel
              filters={filters}
              onChange={setFilters}
              onClose={() => setRightPanel("stats")}
              onChange={(newFilters) => {
                setFilters(newFilters);
                setPage(1); // Reset trang ở đây
              }}
            />
          )}
        </aside>
      </main>

      <OpportunityFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditId(null);
        }}
        opportunityId={editId}
        onSaveSuccess={handleRefresh}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        targetName={deleteTarget?.name || ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
