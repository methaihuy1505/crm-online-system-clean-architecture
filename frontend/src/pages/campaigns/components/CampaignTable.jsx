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
  setCurrentPage,
  pageSize,
  setPageSize,
  onRowClick,
  selectedRow,
  onOpenFilter,
}) => {
  const emptyRows = Math.max(0, pageSize - filteredCampaigns.length);

  const getVisiblePages = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3)
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
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

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b w-1/3">
                Tên Chiến dịch
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Ngày bắt đầu
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Ngày kết thúc
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b text-center">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-slate-500 font-medium"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredCampaigns.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-slate-500 font-medium"
                >
                  Không tìm thấy chiến dịch nào.
                </td>
              </tr>
            ) : (
              filteredCampaigns.map((item) => {
                const status = getCampaignStatus(item.startDate, item.endDate);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50 transition-colors group cursor-pointer ${selectedRow?.id === item.id ? "bg-primary/5" : ""}`}
                    onClick={() => onRowClick(item)}
                    onDoubleClick={() => onOpenDetail(item.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <Megaphone size={18} />
                        </div>
                        <span className="font-bold text-slate-900 text-sm line-clamp-1">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {item.startDate
                        ? new Date(item.startDate).toLocaleDateString("vi-VN")
                        : "---"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {item.endDate
                        ? new Date(item.endDate).toLocaleDateString("vi-VN")
                        : "---"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${status.color.replace("bg-", "bg-opacity-10 text-").replace("text-white", "")} border-current opacity-80`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* BỎ LÀM MỜ, GẮN MÀU MẶC ĐỊNH (Giống Lead & Customer) */}
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDetail(item.id);
                          }}
                          className="p-1.5 text-primary bg-primary/5 hover:bg-primary/15 rounded-lg outline-none transition-colors"
                          title="Xem chi tiết (Alt+V)"
                        >
                          <Eye size={18} strokeWidth={2} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEdit(item);
                          }}
                          className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg outline-none transition-colors"
                          title="Sửa (Alt+E)"
                        >
                          <Edit size={18} strokeWidth={2} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id, item.name);
                          }}
                          className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg outline-none transition-colors"
                          title="Xóa (Alt+D)"
                        >
                          <Trash2 size={18} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
            {Array.from({ length: emptyRows }).map((_, idx) => (
              <tr key={`empty-${idx}`}>
                <td className="px-6 py-4 text-transparent select-none">
                  <div className="h-9">_</div>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="text-xs bg-white border border-slate-200 rounded px-2 py-1 outline-none cursor-pointer"
        >
          <option value={10}>10 dòng / trang</option>
          <option value={20}>20 dòng / trang</option>
          <option value={50}>50 dòng / trang</option>
        </select>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {getVisiblePages(currentPage, totalPages).map((page, idx) =>
              page === "..." ? (
                <span
                  key={`ell-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs font-bold"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${currentPage === page ? "bg-primary text-white border-primary" : "bg-white border text-slate-600 hover:bg-slate-50"}`}
                >
                  {page}
                </button>
              ),
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
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
