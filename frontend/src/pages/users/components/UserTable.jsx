import React from "react";
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, Filter } from "lucide-react";

const STATUS_STYLE = {
  ACTIVE: "bg-blue-100 text-blue-700",
  INACTIVE: "bg-slate-200 text-slate-600",
};

const STATUS_LABEL = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngưng hoạt động",
};

const UserTable = ({
  users,
  currentUserId,
  canView,
  canUpdate,
  canDelete,
  onOpenDetail,
  onEdit,
  onDelete,
  formatJoinedDate,
  getInitials,
  getRoleLabel,
  getBranchLabel,
  getTeamLabel,
  tableContainerRef,
  selectedUserForRow,
  onRowClick,
  currentPage,
  totalPages,
  totalElements,
  setCurrentPage,
  pageSize,
  setPageSize,
  onOpenFilter,
}) => {
  React.useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, tableContainerRef]);

  const getVisiblePages = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  const emptyRows = Math.max(0, 10 - users.length);
  const showActions = canView || canUpdate || canDelete; // Chỉ hiện cột thao tác nếu có 1 trong 3 quyền

  return (
    <div className="bg-white rounded-2xl shadow-sm flex flex-col border border-slate-200 overflow-hidden max-h-[600px]">
      <div className="px-6 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">
          Danh sách người dùng
        </h3>
        <button
          onClick={onOpenFilter}
          className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium shadow-sm outline-none"
          type="button"
        >
          <Filter size={16} strokeWidth={2.5} /> Bộ lọc
        </button>
      </div>

      <div ref={tableContainerRef} className="flex-1 overflow-y-auto custom-scrollbar relative">
        <table className="w-full min-w-full text-left border-collapse table-fixed">
          <thead className="sticky top-0 z-20 shadow-sm ring-1 ring-slate-100">
            <tr className="bg-white">
              <th className="sticky top-0 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b whitespace-nowrap w-[60px]">ID</th>
              <th className="sticky top-0 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b whitespace-nowrap w-[26%]">Thông tin người dùng</th>
              <th className="sticky top-0 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b whitespace-nowrap w-[160px]">Vai trò</th>
              <th className="sticky top-0 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b whitespace-nowrap w-[160px]">Đơn vị</th>
              <th className="sticky top-0 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b whitespace-nowrap w-[150px]">Nhóm</th>
              <th className="sticky top-0 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b whitespace-nowrap w-[130px]">Trạng thái</th>
              <th className="sticky top-0 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b whitespace-nowrap w-[100px]">Ngày tham gia</th>
              {showActions && (
                <th className="sticky top-0 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b whitespace-nowrap w-[110px] text-right">Thao tác</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={showActions ? "8" : "7"} className="px-6 py-8 text-center text-slate-500 font-medium text-sm">
                  Không tìm thấy người dùng nào.
                </td>
              </tr>
            ) : (
              users.map((user, index) => {
                const roleText = getRoleLabel?.(user) || user.role?.role_name || "N/A";
                const branchText = getBranchLabel?.(user) || "-";
                const teamText = getTeamLabel?.(user) || "-";
                const isSelf = user.id === currentUserId;

                return (
                  <tr
                    key={user.id}
                    data-index={index}
                    onClick={() => onRowClick && onRowClick(user, index)}
                    onDoubleClick={() => canView && onOpenDetail(user)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                      selectedUserForRow?.id === user.id ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="px-4 py-2 text-slate-600 font-medium text-sm whitespace-nowrap">{user.id}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {getInitials(user.fullName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate text-[13px]">{user.fullName || "-"}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email || user.username || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-block max-w-[140px] truncate rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 align-middle" title={roleText}>
                        {roleText}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-slate-600 text-[13px]">
                      <span className="block truncate max-w-[140px]" title={branchText}>{branchText}</span>
                    </td>
                    <td className="px-4 py-2 text-slate-600 text-[13px]">
                      <span className="block truncate max-w-[130px]" title={teamText}>{teamText}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${STATUS_STYLE[user.status] || "bg-slate-100 text-slate-600"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                        {STATUS_LABEL[user.status] || user.status || "Không xác định"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-slate-500 text-xs whitespace-nowrap">
                      {formatJoinedDate(user.createdAt)}
                    </td>
                    
                    {/* BỌC QUYỀN CÁC NÚT THAO TÁC */}
                    {showActions && (
                      <td className="px-4 py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {canView && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onOpenDetail(user); }}
                              className="p-1.5 text-primary bg-primary/5 hover:bg-primary/15 rounded-lg outline-none transition-colors"
                              title="Xem chi tiết (Alt+V)" type="button"
                            ><Eye size={16} strokeWidth={2} /></button>
                          )}
                          
                          {canUpdate && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onEdit(user.id); }}
                              className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg outline-none transition-colors"
                              title="Sửa (Alt+E)" type="button"
                            ><Edit size={16} strokeWidth={2} /></button>
                          )}

                          {/* ẨN NÚT XÓA NẾU KHÔNG CÓ QUYỀN, NẾU CÓ QUYỀN NHƯNG LÀ CHÍNH MÌNH THÌ DISABLE */}
                          {canDelete && (
                            <button
                              disabled={isSelf}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isSelf) onDelete(user.id);
                              }}
                              className={`p-1.5 rounded-lg outline-none transition-colors ${
                                isSelf 
                                  ? "text-slate-300 bg-slate-50 cursor-not-allowed" 
                                  : "text-red-600 bg-red-50 hover:bg-red-100"
                              }`}
                              title={isSelf ? "Không thể tự xóa bản thân" : "Xóa (Alt+D)"} type="button"
                            ><Trash2 size={16} strokeWidth={2} /></button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}

            {Array.from({ length: emptyRows }).map((_, index) => (
              <tr key={`empty-${index}`}>
                <td className="px-4 py-1.5 text-transparent pointer-events-none select-none"><div className="h-6">_</div></td>
                <td /><td /><td /><td /><td /><td />{showActions && <td />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 bg-slate-50 flex items-center justify-between border-t border-slate-100 shrink-0 z-10 relative">
        <div className="flex items-center gap-3">
          <p className="text-xs text-slate-500 font-medium">
            Hiển thị <span className="font-bold text-slate-800">{users.length}</span> / <span className="font-bold text-slate-800">{totalElements || 0}</span> người dùng
          </p>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-primary font-semibold text-slate-700 cursor-pointer hover:border-slate-300"
          >
            <option value={10}>10 / trang</option><option value={50}>50 / trang</option><option value={100}>100 / trang</option>
          </select>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors outline-none" type="button"
            ><ChevronLeft size={16} /></button>
            {getVisiblePages(currentPage, totalPages).map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs font-bold select-none">...</span>
              ) : (
                <button
                  key={`page-${page}`} onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors outline-none ${
                    currentPage === page ? "bg-primary text-white border-primary" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`} type="button"
                >{page}</button>
              )
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors outline-none" type="button"
            ><ChevronRight size={16} /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTable;