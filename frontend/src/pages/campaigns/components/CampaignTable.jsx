import React from "react";
import Button from "../../../components/ui/Button";
import { getCampaignStatus } from "../../../utils/formatters";

const CampaignTable = ({
  filteredCampaigns, isLoading, onOpenEdit, onDelete, onOpenDetail,
  currentPage, totalPages, setCurrentPage, pageSize, setPageSize,
  onRowClick, selectedRow, onOpenFilter
}) => {
  const emptyRows = Math.max(0, pageSize - filteredCampaigns.length);

  const getVisiblePages = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">Danh sách Chiến dịch</h3>
        <Button variant="outline" icon="filter_list" onClick={onOpenFilter} className="bg-white border-slate-200 text-primary hover:bg-primary/5 text-sm py-1.5 shadow-sm">
          Bộ lọc chi tiết
        </Button>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b w-1/3">Tên Chiến dịch</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">Ngày bắt đầu</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">Ngày kết thúc</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b text-center">Trạng thái</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium">Đang tải dữ liệu...</td></tr>
            ) : filteredCampaigns.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium">Không tìm thấy chiến dịch nào.</td></tr>
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
                          <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[18px]">campaign</span>
                          </div>
                          <span className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.startDate ? new Date(item.startDate).toLocaleDateString('vi-VN') : "---"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.endDate ? new Date(item.endDate).toLocaleDateString('vi-VN') : "---"}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${status.color.replace('bg-', 'bg-opacity-10 text-').replace('text-white', '')} border-current opacity-80`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Button variant="iconOnly" className="hover:bg-slate-100 text-slate-500" onClick={(e) => { e.stopPropagation(); onOpenDetail(item.id); }} title="Xem chi tiết (Alt+V)" icon="visibility" />
                        <Button variant="iconOnly" className="hover:bg-blue-50 text-slate-500 hover:text-blue-600" onClick={(e) => { e.stopPropagation(); onOpenEdit(item); }} title="Sửa (Alt+E)" icon="edit" />
                        <Button variant="iconOnly" className="hover:bg-red-50 text-slate-500 hover:text-red-600" onClick={(e) => { e.stopPropagation(); onDelete(item.id, item.name); }} title="Xóa (Alt+D)" icon="delete" />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
            {/* Dòng trống giữ layout */}
            {Array.from({ length: emptyRows }).map((_, idx) => (
              <tr key={`empty-${idx}`}><td className="px-6 py-4 text-transparent select-none"><div className="h-9">_</div></td><td></td><td></td><td></td><td></td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
        <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="text-xs bg-white border border-slate-200 rounded px-2 py-1 outline-none cursor-pointer">
          <option value={10}>10 dòng / trang</option>
          <option value={20}>20 dòng / trang</option>
          <option value={50}>50 dòng / trang</option>
        </select>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            {getVisiblePages(currentPage, totalPages).map((page, idx) => (
              page === "..." ? <span key={`ell-${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs">...</span> :
              <button key={`page-${page}`} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-xs font-bold ${currentPage === page ? "bg-primary text-white border-primary" : "bg-white border text-slate-600 hover:bg-slate-50"}`}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignTable;