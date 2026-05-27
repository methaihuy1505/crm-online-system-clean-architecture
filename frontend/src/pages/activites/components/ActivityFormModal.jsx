import { useState, useEffect, useRef } from "react";
import api from "../../../lib/api";
import toast from 'react-hot-toast';
import CallFields from "./form-fields/CallFields";
import MeetingFields from "./form-fields/MeetingFields";
import GenericFields from "./form-fields/GenericFields";
import ReferencesFields from "./form-fields/ReferencesFields";

const toDatetimeLocal = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const ActivityFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const isEditMode = Boolean(initialData);

  const getInitialFormState = () => ({
    activityType: "CALL",
    subject: "",
    description: "",
    duration: 0,
    activityDate: toDatetimeLocal(new Date()),
    isCompleted: false,
    isPriority: false,

    // Call Fields
    callType: "OUTBOUND",
    callResult: "",

    // Meeting Fields
    startDate: "",
    endDate: "",
    location: "",

    // Chung cho các trường liên kết
    nextFollowUpDate: "",
    parentType: "LEAD",
    parentId: "",
    taskId: null,
    contactId: null,
    createdBy: "",
    assignedTo: "" // Nhân viên phụ trách nhiệm vụ
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State lưu danh sách nhân viên phụ trách (Đã vá dữ liệu tạm thời thay Backend)
  const [usersList, setUsersList] = useState([]);

  const modalRef = useRef(null);

  // --- LUỒNG VÁ TẠM DỮ LIỆU USER PHỤ TRÁCH (VÌ CHƯA CÓ BACKEND USER) ---
  useEffect(() => {
    if (isOpen) {
      // Vì chưa có Backend User, anh em mình trả đại danh sách cứng tại đây luôn, cực kỳ an toàn
      const mockUsersFromDB = [
        { id: 1, fullName: "Võ Thanh Huy" },
        { id: 2, fullName: "Người quản trị (Admin)" },
        { id: 3, fullName: "Nhân viên kinh doanh #1" }
      ];
      setUsersList(mockUsersFromDB);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,
          activityDate: toDatetimeLocal(initialData.activityDate),
          startDate: toDatetimeLocal(initialData.startDate),
          endDate: toDatetimeLocal(initialData.endDate),
          nextFollowUpDate: toDatetimeLocal(initialData.nextFollowUpDate),
        });
      } else {
        setFormData(getInitialFormState());
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value === "" ? null : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject || !formData.subject.trim()) {
      newErrors.subject = "Chủ đề không được để trống";
    }
    if (!formData.parentId) {
      newErrors.parentId = "Vui lòng chọn đối tượng liên kết";
    }
    if (!formData.createdBy) {
      newErrors.createdBy = "Vui lòng chọn nhân viên tạo nhật ký";
    }
    if (!formData.assignedTo) {
      newErrors.assignedTo = "Vui lòng chọn nhân viên phụ trách nhiệm vụ";
    }

    if (formData.activityType === "CALL") {
      if (!formData.activityDate) newErrors.activityDate = "Ngày gọi không được để trống";
      if (!formData.duration || formData.duration <= 0) newErrors.duration = "Thời lượng phải lớn hơn 0";
      if (!formData.callResult || !formData.callResult.trim()) newErrors.callResult = "Kết quả cuộc gọi không được để trống";
    } else if (formData.activityType === "MEETING") {
      if (!formData.location || !formData.location.trim()) newErrors.location = "Địa điểm không được để trống";
      if (!formData.startDate) newErrors.startDate = "Ngày bắt đầu không được để trống";
      if (!formData.endDate) newErrors.endDate = "Ngày kết thúc không được để trống";
      if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = "Ngày kết thúc phải lớn hơn ngày bắt đầu";
      }
    } else if (formData.activityType === "NOTE") {
      if (!formData.description || !formData.description.trim()) {
        newErrors.description = "Nội dung ghi chú không được để trống";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin nhập.", { style: { fontSize: '11px' } });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        id: isEditMode ? initialData.id : undefined,
        taskId: formData.taskId ? Number(formData.taskId) : null,
        contactId: formData.contactId ? Number(formData.contactId) : null,
        parentId: formData.parentId ? Number(formData.parentId) : null,
        createdBy: formData.createdBy ? Number(formData.createdBy) : null,
        assignedTo: formData.assignedTo ? Number(formData.assignedTo) : null,
        duration: formData.duration ? Number(formData.duration) : 0,
      };

      if (isEditMode) {
        await api.put(`/activities/${initialData.id}`, payload);
        toast.success("Cập nhật nhật ký hoạt động thành công!", { style: { fontSize: '11px' } });
      } else {
        await api.post("/activities", payload);
        toast.success("Tạo mới nhật ký hoạt động thành công!", { style: { fontSize: '11px' } });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu biểu mẫu hoạt động:", error);
      toast.error(error.response?.data?.message || "Lưu hoạt động thất bại!", { style: { fontSize: '11px' } });
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorClass = (fieldName) => (errors[fieldName] ? "border-red-500 bg-red-50/50" : "border-slate-300 focus:ring-blue-500/30");
  const renderError = (fieldName) => errors[fieldName] && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors[fieldName]}</p>;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div ref={modalRef} className="bg-white rounded-[5px] shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] animate-slide-up border border-slate-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center rounded-t-[5px]">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[18px]">
              {isEditMode ? "edit_note" : "add_box"}
            </span>
            {isEditMode ? "Cập nhật nhật ký hoạt động" : "Tạo mới nhật ký hoạt động"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200/60">
            <span className="material-symbols-outlined text-[18px] block">close</span>
          </button>
        </div>

        {/* Body Content */}
        <form id="activityForm" onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 flex-1 text-[11px]">
          
          {/* 1. Chọn loại hoạt động (Chỉ cho phép chọn khi tạo mới) */}
          <div className="space-y-1 max-w-xs">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Loại hoạt động</label>
            <select
              name="activityType"
              value={formData.activityType}
              onChange={handleChange}
              disabled={isEditMode}
              className="w-full px-3 py-2 text-[11px] bg-white border border-slate-300 rounded-[5px] font-bold text-blue-800 outline-none focus:ring-1 focus:ring-blue-500/30 disabled:bg-slate-100 disabled:text-slate-500"
            >
              <option value="CALL">📞 Cuộc gọi (Call)</option>
              <option value="MEETING">🤝 Cuộc họp (Meeting)</option>
              <option value="NOTE">📝 Ghi chú (Note)</option>
              <option value="EMAIL_QUOTE">✉️ Báo giá (Email Quote)</option>
              <option value="EMAIL_TRANSACTION">📩 Email giao dịch</option>
            </select>
          </div>

          {/* 2. Phần các trường liên kết đa hình */}
          <ReferencesFields formData={formData} handleChange={handleChange} errorClass={errorClass} renderError={renderError} />

          {/* 3. Phần điền thông tin chi tiết động dựa theo loại hoạt động */}
          <div className="p-4 border border-slate-100 rounded-[5px] bg-white shadow-sm">
            {formData.activityType === "CALL" && <CallFields formData={formData} handleChange={handleChange} errorClass={errorClass} renderError={renderError} />}
            {formData.activityType === "MEETING" && <MeetingFields formData={formData} handleChange={handleChange} errorClass={errorClass} renderError={renderError} />}
            {["NOTE", "EMAIL_QUOTE", "EMAIL_TRANSACTION"].includes(formData.activityType) && <GenericFields formData={formData} handleChange={handleChange} errorClass={errorClass} renderError={renderError} />}
          </div>

          {/* 4. Trạng thái bổ sung & Ô Nhân viên phụ trách */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50/50 rounded-[5px] border border-slate-200">
            <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-[5px]">
              <input type="checkbox" name="isCompleted" id="isCompleted" checked={formData.isCompleted || false} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded-[3px] cursor-pointer" />
              <label htmlFor="isCompleted" className="font-bold text-slate-600 cursor-pointer select-none">Đã hoàn thành hoạt động</label>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-[5px]">
              <input type="checkbox" name="isPriority" id="isPriority" checked={formData.isPriority || false} onChange={handleChange} className="w-4 h-4 text-amber-500 rounded-[3px] cursor-pointer" />
              <label htmlFor="isPriority" className="font-bold text-slate-600 cursor-pointer select-none text-amber-600">Độ ưu tiên cao (Quan trọng)</label>
            </div>

            {/* Nhân viên phụ trách nhiệm vụ (Đọc mảng dữ liệu đã vá cứng) */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">
                Nhân viên phụ trách nhiệm vụ <span className="text-red-500">*</span>
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 ${errorClass("assignedTo")}`}
              >
                <option value="">-- Chọn nhân viên --</option>
                {usersList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.fullName} (ID: #{item.id})
                  </option>
                ))}
              </select>
              {renderError("assignedTo")}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3 rounded-b-[5px]">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-100 rounded-[5px]">
            Hủy (Esc)
          </button>
          <button type="submit" form="activityForm" disabled={isSubmitting} className="px-6 py-2 bg-blue-800 text-white rounded-[5px] text-[11px] font-bold shadow hover:bg-blue-900 flex items-center gap-2">
            {isSubmitting ? <>Đang lưu...</> : <>Lưu nhật ký</>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ActivityFormModal;
