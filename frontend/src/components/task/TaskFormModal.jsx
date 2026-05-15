import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import api from "../../lib/api";
import { MOCK_USERS_DATA, MOCK_LEADS_DATA, MOCK_CUSTOMERS_DATA, MOCK_OPPORTUNITIES_DATA} from '../../mockdata/mockdata';

const TaskFormModal = ({ isOpen, onClose, onSave, currentTask }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    startDate: "",
    endDate: "",
    status: "NOT_STARTED",
    assignedTo: MOCK_USERS_DATA[0]?.id || 1, // Default to first mock user
    relateType: "",
    relateId: "",
    extensionCount: 0,
    isOverdue: false,
    createdBy: MOCK_USERS_DATA[0]?.id || 1 // Default to first mock user
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
        assignedTo: currentTask.assignedTo || MOCK_USERS_DATA[0]?.id || 1,
        relateType: currentTask.relateType || "",
        relateId: currentTask.relateId || "",
        extensionCount: currentTask.extensionCount || 0,
        isOverdue: currentTask.isOverdue || false,
        createdBy: currentTask.createdBy || MOCK_USERS_DATA[0]?.id || 1
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "MEDIUM",
        startDate: "",
        endDate: "",
        status: "NOT_STARTED",
        assignedTo: MOCK_USERS_DATA[0]?.id || 1,
        relateType: "",
        relateId: "",
        extensionCount: 0,
        isOverdue: false,
        createdBy: MOCK_USERS_DATA[0]?.id || 1
      });
    }
  }, [currentTask, isOpen]);

  // Keyboard Shortcuts for Save (Ctrl+S) and Cancel (Ctrl+H)
  useEffect(() => {
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
  }, [formData, isSaving, onClose]); // Add dependencies for handleSubmit and onClose

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
    e.preventDefault();
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

  // Helper to get options for relateId dropdown
  const getRelateIdOptions = (relateType) => {
    switch (relateType) {
      case 'LEAD': return MOCK_LEADS_DATA;
      case 'CUSTOMER': return MOCK_CUSTOMERS_DATA;
      case 'OPPORTUNITY': return MOCK_OPPORTUNITIES_DATA;
      default: return [];
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-[5px] shadow-2xl flex flex-col max-h-[90vh]">
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

        <form id="taskForm" onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar text-[11px]">

          <div className="bg-white space-y-4">
            {/* ROW 1: Tiêu đề & Mức độ ưu tiên */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8 space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-600 uppercase">Tiêu đề công việc <span className="text-red-500">*</span></label>
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
                  className={`w-full px-3 py-2 border rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 transition-all text-[11px] ${errors.title || formData.title.length > 60 ? "border-red-500 bg-red-50" : "border-slate-300 bg-white"}`}
                />
                {errors.title && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.title}</p>}
              </div>

              <div className="md:col-span-4 space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase">Mức độ ưu tiên <span className="text-red-500">*</span></label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 bg-white text-[11px]"
                >
                  <option value="LOW">Thấp (LOW)</option>
                  <option value="MEDIUM">Trung bình (MEDIUM)</option>
                  <option value="HIGH">Cao (HIGH)</option>
                  <option value="URGENT">Khẩn cấp (URGENT)</option>
                </select>
              </div>
            </div>

            {/* ROW 2: Trạng thái & Thời gian */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
              <div className="md:col-span-4 space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase">Trạng thái <span className="text-red-500">*</span></label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 bg-white text-[11px]"
                >
                  <option value="NOT_STARTED">Chưa bắt đầu</option>
                  <option value="IN_PROGRESS">Đang thực hiện</option>
                  <option value="PENDING">Đang chờ</option>
                  <option value="COMPLETED">Đã hoàn thành</option>
                  <option value="CANCELED">Đã hủy</option>
                </select>
              </div>

              <div className="md:col-span-4 space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase">Bắt đầu</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 text-[11px]"
                />
              </div>

              <div className="md:col-span-4 space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase flex justify-between">
                  Hạn chót
                  {formData.isOverdue && <span className="text-red-500 bg-red-100 px-1 rounded-[5px] lowercase text-[10px]">Quá hạn</span>}
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-[5px] outline-none transition-all text-[11px] ${errors.endDate ? "border-red-500 bg-red-50" : "border-slate-300 bg-white"}`}
                />
                {errors.endDate && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.endDate}</p>}
              </div>
            </div>

            {/* ROW 3: Mô tả */}
            <div className="space-y-1 pt-2">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Mô tả chi tiết</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                placeholder="Nhập mô tả chi tiết công việc..."
                className="w-full px-3 py-2 border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 transition-all text-[11px] resize-none"
              ></textarea>
            </div>

            {/* ROW 4: Phân công & Liên kết */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-[5px] border border-slate-200 mt-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Người giao việc <span className="text-red-500">*</span></label>
                <select name="createdBy" value={formData.createdBy} onChange={handleChange} className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 ${errors.createdBy ? "border-red-500 bg-red-50" : "border-slate-300 bg-white"}`}>
                  {MOCK_USERS_DATA.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
                {errors.createdBy && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.createdBy}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Người phụ trách</label>
                <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="w-full px-3 py-2 text-[11px] bg-white border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">-- Chọn người phụ trách --</option>
                  {MOCK_USERS_DATA.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Loại liên kết</label>
                <select
                  name="relateType"
                  value={formData.relateType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 bg-white text-[11px]"
                >
                  <option value="">-- Không có --</option>
                  <option value="LEAD">Khách hàng Tiềm năng (LEAD)</option>
                  <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
                  <option value="OPPORTUNITY">Cơ hội (OPPORTUNITY)</option>
                  <option value="FEEDBACK">Phản hồi (FEEDBACK)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">ID Liên kết</label>
                <select name="relateId" value={formData.relateId} onChange={handleChange} disabled={!formData.relateType} className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 ${!formData.relateType ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'border-slate-300 focus:ring-blue-500'}`}>
                  <option value="">-- Chọn ID --</option>
                  {getRelateIdOptions(formData.relateType).map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-white flex justify-end gap-3 rounded-b-[5px]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-100 rounded-[5px] transition-all shadow-sm"
            title="Hủy bỏ (Ctrl + H)"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="taskForm"
            disabled={isSaving}
            className="px-8 py-2 bg-blue-800 text-white rounded-[5px] text-[11px] font-bold shadow hover:bg-blue-900 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
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
                Lưu công việc
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;