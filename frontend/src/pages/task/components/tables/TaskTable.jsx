import React from "react";
import {
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const TaskTable = ({
  tasks,
  isLoading,
  navigate,
  openModal,
  handleDelete,
  handleOpenNotesSection,
  handleQuickUpdateStatus,
  handleQuickUpdatePriority,
  currentPage,
  totalPages,
  totalElements,
  setCurrentPage,
  pageSize,
  setPageSize,
  onRowClick,
  tableContainerRef,
  selectedTask,
  onOpenFilter,
  canView,
  canUpdate,
  canDelete,
  currentUserId,
}) => {
  const MIN_VISIBLE_ROWS = 10;
  const emptyRows = Math.max(0, MIN_VISIBLE_ROWS - (tasks?.length || 0));

  const getVisiblePages = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3)
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm flex flex-col border border-slate-200 h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">
          Danh sách Nhiệm vụ
        </h3>
        <button
          onClick={onOpenFilter}
          className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium shadow-sm outline-none"
        >
          <Filter size={16} strokeWidth={2.5} /> Bộ lọc
        </button>
      </div>

      <div
        ref={tableContainerRef}
        className="flex-1 overflow-auto custom-scrollbar relative"
      >
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 z-20 shadow-sm ring-1 ring-slate-100">
            <tr className="bg-white">
              <th className="sticky top-0 bg-white px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Tiêu đề / Liên kết
              </th>
              <th className="sticky top-0 bg-white px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b text-center">
                Mức độ
              </th>
              <th className="sticky top-0 bg-white px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b text-center">
                Trạng thái
              </th>
              <th className="sticky top-0 bg-white px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Hạn chót
              </th>
              <th className="sticky top-0 bg-white px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Người giao
              </th>
              <th className="sticky top-0 bg-white px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                Người nhận
              </th>
              <th className="sticky top-0 bg-white px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-12 text-center text-slate-500 font-medium italic"
                >
                  Đang tải công việc phân hệ nhiệm vụ...
                </td>
              </tr>
            ) : !tasks || tasks.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-12 text-center text-slate-500 font-medium"
                >
                  Không tìm thấy công việc nào phù hợp điều kiện.
                </td>
              </tr>
            ) : (
              tasks.map((task, index) => {
                
                const isNewAssignedTask = task.status === "NOT_STARTED" && task.assignedTo === currentUserId && task.createdBy !== currentUserId;

                const rowBgClass = selectedTask?.id === task.id ? "bg-primary/5 ring-1 ring-primary/20" : isNewAssignedTask ? "bg-blue-50/70 hover:bg-blue-50" : "bg-white hover:bg-slate-50";

                return (
                  <tr
                    key={task.id}
                    data-index={index}
                    onClick={() => onRowClick(task, index)}
                    onDoubleClick={() => canView && navigate(`/tasks/${task.id}`)}
                    className={`transition-colors group cursor-pointer ${rowBgClass}`}
                  >
                    <td className="px-4 py-2 whitespace-nowrap relative">
                      
                      {isNewAssignedTask && (
                         <span 
                           className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_4px_rgba(239,68,68,0.8)] animate-pulse"
                           title="Công việc mới được sếp giao"
                         ></span>
                      )}

                      <div className="flex items-center gap-2 pl-2">
                        <CheckCircle2 size={16} className={`shrink-0 ${task.status === "COMPLETED" ? "text-emerald-500" : "text-slate-300"}`} />
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded shrink-0">#{task.id}</span>
                        
                        <span className={`text-sm font-bold truncate max-w-[200px] ${task.status === "COMPLETED" ? "text-slate-400 line-through" : isNewAssignedTask ? "text-blue-900" : "text-slate-900"}`}>
                          {task.title}
                        </span>
                        
                        {task.relateName && (
                          <span className="text-[10px] font-medium bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded truncate max-w-[150px] text-slate-600 shrink-0">{task.relateName}</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      <select
                        onClick={(e) => e.stopPropagation()}
                        disabled={!canUpdate}
                        value={task.priority || "MEDIUM"}
                        onChange={(e) => {
                          if (typeof handleQuickUpdatePriority === "function")
                            handleQuickUpdatePriority(task, e.target.value);
                        }}
                        className={`px-2 py-1 text-[11px] font-bold rounded-[5px] border outline-none disabled:opacity-70 disabled:cursor-not-allowed ${!canUpdate ? "cursor-not-allowed" : "cursor-pointer"} ${task.priority === "HIGH" || task.priority === "URGENT" ? "text-red-700 bg-red-50 border-red-200" : task.priority === "MEDIUM" ? "text-amber-700 bg-amber-50 border-amber-200" : "text-slate-600 bg-slate-50 border-slate-200"}`}
                      >
                        <option value="LOW">Thấp</option>
                        <option value="MEDIUM">Trung bình</option>
                        <option value="HIGH">Cao</option>
                        <option value="URGENT">Khẩn cấp</option>
                      </select>
                    </td>

                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      <select
                        onClick={(e) => e.stopPropagation()}
                        disabled={!canUpdate}
                        value={task.status || "NOT_STARTED"}
                        onChange={(e) => {
                          if (typeof handleQuickUpdateStatus === "function")
                            handleQuickUpdateStatus(task, e.target.value);
                        }}
                        className={`px-2 py-1 text-[11px] font-semibold border rounded-[5px] outline-none disabled:opacity-70 disabled:cursor-not-allowed ${!canUpdate ? "cursor-not-allowed" : "cursor-pointer"} ${task.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : task.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-700 border-blue-200" : task.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" : task.status === "CANCELED" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}
                      >
                        <option value="NOT_STARTED">Chưa bắt đầu</option>
                        <option value="IN_PROGRESS">Đang làm</option>
                        <option value="PENDING">Đang chờ</option>
                        <option value="COMPLETED">Đã xong</option>
                        <option value="CANCELED">Đã hủy</option>
                      </select>
                    </td>

                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${task.isOverdue && task.status !== "COMPLETED" ? "text-red-600" : "text-slate-700"}`}
                        >
                          {task.endDate
                            ? new Date(task.endDate).toLocaleDateString("vi-VN")
                            : "---"}
                        </span>
                        {task.isOverdue && task.status !== "COMPLETED" && (
                          <span className="text-[10px] text-red-600 font-bold bg-red-50 border border-red-200 px-1.5 py-0.5 rounded shrink-0">
                            Quá hạn
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-2 text-sm text-slate-600 font-medium whitespace-nowrap truncate max-w-[120px]">
                      {task.createdByName || "Hệ thống tự động"}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-600 font-medium whitespace-nowrap truncate max-w-[120px]">
                      {task.assignedToName || "Chưa phân phối"}
                    </td>

                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenNotesSection(task.id);
                          }}
                          className="p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg outline-none"
                          title="Thảo luận"
                        >
                          <MessageSquare size={16} />
                        </button>
                        {canView && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/tasks/${task.id}`);
                            }}
                            className="p-1.5 text-primary bg-primary/5 hover:bg-primary/15 rounded-lg outline-none"
                            title="Chi tiết (Alt+V)"
                          >
                            <Eye size={16} strokeWidth={2} />
                          </button>
                        )}
                        {canUpdate && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(task);
                            }}
                            className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg outline-none"
                            title="Sửa (Alt+E)"
                          >
                            <Edit size={16} strokeWidth={2} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(task.id);
                            }}
                            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg outline-none"
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
            {Array.from({ length: emptyRows }).map((_, idx) => (
              <tr key={`empty-${idx}`}>
                <td className="px-4 py-2 select-none text-transparent whitespace-nowrap">
                  <div className="h-7">_</div>
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

      <div className="px-6 py-3 bg-slate-50 flex items-center justify-between border-t border-slate-100 shrink-0 z-10 relative">
        <div className="flex items-center gap-3">
          <p className="text-xs text-slate-500 font-medium">
            Hiển thị{" "}
            <span className="font-bold text-slate-800">
              {tasks?.length || 0}
            </span>{" "}
            /{" "}
            <span className="font-bold text-slate-800">
              {totalElements || 0}
            </span>{" "}
            task
          </p>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none font-semibold text-slate-700 cursor-pointer hover:border-slate-300"
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
            {getVisiblePages(currentPage, totalPages).map((p, idx) =>
              p === "..." ? (
                <span
                  key={`ell-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs font-bold select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${p}`}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold outline-none ${currentPage === p ? "bg-primary text-white border-primary" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  {p}
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
