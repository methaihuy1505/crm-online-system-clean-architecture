import React from "react";
import { formatCurrency, getInitials } from "../../../utils/formatters";
import Button from "../../../components/ui/Button";

const LeadTable = ({
  filteredLeads,
  isLoading,
  onOpenDetail,
  onOpenEdit,
  onDelete,
  currentPage,
  totalPages,
  setCurrentPage,
  pageSize,
  setPageSize,
  onRowClick,
  selectedLeadForRow,
  onOpenFilter,
}) => {
  const getStatusStyle = (statusName) => {
    if (statusName === "Mới") return "bg-slate-100 text-slate-700";
    if (statusName === "Đang liên hệ") return "bg-blue-100 text-blue-700";
    if (statusName === "Đã chuyển đổi") return "bg-green-100 text-green-700";
    return "bg-slate-100 text-slate-600";
  };

  const emptyRows = Math.max(0, pageSize - filteredLeads.length);

  const getVisiblePages = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3)
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">
          Danh sách Tiềm năng
        </h3>
        <Button
          variant="outline"
          icon="filter_list"
          onClick={onOpenFilter}
          className="bg-white border-slate-200 text-primary hover:bg-primary/5 text-sm py-1.5 shadow-sm"
        >
          Bộ lọc chi tiết
        </Button>
      </div>

      <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b w-1/4">
                Liên hệ
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Loại hình KD
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Thông tin
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Dự kiến thu
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Mã/Nguồn
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
                  colSpan="7"
                  className="px-6 py-12 text-center text-slate-500"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-slate-500"
                >
                  Không tìm thấy khách hàng.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => onRowClick(lead)}
                  onDoubleClick={() => onOpenDetail(lead)}
                  className={`hover:bg-slate-50 transition-colors group cursor-pointer ${selectedLeadForRow?.id === lead.id ? "bg-primary/5" : ""}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {getInitials(lead.fullName)}
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
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-xs text-slate-800 font-medium truncate max-w-[150px]">
                        {lead.phone || "---"}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[150px]">
                        {lead.email || "---"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className={`text-xs font-bold ${lead.expectedRevenue ? "text-primary" : "text-slate-400"}`}
                    >
                      {formatCurrency(lead.expectedRevenue)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[10px] font-medium text-slate-800">
                      MST: {lead.taxCode || "---"}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {lead.sourceName || "Tự nhiên"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-slate-200 ${getStatusStyle(lead.statusName)}`}
                    >
                      {lead.statusName || "Chưa rõ"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="iconOnly"
                        className="hover:bg-slate-100 text-slate-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDetail(lead);
                        }}
                        title="Xem chi tiết (Alt+V)"
                        icon="visibility"
                      />
                      <Button
                        variant="iconOnly"
                        className="hover:bg-blue-50 text-slate-500 hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEdit(lead);
                        }}
                        title="Sửa (Alt+E)"
                        icon="edit"
                      />
                      <Button
                        variant="iconOnly"
                        className="hover:bg-red-50 text-slate-500 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(lead.id, lead.fullName);
                        }}
                        title="Xóa (Alt+D)"
                        icon="delete"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
            {Array.from({ length: emptyRows }).map((_, idx) => (
              <tr key={`empty-${idx}`}>
                <td className="px-6 py-4 select-none text-transparent">
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
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            {getVisiblePages(currentPage, totalPages).map((page, idx) =>
              page === "..." ? (
                <span
                  key={`ell-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold ${currentPage === page ? "bg-primary text-white border-primary" : "bg-white border text-slate-600 hover:bg-slate-50"}`}
                >
                  {page}
                </button>
              ),
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadTable;
