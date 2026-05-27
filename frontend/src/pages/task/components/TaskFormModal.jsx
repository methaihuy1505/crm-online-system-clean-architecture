import React, { useState, useEffect } from "react";
import api from "../../../lib/api";
import toast from 'react-hot-toast';
import TaskBasicFields from "./form-fields/TaskBasicFields";
import TaskReferencesFields from "./form-fields/TaskReferencesFields";

const TaskFormModal = ({ isOpen, onClose, onSave, currentTask }) => {
  const isEditMode = Boolean(currentTask);

  const getInitialFormState = () => ({
    title: "",
    description: "",
    priority: "MEDIUM",
    startDate: "",
    endDate: "",
    status: "NOT_STARTED",
    assignedTo: "",        
    assignedToName: "",    
    relateType: "",
    relateId: "",
    extensionCount: 0,
    isOverdue: false,
    createdBy: 1,          // Mặc định ID = 1
    createdByName: "",     
    updatedBy: 1           // Mặc định ID = 1 
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSubmit(e);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, formData, isSaving, onClose]);

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
        assignedToName: currentTask.assignedToName || "", 
        relateType: currentTask.relateType || "",
        relateId: currentTask.relateId || "",
        extensionCount: currentTask.extensionCount || 0,
        isOverdue: currentTask.isOverdue || false,
        createdBy: currentTask.createdBy || 1,
        createdByName: currentTask.createdByName || "",     
        updatedBy: 1 // Gán cứng ID = 1 khi ở chế độ chỉnh sửa
      });
    } else {
      setFormData(getInitialFormState());
    }
  }, [currentTask, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.title || !formData.title.trim()) tempErrors.title = "Tiêu đề công việc không được để trống.";
    if (!formData.startDate) tempErrors.startDate = "Vui lòng chọn ngày bắt đầu.";
    if (!formData.endDate) tempErrors.endDate = "Vui lòng chọn ngày kết thúc.";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      tempErrors.endDate = "Hạn chót phải lớn hơn ngày bắt đầu.";
    }
    if (formData.relateType && !formData.relateId) {
      tempErrors.relateId = "Vui lòng chọn đối tượng cụ thể.";
    }
    if (!formData.assignedTo) {
      tempErrors.assignedTo = "Người phụ trách không được để trống.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc.", { style: { fontSize: '11px' } });
      return;
    }

    setIsSaving(true);
    
    // ĐÓNG GÓI PAYLOAD GỬI LÊN SERVER
    const payload = {
      ...formData,
      assignedTo: formData.assignedTo ? parseInt(formData.assignedTo, 10) : null,
      relateId: formData.relateId ? parseInt(formData.relateId, 10) : null,
      relateType: formData.relateType || null,
      extensionCount: parseInt(formData.extensionCount, 10) || 0,
      
      // Gán cứng giá trị ID số thực tế 
      createdBy: formData.createdBy ? parseInt(formData.createdBy, 10) : 1,
      updatedBy: 1 
    };

    try {
      if (isEditMode) {
        await api.put(`/tasks/${currentTask.id}`, payload);
        toast.success("Cập nhật công việc thành công!", { style: { fontSize: '11px' } });
      } else {
        await api.post("/tasks", payload);
        toast.success("Tạo mới công việc thành công!", { style: { fontSize: '11px' } });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu công việc:", error);
      toast.error(error.response?.data?.message || "Lưu công việc thất bại!", { style: { fontSize: '11px' } });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const renderError = (field) => errors[field] && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors[field]}</p>;
  const errorClass = (field) => errors[field] ? "border-red-500 bg-red-50/50" : "border-slate-300";

  const fieldProps = { formData, handleChange, errorClass, renderError };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-[11px]">
      <div className="bg-white w-full max-w-2xl rounded-[5px] shadow-xl flex flex-col max-h-[90vh] border border-slate-200">
        
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center rounded-t-[5px]">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">assignment_turned_in</span>
              {isEditMode ? `Cập nhật công việc #${currentTask.id}` : "Giao việc mới"}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 italic">
              <span className="text-red-500 font-bold">*</span>: Thông tin bắt buộc, không được để rỗng.
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-[5px] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form id="taskForm" onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          <TaskBasicFields {...fieldProps} />
          <TaskReferencesFields {...fieldProps} />
        </form>

        <div className="px-6 py-4 border-t bg-white flex justify-end gap-3 rounded-b-[5px]">
          <button type="button" onClick={onClose} className="px-5 py-2 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-100 rounded-[5px] transition-all shadow-sm">
            Hủy bỏ (Esc)
          </button>
          <button type="submit" form="taskForm" disabled={isSaving} className="px-8 py-2 bg-blue-800 text-white rounded-[5px] text-[11px] font-bold shadow hover:bg-blue-900 flex items-center gap-2">
            {isSaving ? <>Đang xử lý...</> : <>Ghi nhận (Alt + S)</>}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default TaskFormModal;
