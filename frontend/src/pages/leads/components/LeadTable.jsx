import React from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, getInitials } from "../../../utils/formatters";
import Button from "../../../components/ui/Button";

const LeadTable = ({
  filteredLeads,
  totalFiltered,
  isLoading,
  onOpenEdit,
  onDelete,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const navigate = useNavigate();

  // Các hàm helper UI cục bộ cho bảng
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
                  <td className="sticky right-0 z-10 bg-surface-container-lowest group-hover:bg-surface-container-low transition-colors px-6 py-5 shadow-[-8px_0_10px_-4px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="iconOnly"
                        className="hover:bg-surface-container-high text-on-surface-variant"
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        title="Xem chi tiết"
                        icon="visibility"
                      />
                      <Button
                        variant="iconOnly"
                        className="hover:bg-primary/10 text-primary"
                        onClick={() => onOpenEdit(lead)}
                        title="Chỉnh sửa"
                        icon="edit"
                      />
                      <Button
                        variant="iconOnly"
                        className="hover:bg-error/10 text-error"
                        onClick={() => onDelete(lead.id, lead.fullName)}
                        title="Xóa"
                        icon="delete"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="px-6 py-4 bg-surface-container-low/30 flex items-center justify-between border-t border-surface-variant/30">
        <p className="text-xs text-on-surface-variant">
          Hiển thị trang{" "}
          <span className="font-bold text-primary">{currentPage}</span> /{" "}
          {totalPages || 1}
          (Tổng cộng {totalFiltered} khách hàng)
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>

            {/* Tạo danh sách các số trang */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === i + 1
                    ? "bg-primary text-white shadow-md"
                    : "hover:bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
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
