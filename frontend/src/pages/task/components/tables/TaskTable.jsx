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
      {/* HEADER BẢNG */}
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

      {/* VÙNG CHỨA DỮ LIỆU CÓ THỂ CUỘN NGANG & DỌC */}
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
                  className="px-4 py-12 text-center text-slate-500 font-medium"
                >
                  Đang tải công việc...
                </td>
              </tr>
            ) : !tasks || tasks.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-12 text-center text-slate-500 font-medium"
                >
                  Không tìm thấy công việc nào.
                </td>
              </tr>
            ) : (
              tasks.map((task, index) => (
                <tr
                  key={task.id}
                  data-index={index}
                  onClick={() => onRowClick(task, index)}
                  onDoubleClick={() => navigate(`/tasks/${task.id}`)}
                  className={`hover:bg-slate-50 transition-colors group cursor-pointer ${selectedTask?.id === task.id ? "bg-primary/5" : ""}`}
                >
                  {/* TIÊU ĐỀ: Ép trên 1 dòng ngang */}
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        size={16}
                        className={`shrink-0 ${task.status === "COMPLETED" ? "text-emerald-500" : "text-slate-300"}`}
                      />
                      <span className="font-mono text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
                        #{task.id}
                      </span>
                      <span
                        className={`text-sm font-bold truncate max-w-[200px] ${task.status === "COMPLETED" ? "text-slate-400 line-through" : "text-slate-900"}`}
                      >
                        {task.title}
                      </span>
                      {task.relateName && (
                        <span className="text-[10px] font-medium bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded truncate max-w-[150px] text-slate-600 shrink-0">
                          {task.relateName}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* MỨC ĐỘ: Quick Update */}
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    <select
                      onClick={(e) => e.stopPropagation()}
                      value={task.priority || "MEDIUM"}
                      onChange={(e) =>
                        handleQuickUpdatePriority(task, e.target.value)
                      }
                      className={`px-2 py-1 text-[11px] font-bold rounded-[5px] border cursor-pointer outline-none ${
                        task.priority === "HIGH"
                          ? "text-red-700 bg-red-50 border-red-200"
                          : task.priority === "MEDIUM"
                            ? "text-amber-700 bg-amber-50 border-amber-200"
                            : "text-slate-600 bg-slate-50 border-slate-200"
                      }`}
                    >
                      <option value="LOW">Thấp</option>
                      <option value="MEDIUM">Trung bình</option>
                      <option value="HIGH">Cao</option>
                    </select>
                  </td>

                  {/* TRẠNG THÁI: Quick Update */}
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    <select
                      onClick={(e) => e.stopPropagation()}
                      value={task.status || "NOT_STARTED"}
                      onChange={(e) =>
                        handleQuickUpdateStatus(task, e.target.value)
                      }
                      className={`px-2 py-1 text-[11px] font-semibold border rounded-[5px] cursor-pointer outline-none ${
                        task.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : task.status === "IN_PROGRESS"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : task.status === "DEFERRED"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : task.status === "CANCELED"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      <option value="NOT_STARTED">Chưa bắt đầu</option>
                      <option value="IN_PROGRESS">Đang làm</option>
                      <option value="COMPLETED">Đã xong</option>
                      <option value="DEFERRED">Tạm hoãn</option>
                      <option value="CANCELED">Đã hủy</option>
                    </select>
                  </td>

                  {/* HẠN CHÓT: Ép trên 1 dòng ngang */}
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

                  {/* NGƯỜI GIAO */}
                  <td className="px-4 py-2 text-sm text-slate-600 font-medium whitespace-nowrap truncate max-w-[120px]">
                    {task.createdByName || "Hệ thống"}
                  </td>

                  {/* NGƯỜI NHẬN */}
                  <td className="px-4 py-2 text-sm text-slate-600 font-medium whitespace-nowrap truncate max-w-[120px]">
                    {task.assignedToName || "Chưa giao"}
                  </td>

                  {/* THAO TÁC */}
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    {/* Đã xóa opacity-0 và group-hover:opacity-100 */}
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
                    </div>
                  </td>
                </tr>
              ))
            )}
            {/* DÒNG TRỐNG GIỮ UI (7 cột) */}
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

      {/* FOOTER BẢNG */}
      <div className="px-6 py-3 bg-slate-50 flex items-center justify-between border-t border-slate-100 shrink-0 z-10 relative">
        <div className="flex items-center gap-3">
          <p className="text-xs text-slate-500 font-medium">
            Hiển thị{" "}
            <span className="font-bold text-slate-800">{tasks.length}</span> /{" "}
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
