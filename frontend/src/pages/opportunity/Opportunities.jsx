import React, { useState, useEffect, useRef } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { Search, Filter, Plus, ChevronLeft, ChevronRight, User, AlertCircle, Edit, Lock } from "lucide-react";
import { usePermission } from "../../hooks/usePermission";

import OpportunityFormModal from "./OpportunityFormModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import OpportunityFilterPanel from "./OpportunityFilter";
import OpportunityRow from "./OpportunityRow";

export default function OpportunityDashboard() {
  // --- GỌI HOOK PHÂN QUYỀN ---
  const { hasPermission } = usePermission();
  const canView = hasPermission("opportunities.view");
  const canCreate = hasPermission("opportunities.create");
  const canUpdate = hasPermission("opportunities.update");
  const canDelete = hasPermission("opportunities.delete");

  const [opportunities, setOpportunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchInputRef = useRef(null);
  const pageSizeRef = useRef(null);
  const tableContainerRef = useRef(null);

  const [rightPanel, setRightPanel] = useState("stats");
  const [filters, setFilters] = useState({ search: "", sort: "", stageIds: [], statusIds: [], reasonIds: [] });

  const fetchOpportunities = async (activeFilters = filters) => {
    if (!canView) return;
    try {
      setLoading(true);
      const params = {};
      params.search = activeFilters.search || "";
      if (activeFilters.sort) params.sort = activeFilters.sort;
      if (activeFilters.stageIds.length) params.stageIds = activeFilters.stageIds.join(",");
      if (activeFilters.statusIds.length) params.statusIds = activeFilters.statusIds.join(",");
      if (activeFilters.reasonIds.length) params.reasonIds = activeFilters.reasonIds.join(",");

      const [oppsRes, customersRes] = await Promise.all([
        api.get("/opportunities", { params }),
        api.get("/customers"),
      ]);

      const customersArray = Array.isArray(customersRes.data) ? customersRes.data : customersRes.data.content || [];
      const customerMap = Object.fromEntries(customersArray.map((c) => [c.id, c.name]));

      const merged = oppsRes.data.map((o) => ({
        ...o,
        customerName: customerMap[o.customerId] ?? "Khách hàng Vãng lai",
      }));

      setOpportunities(merged);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách cơ hội bán hàng. " + err.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOpportunities(filters); }, [filters, canView]);

  useEffect(() => {
    const handler = setTimeout(() => { setFilters((prev) => ({ ...prev, search: searchTerm })); }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleRefresh = () => fetchOpportunities(filters);

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !canDelete) return;
    try {
      const currentUserId = localStorage.getItem("user_id");
      if (!currentUserId) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        return;
      }
      await api.delete(`/opportunities/${deleteTarget.id}`, { params: { deletedBy: currentUserId } });
      setOpportunities((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      setSelectedOpp(null); setSelectedIndex(-1); setDeleteTarget(null);
      toast.success("Xóa cơ hội bán hàng thành công!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa cơ hội bán hàng!");
    }
  };

  const handleFilterChange = (newFilters) => { setFilters(newFilters); setPage(1); setSelectedIndex(-1); };
  const handleSearchChange = (val) => { setSearchTerm(val); setPage(1); setSelectedIndex(-1); };

  const activeFilterCount = [filters.sort !== "", filters.stageIds.length > 0, filters.statusIds.length > 0, filters.reasonIds.length > 0].filter(Boolean).length;
  const totalFiltered = opportunities.length;
  const startIdx = (page - 1) * pageSize;
  const paginated = opportunities.slice(startIdx, startIdx + pageSize);

  const colWidths = ["22%", "18%", "12%", "10%", "15%", "13%", "10%"];
  const COLS = ["Cơ hội", "Khách hàng", "Tổng tiền", "Xác suất", "Giai đoạn", "Trạng thái", ""];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        if (e.key === "Escape") document.activeElement.blur(); return;
      }
      if (e.key === "Escape") { setIsModalOpen(false); setEditId(null); setRightPanel("stats"); setDeleteTarget(null); return; }
      if (isModalOpen || editId !== null || !!deleteTarget || rightPanel === "filter") return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault(); setSelectedIndex((prev) => { const idx = prev < paginated.length - 1 ? prev + 1 : prev; if (paginated[idx]) setSelectedOpp(paginated[idx]); return idx; }); break;
        case "ArrowUp":
          e.preventDefault(); setSelectedIndex((prev) => { const idx = prev > 0 ? prev - 1 : 0; if (paginated[idx]) setSelectedOpp(paginated[idx]); return idx; }); break;
        case "e": case "E":
          if (selectedOpp && canUpdate) { e.preventDefault(); setEditId(selectedOpp.id); setIsModalOpen(true); } break;
        case "Delete": case "Backspace":
          if (selectedOpp && canDelete) { e.preventDefault(); setDeleteTarget(selectedOpp); } break;
      }
      if (e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        if (canCreate) setIsModalOpen(true); else toast.error("Bạn không có quyền thêm mới!");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [page, pageSize, totalFiltered, isModalOpen, editId, deleteTarget, rightPanel, paginated, selectedOpp, canUpdate, canDelete, canCreate]);

  const formatCompactCurrency = (value) => {
    if (!value || isNaN(value)) return "0 đ";
    const num = Number(value);
    if (num >= 1000000000) return `${(num / 1000000000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} Tỉ`;
    if (num >= 1000000) return `${(num / 1000000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} Triệu`;
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  // MÀN HÌNH KHÓA NẾU KHÔNG CÓ QUYỀN VIEW
  if (!canView) {
    return (
      <div className="bg-[#f8f9fa] h-screen flex flex-col items-center justify-center text-slate-500">
        <Lock size={64} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Truy cập bị từ chối</h2>
        <p className="text-sm mt-2">Bạn không có quyền xem cơ hội bán hàng.</p>
      </div>
    );
  }

  return (
    <>
      <main className="bg-[#f8f9fa] text-[#191c1d] h-screen flex flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <div className="space-y-6 flex-1 relative">
            <div className="flex justify-between items-end shrink-0 gap-4 p-4 pb-0">
              <div><h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">Cơ hội bán hàng</h2></div>
              <div className="hidden lg:flex items-center bg-[#e6e6e7] px-4 py-2.5 rounded-full w-80 lg:w-96 focus-within:bg-white border border-transparent focus-within:border-slate-200 transition-all">
                <Search size={18} className="text-slate-400" />
                <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 text-[#191c1d] ml-2 outline-none" placeholder="Tìm kiếm cơ hội..." ref={searchInputRef} value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setRightPanel(rightPanel === "filter" ? "stats" : "filter")} className="relative bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                  <Filter size={18} /> Lọc
                  {activeFilterCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#1a237e] text-white text-[0.6rem] font-bold rounded-full w-4 h-4 flex items-center justify-center">{activeFilterCount}</span>}
                </button>
                {canCreate && (
                  <button onClick={() => setIsModalOpen(true)} className="bg-[#1a237e] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center gap-2">
                    <Plus size={20} />
                  </button>
                )}
              </div>
            </div>

            <section className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col flex-1 mx-4 overflow-hidden min-h-0">
              <div className="shrink-0 border-b border-slate-100">
                <table className="w-full text-left border-collapse table-fixed">
                  <colgroup>{colWidths.map((w, i) => <col key={i} style={{ width: w }} />)}</colgroup>
                  <thead>
                    <tr className="bg-[#f3f4f5]/50">
                      {COLS.map((h, i) => <th key={i} className={`px-2 py-4 text-[0.65rem] uppercase tracking-widest text-slate-400 font-black ${i === 0 ? "pl-8" : ""}`}>{h}</th>)}
                    </tr>
                  </thead>
                </table>
              </div>

              <div ref={tableContainerRef} className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                <table className="w-full text-left border-collapse table-fixed">
                  <colgroup>{colWidths.map((w, i) => <col key={i} style={{ width: w }} />)}</colgroup>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr><td colSpan={7} className="px-8 py-20 text-center text-slate-400">Đang tải dữ liệu...</td></tr>
                    ) : error ? (
                      <tr><td colSpan={7} className="px-8 py-20 text-center text-red-400">{error}</td></tr>
                    ) : paginated.length > 0 ? (
                      paginated.map((opp, index) => (
                        <OpportunityRow
                          key={opp.id} opp={opp} index={index} isActive={index === selectedIndex}
                          onSelect={(item) => { setSelectedOpp(item); setSelectedIndex(index); }}
                          onDelete={setDeleteTarget} onEdit={(id) => { setEditId(id); setIsModalOpen(true); }}
                          canUpdate={canUpdate} canDelete={canDelete} // TRUYỀN QUYỀN XUỐNG ROW
                        />
                      ))
                    ) : (
                      <tr><td colSpan={7} className="px-8 py-20 text-center text-slate-400">Không có dữ liệu phù hợp.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="shrink-0 border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-white rounded-b-3xl">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-slate-400 uppercase">Hiển thị</p>
                  <select ref={pageSizeRef} value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg px-2 py-1 outline-none">
                    {[10, 20, 30, 50, 100].map((size) => <option key={size} value={size}>{size} dòng</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40">
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex items-center px-4 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-slate-50">
                    Trang {page} / {Math.ceil(totalFiltered / pageSize) || 1}
                  </div>
                  <button disabled={page >= Math.ceil(totalFiltered / pageSize)} onClick={() => setPage(page + 1)} className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </section>
          </div>

          <aside className="hidden xl:block w-80 shrink-0 border-l border-slate-200/50 bg-[#f3f4f5]/50 overflow-y-auto p-6">
            {rightPanel === "filter" ? (
              <OpportunityFilterPanel filters={filters} onChange={handleFilterChange} onClose={() => setRightPanel("stats")} />
            ) : selectedOpp && (
              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 space-y-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black uppercase text-[#1A237E] tracking-wider">Thông tin chi tiết</h3>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">ID: {selectedOpp.id}</span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Mã cơ hội</p>
                      <p className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100 inline-block">{selectedOpp.opportunityCode || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Tên cơ hội</p>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{selectedOpp.name}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Khách hàng</p>
                      <p className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <User size={14} className="text-slate-400" /> {selectedOpp.customerName}
                      </p>
                    </div>
                  </div>
                  <hr className="border-slate-100" />
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">Giá trị tài chính</p>
                    <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-500 font-medium">Tổng giá trị:</span>
                        <span className="text-xs font-bold text-slate-800">{formatCompactCurrency(selectedOpp.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-500 font-medium">Đã đặt cọc:</span>
                        <span className="text-xs font-bold text-emerald-600">{formatCompactCurrency(selectedOpp.depositAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1.5 border-t border-dashed border-slate-200">
                        <span className="text-[11px] text-slate-600 font-bold">Còn lại cần thu:</span>
                        <span className="text-xs font-black text-blue-700">{formatCompactCurrency(selectedOpp.remainingAmount)}</span>
                      </div>
                    </div>
                  </div>
                  <hr className="border-slate-100" />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Xác suất</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-slate-800">{selectedOpp.probability}%</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${selectedOpp.probability}%` }} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Giai đoạn</p>
                      <p className="text-xs font-bold text-slate-700 truncate" title={selectedOpp.stageName}>{selectedOpp.stageName || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Trạng thái hiện tại</p>
                    <div className="flex">
                      <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase border ${
                          String(selectedOpp.statusName).toUpperCase() === "LOST" ? "bg-rose-50 text-rose-700 border-rose-200"
                            : String(selectedOpp.statusName).toUpperCase() === "WON" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>{selectedOpp.statusName || "N/A"}</span>
                    </div>
                  </div>
                  {(selectedOpp.lostReasonName || selectedOpp.lostReasonId) && (
                    <div className="bg-red-50/60 p-3 rounded-xl border border-red-100/70 animate-fade-in">
                      <div className="flex items-center gap-1 text-red-700 mb-1">
                        <AlertCircle size={14} />
                        <p className="text-[9px] font-black uppercase tracking-wider">Lý do thất bại</p>
                      </div>
                      <p className="text-xs font-medium text-red-800 leading-relaxed">{selectedOpp.lostReasonName || `Mã lý do: # ${selectedOpp.lostReasonId}`}</p>
                    </div>
                  )}
                  {selectedOpp.description && (
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Mô tả thêm</p>
                      <p className="text-xs text-slate-500 leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 max-h-24 overflow-y-auto">"{selectedOpp.description}"</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      <OpportunityFormModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditId(null); }} opportunityId={editId} onSaved={handleRefresh} />
      <DeleteConfirmModal isOpen={!!deleteTarget} title="Bạn có chắc muốn xóa cơ hội này?" targetName={deleteTarget?.name || ""} onClose={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} />
    </>
  );
}