import React from "react";
import Button from "../../../components/ui/Button";

const CustomerTable = ({
  customers,
  isLoading,
  onOpenDetail,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  setCurrentPage,
  pageSize,
  setPageSize,
  onRowClick,
  selectedCustomerForRow,
  onOpenFilter,
}) => {
  if (isLoading)
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Đang tải dữ liệu khách hàng...
      </div>
    );

  // Tính số lượng dòng trống cần in ra để giữ bảng luôn đủ chiều cao
  const emptyRows = Math.max(0, pageSize - customers.length);

  const getVisiblePages = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3)
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      {/* HEADER BẢNG - BỘ LỌC ĐƯA VÀO GÓC GỌN GÀNG */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">
          Danh sách Khách hàng
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

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b w-1/3">
                Khách hàng
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Mã / Căn cước / MST
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Liên hệ chính
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-slate-500 font-medium"
                >
                  Không tìm thấy khách hàng nào.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className={`hover:bg-slate-50 transition-colors group cursor-pointer ${selectedCustomerForRow?.id === customer.id ? "bg-primary/5" : ""}`}
                  onClick={() => onRowClick(customer)}
                  onDoubleClick={() => onOpenDetail(customer)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${customer.isOrganization ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-600"}`}
                      >
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 line-clamp-1">
                          {customer.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {customer.isOrganization
                            ? "Tổ chức (B2B)"
                            : "Cá nhân (B2C)"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700">
                      {customer.customerCode}
                    </div>
                    <div className="text-xs text-slate-400">
                      {customer.isOrganization
                        ? `MST: ${customer.taxCode || "---"}`
                        : `CCCD: ${customer.citizenId || "---"}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 truncate max-w-[200px]">
                      {customer.emailOfficial || "Chưa có Email"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {customer.mainPhone || "Chưa có SĐT"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest border border-green-100">
                        {customer.statusName || "Đang chăm sóc"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      {/* CÁC NÚT ĐÃ ĐƯỢC BỔ SUNG CHÚ THÍCH PHÍM TẮT ĐẦY ĐỦ */}
                      <Button
                        variant="iconOnly"
                        icon="visibility"
                        className="text-slate-500 hover:text-primary hover:bg-slate-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDetail(customer);
                        }}
                        title="Xem chi tiết (Alt+V)"
                      />
                      <Button
                        variant="iconOnly"
                        icon="edit"
                        className="text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(customer);
                        }}
                        title="Chỉnh sửa (Alt+E)"
                      />
                      <Button
                        variant="iconOnly"
                        icon="delete"
                        className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(customer.id, customer.name);
                        }}
                        title="Xóa (Alt+D)"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}

            {/* VẼ DÒNG TRỐNG ĐỂ GIỮ CỐ ĐỊNH LAYOUT BẢNG */}
            {Array.from({ length: emptyRows }).map((_, index) => (
              <tr key={`empty-${index}`}>
                <td className="px-6 py-4 text-transparent pointer-events-none select-none">
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
        {/* OPTION CHỌN 10/20/50 DÒNG 1 TRANG */}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="text-xs bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-primary font-medium text-slate-600 cursor-pointer"
        >
          <option value={10}>10 dòng / trang</option>
          <option value={20}>20 dòng / trang</option>
          <option value={50}>50 dòng / trang</option>
        </select>

        {/* THANH ĐIỀU HƯỚNG PHÂN TRANG */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>

            {getVisiblePages(currentPage, totalPages).map((page, index) => {
              if (page === "...")
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs font-bold"
                  >
                    ...
                  </span>
                );
              return (
                <button
                  key={`page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${currentPage === page ? "bg-primary text-white border-primary" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
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

export default CustomerTable;
