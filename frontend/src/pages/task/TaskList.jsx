import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, PlusCircle as Plus, MessageSquare } from 'lucide-react';
import TaskFormModal from "./TaskFormModal";
import TaskNoteSection from "./TaskNoteSection";
import api from '../../lib/api';
import { useNavigate } from "react-router-dom";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // States cho TaskNote Modal
  const [isTaskNoteModalOpen, setIsTaskNoteModalOpen] = useState(false);
  const [selectedTaskIdForNotes, setSelectedTaskIdForNotes] = useState(null);

  const navigate = useNavigate();

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/tasks");
      setTasks(response.data.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách Task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Lắng nghe sự kiện phím tắt
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Bắt sự kiện Ctrl + M để mở form Create
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        openModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (error) {
        console.error("Lỗi khi xóa Task:", error);
        alert("Xóa thất bại");
      }
    }
  };

  const handleQuickUpdate = async (taskId, field, value) => {
  try {
    setIsLoading(true);
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    // 1. Cập nhật State local (UI) để người dùng thấy thay đổi ngay
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === taskId 
        ? { ...task, [field]: value, updatedBy: 1 }
        : task
    ));

    //  Thêm updatedBy vào object gửi lên API
    const updatedTask = { 
      ...taskToUpdate, 
      [field]: value, 
      updatedBy: 1 // Bạn thiếu dòng này ở đây
    };

    console.log(`Cập nhật nhanh ${field} cho Task #${taskId}:`, updatedTask);
    
    // Gửi dữ liệu đã có updatedBy lên server
    await api.put(`/tasks/${taskId}`, updatedTask);

  } catch (error) {
    console.error(`Lỗi khi cập nhật nhanh ${field}:`, error);
    alert("Cập nhật thất bại. Đang tải lại dữ liệu.");
    fetchTasks(); // Rollback dữ liệu nếu lỗi
  } finally {
    setIsLoading(false);
  }
};

  const openModal = (task = null) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const openTaskNoteModal = (taskId) => {
    setSelectedTaskIdForNotes(taskId);
    setIsTaskNoteModalOpen(true);
  };

  const navigateToDetail = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  const getPriorityClasses = (priority) => {
    const config = {
      URGENT: "bg-red-600 text-white border-red-700",
      HIGH: "bg-orange-500 text-white border-orange-600",
      MEDIUM: "bg-blue-500 text-white border-blue-600",
      LOW: "bg-gray-400 text-white border-gray-500",
    };
    return config[priority] || config["LOW"];
  };

  const getStatusClasses = (status, isOverdue) => {
    const config = {
      NOT_STARTED: "bg-slate-200 text-slate-700 border-slate-300",
      IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-300",
      PENDING: "bg-orange-100 text-orange-800 border-orange-300",
      COMPLETED: "bg-green-100 text-green-800 border-green-300",
      CANCELED: "bg-gray-200 text-gray-600 border-gray-300",
    };

    let classes = config[status] || "bg-slate-100 text-slate-700 border-slate-200";

    if (isOverdue) {
       classes += " border-2 !border-red-500 bg-red-50";
    }

    return classes;
  };

  return (
    <div className="p-6 h-full flex flex-col bg-slate-50 text-[11px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Hệ thống Quản lý Công việc (Tasks)
          </h1>
        </div>
        <button
          onClick={() => openModal()}
          title="Tạo hoạt động (Ctrl + M)"
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-[5px] font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Giao việc mới (Ctrl + M)
        </button>
      </div>

      {/* Bảng Dữ liệu */}
      <div className="bg-white rounded-[5px] shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead className="bg-slate-100 sticky top-0 z-10 uppercase text-slate-600 font-bold">
              <tr>
                <th className="px-4 py-4 border-b w-16">ID</th>
                <th className="px-4 py-4 border-b w-1/6">Chủ đề</th>
                <th className="px-4 py-4 border-b text-center">Mức độ</th>
                <th className="px-4 py-4 border-b">Trạng thái</th>
                <th className="px-4 py-4 border-b">Ngày bắt đầu</th>
                <th className="px-4 py-4 border-b">Ngày kết thúc</th>
                <th className="px-4 py-4 border-b text-center">Số lần gia hạn</th>
                <th className="px-4 py-4 border-b">Người giao việc</th>
                <th className="px-4 py-4 border-b">Người phụ trách</th>
                <th className="px-4 py-4 border-b">Liên kết</th>
                <th className="px-4 py-4 border-b text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="11" className="text-center py-10 text-slate-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-10 text-slate-500">
                    Chưa có công việc nào. Hãy tạo mới!
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const isOverdue = task.isOverdue;
                  return (
                  <tr
                    key={task.id}
                    className={`hover:bg-slate-50/80 transition-colors group`}
                  >
                    {/* ID */}
                    <td className="px-4 py-4">
                      <span className="font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">#{task.id}</span>
                    </td>

                    {/* Tiêu đề - Xóa Description, thêm class truncate */}
                    <td className="px-4 py-4 max-w-[200px] whitespace-nowrap truncate">
                      <span className="font-bold text-slate-800" title={task.title}>
                        {task.title}
                      </span>
                    </td>

                    {/* Mức độ */}
                    <td className="px-4 py-4 text-center">
                      <select
                        value={task.priority}
                        onChange={(e) => handleQuickUpdate(task.id, 'priority', e.target.value)}
                        className={`text-[11px] font-black uppercase rounded-[5px] px-2 py-1 outline-none cursor-pointer border appearance-none text-center ${getPriorityClasses(task.priority)}`}
                      >
                        <option value="LOW" className="bg-white text-gray-800">LOW</option>
                        <option value="MEDIUM" className="bg-white text-gray-800">MEDIUM</option>
                        <option value="HIGH" className="bg-white text-gray-800">HIGH</option>
                        <option value="URGENT" className="bg-white text-gray-800">URGENT</option>
                      </select>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-4 py-4">
                      <select
                        value={task.status}
                        onChange={(e) => handleQuickUpdate(task.id, 'status', e.target.value)}
                        className={`text-[11px] font-bold rounded-[5px] px-2 py-1 outline-none cursor-pointer border appearance-none ${getStatusClasses(task.status, isOverdue)}`}
                      >
                        <option value="NOT_STARTED" className="bg-white text-slate-700">NOT_STARTED</option>
                        <option value="IN_PROGRESS" className="bg-white text-slate-700">IN_PROGRESS</option>
                        <option value="PENDING" className="bg-white text-slate-700">PENDING</option>
                        <option value="COMPLETED" className="bg-white text-slate-700">COMPLETED</option>
                        <option value="CANCELED" className="bg-white text-slate-700">CANCELED</option>
                      </select>
                    </td>

                    {/* Ngày bắt đầu */}
                    <td className="px-4 py-4">
                      <div className="text-[11px] text-slate-600 font-medium">
                        {task.startDate ? new Date(task.startDate).toLocaleString("vi-VN", { dateStyle: 'short', timeStyle: 'short' }) : "-"}
                      </div>
                    </td>

                    {/* Ngày kết thúc */}
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div
                          className={`text-[11px] ${isOverdue ? "text-red-600 font-bold" : "text-gray-700"}`}
                        >
                          {task.endDate ? new Date(task.endDate).toLocaleString("vi-VN", { dateStyle: 'short', timeStyle: 'short' }) : "-"}
                        </div>
                        {isOverdue && (
                          <span className="bg-red-100 text-red-700 text-[10px] px-2 py-1 rounded-[5px] ml-2 font-bold inline-block">
                            Quá hạn
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Số lần gia hạn */}
                    <td className="px-4 py-4 text-center">
                      <span className={`text-[11px] font-bold ${task.extensionCount > 0 ? "text-orange-600" : "text-slate-400"}`}>
                        {task.extensionCount || 0}
                      </span>
                    </td>

                    {/* Người giao việc */}
                    <td className="px-4 py-4">
                      <div className="text-[11px] font-semibold text-slate-700">
                        {task.createdBy ? `User #${task.createdBy}` : "-"}
                      </div>
                    </td>

                    {/* Người phụ trách */}
                    <td className="px-4 py-4">
                      <div className="text-[11px] font-semibold text-slate-700">
                        {task.assignedTo ? `User #${task.assignedTo}` : "Chưa gán"}
                      </div>
                    </td>

                    {/* Liên kết */}
                    <td className="px-4 py-4">
                      {task.relateType ? (
                        <div className="text-[11px]">
                          <span className="font-semibold text-blue-700">{task.relateType}</span>
                          <span className="text-slate-500 ml-1">#{task.relateId}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">-</span>
                      )}
                    </td>

                    {/* Hành động */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openTaskNoteModal(task.id)}
                          className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-[5px] transition-colors"
                          title="Ghi chú"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigateToDetail(task.id)}
                          className="p-1.5 hover:bg-green-50 text-green-600 rounded-[5px] transition-colors"
                          title="Chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal(task)}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-[5px] transition-colors"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-[5px] transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchTasks}
        currentTask={currentTask}
      />

      {isTaskNoteModalOpen && (
        <TaskNoteSection
          isOpen={isTaskNoteModalOpen}
          onClose={() => setIsTaskNoteModalOpen(false)}
          taskId={selectedTaskIdForNotes}
        />
      )}

    </div>
  );
};

export default TaskList;