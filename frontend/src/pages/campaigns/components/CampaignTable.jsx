import React from "react";
import {
  Filter,
  Eye,
  Edit,
  Trash2,
  Megaphone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getCampaignStatus } from "../../../utils/formatters";

const CampaignTable = ({
  filteredCampaigns,
  isLoading,
  onOpenEdit,
  onDelete,
  onOpenDetail,
  currentPage,
  totalPages,
  totalElements,
  setCurrentPage,
  pageSize,
  setPageSize,
  onRowClick,
  tableContainerRef,
  selectedRow,
  onOpenFilter,
  canView,     // Nhận props phân quyền
  canUpdate,   
  canDelete,
}) => {
  const MIN_VISIBLE_ROWS = 10;
  const emptyRows = Math.max(0, MIN_VISIBLE_ROWS - filteredCampaigns.length);

  const getVisiblePages = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3)
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm flex flex-col border border-slate-200 h-full overflow-hidden">
      
      {/* HEADER BẢNG */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">
          Danh sách Chiến dịch
        </h3>
        <button
          onClick={onOpenFilter}
          className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium shadow-sm outline-none"
        >
          <Filter size={16} strokeWidth={2.5} /> Bộ lọc
        </button>
      </div>

      {/* VÙNG CHỨA DỮ LIỆU */}
      <div ref={tableContainerRef} className="flex-1 overflow-y-auto custom-scrollbar relative">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-20 shadow-sm ring-1 ring-slate-100">
            <tr className="bg-white">
              <th className="sticky top-0 bg-white px-6 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b w-1/3">
                Tên Chiến dịch
              </th>
              <th className="sticky top-0 bg-white px-6 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Ngày bắt đầu
              </th>
              <th className="sticky top-0 bg-white px-6 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Ngày kết thúc
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
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredCampaigns.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium">
                  Không tìm thấy chiến dịch nào.
                </td>
              </tr>
            ) : (
              filteredCampaigns.map((item, index) => {
                const status = getCampaignStatus(item.startDate, item.endDate);
                return (
                  <tr
                    key={item.id}
                    data-index={index}
                    className={`hover:bg-slate-50 transition-colors group cursor-pointer ${selectedRow?.id === item.id ? "bg-primary/5" : ""}`}
                    onClick={() => onRowClick(item, index)}
                    // BỌC QUYỀN CHO SỰ KIỆN CLICK ĐÚP CHUỘT
                    onDoubleClick={() => canView && onOpenDetail(item.id)}
                  >
                    <td className="px-6 py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <Megaphone size={16} />
                        </div>
                        <span className="font-bold text-slate-900 text-sm line-clamp-1">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-2 text-sm text-slate-600 font-medium">
                      {item.startDate
                        ? new Date(item.startDate).toLocaleDateString("vi-VN")
                        : "---"}
                    </td>
                    <td className="px-6 py-2 text-sm text-slate-600 font-medium">
                      {item.endDate
                        ? new Date(item.endDate).toLocaleDateString("vi-VN")
                        : "---"}
                    </td>
                    <td className="px-6 py-2 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${status.color.replace("bg-", "bg-opacity-10 text-").replace("text-white", "")} border-current opacity-80`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-2 text-right">
                      <div className="flex justify-end gap-1.5">
                        {/* ẨN/HIỆN NÚT THEO QUYỀN */}
                        {canView && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDetail(item.id);
                            }}
                            className="p-1.5 text-primary bg-primary/5 hover:bg-primary/15 rounded-lg outline-none transition-colors"
                            title="Xem chi tiết (Alt+V)"
                          >
                            <Eye size={16} strokeWidth={2} />
                          </button>
                        )}
                        {canUpdate && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenEdit(item);
                            }}
                            className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg outline-none transition-colors"
                            title="Sửa (Alt+E)"
                          >
                            <Edit size={16} strokeWidth={2} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(item.id, item.name);
                            }}
                            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg outline-none transition-colors"
                            title="Xóa (Alt+D)"
                          >
                            <Trash2 size={16} strokeWidth={2} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
            {/* Dòng trống giữ khung UI */}
            {Array.from({ length: emptyRows }).map((_, idx) => (
              <tr key={`empty-${idx}`}>
                <td className="px-6 py-2 text-transparent select-none">
                  <div className="h-7">_</div>
                </td>
                <td></td><td></td><td></td><td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER BẢNG */}
      <div className="px-6 py-3 bg-slate-50 flex items-center justify-between border-t border-slate-100 shrink-0 z-10 relative">
        <div className="flex items-center gap-3">
          <p className="text-xs text-slate-500 font-medium">
            Hiển thị <span className="font-bold text-slate-800">{filteredCampaigns.length}</span> / <span className="font-bold text-slate-800">{totalElements || 0}</span> chiến dịch
          </p>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-primary font-semibold text-slate-700 cursor-pointer hover:border-slate-300"
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
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors outline-none"
            >
              <ChevronLeft size={16} />
            </button>
            {getVisiblePages(currentPage, totalPages).map((page, idx) =>
              page === "..." ? (
                <span
                  key={`ell-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs font-bold select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors outline-none ${currentPage === page ? "bg-primary text-white border-primary" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  {page}
                </button>
              ),
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors outline-none"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignTable;