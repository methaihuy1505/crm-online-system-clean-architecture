import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import api from "../../lib/api";

const TaskFormModal = ({ isOpen, onClose, onSave, currentTask }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    startDate: "",
    endDate: "",
    status: "NOT_STARTED",
    assignedTo: "",
    relateType: "",
    relateId: "",
    extensionCount: 0,
    isOverdue: false,
    createdBy: 1 // vì chưa có phân quyền nên id cho mặc định là 1
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const titleInputRef = useRef(null);

  useEffect(() => {
    setErrors({});

    if (currentTask) {
      const parsedStartDate = currentTask.startDate ? currentTask.startDate.slice(0, 16) : "";
      const parsedEndDate = currentTask.endDate ? currentTask.endDate.slice(0, 16) : "";

      setFormData({
        title: currentTask.title || "",
        description: currentTask.description || "",
        priority: currentTask.priority || "MEDIUM",
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        status: currentTask.status || "NOT_STARTED",
        assignedTo: currentTask.assignedTo || "",
        relateType: currentTask.relateType || "",
        relateId: currentTask.relateId || "",
        extensionCount: currentTask.extensionCount || 0,
        isOverdue: currentTask.isOverdue || false,
        createdBy: currentTask.createdBy || 1
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "MEDIUM",
        startDate: "",
        endDate: "",
        status: "NOT_STARTED",
        assignedTo: "",
        relateType: "",
        relateId: "",
        extensionCount: 0,
        isOverdue: false,
        createdBy: 1 // vì chưa có phân quyền nên id cho mặc định là 1
      });
    }
  }, [currentTask, isOpen]);

  // Keyboard Shortcuts for Save (Ctrl+S) and Cancel (Ctrl+H)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSubmit(e); // Trigger form submission
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        onClose(); // Trigger form close
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData, isSaving, onClose, isOpen]); // Add dependencies for handleSubmit and onClose

  const validateForm = () => {
    let newErrors = {};
    let focusRef = null;

    if (!formData.title?.trim()) {
      newErrors.title = "Tiêu đề không được để trống";
      focusRef = titleInputRef;
    } else if (formData.title.length > 60) {
      newErrors.title = "Tiêu đề quá dài (tối đa 60 ký tự)";
      focusRef = titleInputRef;
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = "Hạn chót không được trước thời gian bắt đầu";
      }
    }

    setErrors(newErrors);

    if (focusRef && focusRef.current) {
      focusRef.current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        assignedTo: formData.assignedTo ? parseInt(formData.assignedTo) : null,
        relateId: formData.relateId ? parseInt(formData.relateId) : null,
        extensionCount: parseInt(formData.extensionCount || 0),
      };

      if (currentTask?.id) {
        await api.put(`/tasks/${currentTask.id}`, payload);
      } else {
        await api.post("/tasks", payload);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu Task:", error);
      alert("Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-[11px]">
      <div className="bg-white w-full max-w-4xl rounded-[5px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50 rounded-t-[5px]">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">{currentTask ? "edit_square" : "add_task"}</span>
              {currentTask ? `Cập nhật Công việc #${currentTask.id}` : "Giao việc mới"}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 italic">
              <span className="text-red-500 font-bold">*</span>: Thông tin bắt buộc, không được để rỗng.
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-[5px] transition-colors" title="Hủy bỏ (Ctrl + H)">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form id="taskForm" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Section 1: Thông tin cơ bản */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-blue-800 border-b pb-1 uppercase">Thông tin chung</h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1 md:col-span-4">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">Tiêu đề công việc <span className="text-red-500">*</span></label>
                  <span className={`text-[10px] font-semibold ${formData.title.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>
                    {formData.title.length}/60
                  </span>
                </div>
                <input
                  ref={titleInputRef}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề công việc..."
                  className={`w-full px-2 py-1.5 border rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 transition-all text-[11px] ${errors.title || formData.title.length > 60 ? "border-red-500 bg-red-50" : "border-slate-300 bg-white"}`}
                />
                {errors.title && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.title}</p>}
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">Mức độ ưu tiên <span className="text-red-500">*</span></label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 bg-white text-[11px]"
                >
                  <option value="LOW">Thấp (LOW)</option>
                  <option value="MEDIUM">Trung bình (MEDIUM)</option>
                  <option value="HIGH">Cao (HIGH)</option>
                  <option value="URGENT">Khẩn cấp (URGENT)</option>
                </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">Trạng thái <span className="text-red-500">*</span></label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 bg-white text-[11px]"
                >
                  <option value="NOT_STARTED">Chưa bắt đầu (NOT_STARTED)</option>
                  <option value="IN_PROGRESS">Đang thực hiện (IN_PROGRESS)</option>
                  <option value="PENDING">Đang chờ (PENDING)</option>
                  <option value="COMPLETED">Đã hoàn thành (COMPLETED)</option>
                  <option value="CANCELED">Đã hủy (CANCELED)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">Mô tả chi tiết</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                placeholder="Nhập mô tả chi tiết công việc..."
                className="w-full px-2 py-1.5 border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 transition-all text-[11px] resize-none"
              ></textarea>
            </div>
          </div>

          {/* Section 2: Thời gian & Gia hạn */}
          <div className="space-y-4 mt-2">
            <h4 className="text-sm font-bold text-blue-800 border-b pb-1 uppercase">Thời gian thực hiện</h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">Thời gian bắt đầu</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 text-[11px]"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">Hạn chót (Deadline)</label>
                </div>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-2 py-1.5 border rounded-[5px] outline-none transition-all text-[11px] border-slate-300 focus:ring-1 focus:ring-blue-500 bg-white ${errors.endDate ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.endDate && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.endDate}</p>}
              </div>
            </div>

            {/* Overdue Warning */}
            {formData.isOverdue && (
              <div className="bg-red-50 border border-red-200 rounded-[5px] p-3 flex items-start gap-3 mt-2">
                <span className="material-symbols-outlined text-red-600 mt-0.5">error</span>
                <div>
                  <h5 className="text-[11px] font-bold text-red-800">Cảnh báo Quá hạn</h5>
                  <p className="text-[10px] text-red-600 mt-0.5">Công việc này đã trễ hạn so với thời gian quy định theo thông tin từ Backend.</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Phân công & Liên kết */}
          <div className="space-y-4 mt-2">
            <h4 className="text-sm font-bold text-blue-800 border-b pb-1 uppercase">Phân công & Liên kết</h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-[5px] border border-slate-200">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">Người giao việc</label>
                <input
                  type="number"
                  name="createdBy"
                  value={formData.createdBy}
                  readOnly
                  title="Không thể chỉnh sửa người giao việc"
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-[5px] outline-none bg-slate-100 text-slate-500 cursor-not-allowed text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">Người phụ trách</label>
                <input
                  type="number"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  placeholder="ID Nhân viên..."
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">Loại liên kết</label>
                <select
                  name="relateType"
                  value={formData.relateType}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 bg-white text-[11px]"
                >
                  <option value="">-- Không có --</option>
                  <option value="LEAD">Khách hàng Tiềm năng</option>
                  <option value="CUSTOMER">Khách hàng</option>
                  <option value="OPPORTUNITY">Cơ hội</option>
                  <option value="FEEDBACK">Phản hồi</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">ID Liên kết</label>
                <input
                  type="number"
                  name="relateId"
                  value={formData.relateId}
                  onChange={handleChange}
                  disabled={!formData.relateType}
                  placeholder={formData.relateType ? "Nhập ID..." : "Chọn loại..."}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors text-[11px]"
                />
              </div>
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-slate-50 flex justify-end gap-3 rounded-b-[5px]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2 text-[11px] font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
            title="Hủy bỏ (Ctrl + H)"
          >
            Hủy (Ctrl + H)
          </button>
          <button
            type="submit"
            form="taskForm"
            disabled={isSaving}
            className="px-6 py-2 rounded-[5px] font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-md shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 transition-all text-[11px]"
            title="Lưu công việc (Ctrl + S)"
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                Đang xử lý...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">save</span>
                Ghi nhận (Ctrl + S)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;