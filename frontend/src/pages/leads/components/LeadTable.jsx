import React from "react";
import {
  Filter,
  Eye,
  Edit,
  Trash2,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "../../../utils/formatters";

const LeadTable = ({
  filteredLeads,
  isLoading,
  onOpenDetail,
  onOpenEdit,
  onDelete,
  currentPage,
  totalPages,
  totalElements,
  setCurrentPage,
  pageSize,
  setPageSize,
  onRowClick,
  selectedLeadForRow,
  onOpenFilter,
  tableContainerRef,
}) => {
  const getStatusStyle = (statusName) => {
    if (statusName === "Mới") return "bg-slate-100 text-slate-700";
    if (statusName === "Đang liên hệ") return "bg-blue-100 text-blue-700";
    if (statusName === "Đã chuyển đổi") return "bg-green-100 text-green-700";
    return "bg-slate-100 text-slate-600";
  };

  // LUÔN LUÔN hiển thị tối thiểu 10 dòng để giữ Layout bảng cố định
  const MIN_VISIBLE_ROWS = 10;
  const emptyRows = Math.max(0, MIN_VISIBLE_ROWS - filteredLeads.length);

  const getVisiblePages = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3)
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  return (
    // Sử dụng h-full và flex-col để container tự co giãn theo chiều cao trang
    <div className="bg-white rounded-2xl shadow-sm flex flex-col border border-slate-200 h-full overflow-hidden">
      {/* HEADER BẢNG - Bị đẩy lên trên cùng (shrink-0) */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">
          Danh sách Tiềm năng
        </h3>
        <button
          onClick={onOpenFilter}
          className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium shadow-sm outline-none"
        >
          <Filter size={16} strokeWidth={2.5} /> Bộ lọc
        </button>
      </div>

      {/* VÙNG CHỨA DỮ LIỆU - flex-1 giúp khu vực này tự động chiếm hết không gian còn lại và sinh ra thanh cuộn */}
      {/* VÙNG CHỨA DỮ LIỆU */}
      <div
        ref={tableContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar relative"
      >
        <table className="w-full text-left border-collapse">
          {/* STICKY HEADER - Ghim dòng tiêu đề lại */}
          <thead className="sticky top-0 z-20 shadow-sm ring-1 ring-slate-100">
            <tr className="bg-white">
              <th className="sticky top-0 bg-white px-6 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b w-1/4">
                Liên hệ
              </th>
              <th className="sticky top-0 bg-white px-6 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Loại hình KD
              </th>
              <th className="sticky top-0 bg-white px-6 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Thông tin
              </th>
              <th className="sticky top-0 bg-white px-6 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Dự kiến thu
              </th>
              <th className="sticky top-0 bg-white px-6 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Mã/Nguồn
              </th>
              <th className="sticky top-0 bg-white px-6 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b text-center">
                Trạng thái
              </th>
              <th className="sticky top-0 bg-white px-6 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b text-right">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-slate-500 font-medium"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-slate-500 font-medium"
                >
                  Không tìm thấy khách hàng.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead,index) => (
                <tr
                  key={lead.id}
                  data-index={index} // <-- Bắt buộc để querySelector tìm thấy dòng
                  onClick={() => onRowClick(lead, index)} // <-- Truyền thêm index khi click chuột
                  onDoubleClick={() => onOpenDetail(lead)}
                  className={`hover:bg-slate-50 transition-colors group cursor-pointer ${
                    selectedLeadForRow?.id === lead.id ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="px-6 py-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${lead.companyName ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"}`}
                      >
                        {lead.companyName ? (
                          <Building2 size={18} />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm line-clamp-1">
                          {lead.fullName}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {lead.companyName || "Khách cá nhân"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    {lead.companyName ? (
                      <span className="inline-flex px-2 py-1 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold">
                        Tổ chức
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 rounded bg-teal-50 border border-teal-100 text-teal-700 text-[10px] font-bold">
                        Cá nhân
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-2">
                    <div className="space-y-1">
                      <div className="text-xs text-slate-800 font-medium truncate max-w-[150px]">
                        {lead.phone || "---"}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[150px]">
                        {lead.email || "---"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <p
                      className={`text-xs font-bold ${lead.expectedRevenue ? "text-primary" : "text-slate-400"}`}
                    >
                      {formatCurrency(lead.expectedRevenue)}
                    </p>
                  </td>
                  <td className="px-6 py-2">
                    <p className="text-[10px] font-medium text-slate-800">
                      MST: {lead.taxCode || "---"}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {lead.sourceName || "Tự nhiên"}
                    </p>
                  </td>
                  <td className="px-6 py-2 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-slate-200 ${getStatusStyle(lead.statusName)}`}
                    >
                      {lead.statusName || "Chưa rõ"}
                    </span>
                  </td>
                  <td className="px-6 py-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDetail(lead);
                        }}
                        className="p-1.5 text-primary bg-primary/5 hover:bg-primary/15 rounded-lg outline-none transition-colors"
                        title="Xem chi tiết (Alt+V)"
                      >
                        <Eye size={18} strokeWidth={2} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEdit(lead);
                        }}
                        className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg outline-none transition-colors"
                        title="Sửa (Alt+E)"
                      >
                        <Edit size={18} strokeWidth={2} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(lead.id, lead.fullName);
                        }}
                        className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg outline-none transition-colors"
                        title="Xóa (Alt+D)"
                      >
                        <Trash2 size={18} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}

            {/* Các dòng trống đảm bảo hiển thị đúng form UI (10 dòng) */}
            {Array.from({ length: emptyRows }).map((_, idx) => (
              <tr key={`empty-${idx}`}>
                <td className="px-6 py-2 select-none text-transparent">
                  <div className="h-9">_</div>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER BẢNG */}
      <div className="px-6 py-3 bg-slate-50 flex items-center justify-between border-t border-slate-100 shrink-0 z-10 relative">
        <div className="flex items-center gap-3">
          <p className="text-xs text-slate-500 font-medium">
            Hiển thị <span className="font-bold text-slate-800">{filteredLeads.length}</span> / <span className="font-bold text-slate-800">{totalElements || 0}</span> leads
          </p>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-slate-300 transition-colors font-semibold text-slate-700"
          >
            <option value={10}>10 / trang</option>
            <option value={50}>50 / trang</option>
            <option value={100}>100 / trang</option>
            <option value={250}>250 / trang</option>
          </select>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 outline-none"
            >
              <ChevronLeft size={16} />
            </button>
            {getVisiblePages(currentPage, totalPages).map((page, idx) =>
              page === "..." ? (
                <span
                  key={`ell-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold outline-none ${
                    currentPage === page
                      ? "bg-primary text-white border-primary"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ),
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 outline-none"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadTable;
