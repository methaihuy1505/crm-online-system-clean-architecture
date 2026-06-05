import { useState, useEffect, useRef } from "react";
import api from "../../../lib/api";
import toast from 'react-hot-toast';
import { PhoneCall, Users, StickyNote, Receipt, Mail, ChevronDown } from "lucide-react";

import CallFields from "./form-fields/CallFields";
import MeetingFields from "./form-fields/MeetingFields";
import GenericFields from "./form-fields/GenericFields";
import ReferencesFields from "./form-fields/ReferencesFields";

// --- CUSTOM DROPDOWN CHO LOẠI HOẠT ĐỘNG (HỖ TRỢ LUCIDE ICON) ---
const ACTIVITY_TYPES = [
  { value: "CALL", label: "Cuộc gọi (Call)", icon: PhoneCall },
  { value: "MEETING", label: "Cuộc họp (Meeting)", icon: Users },
  { value: "NOTE", label: "Ghi chú (Note)", icon: StickyNote },
  { value: "EMAIL_QUOTE", label: "Báo giá (Quote)", icon: Receipt },
  { value: "EMAIL_TRANSACTION", label: "Email giao dịch", icon: Mail },
];

const ActivityTypeSelect = ({ value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = ACTIVITY_TYPES.find(t => t.value === value) || ACTIVITY_TYPES[0];
  const Icon = selected.icon;

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2.5 text-[12px] bg-white border border-slate-300 rounded-[5px] font-bold flex justify-between items-center transition-all ${disabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : "text-blue-800 hover:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none"}`}
      >
        <div className="flex items-center gap-2">
          <Icon size={14} className={disabled ? "text-slate-400" : "text-blue-600"} strokeWidth={2.5} />
          <span>{selected.label}</span>
        </div>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-[200] w-full mt-1 bg-white border border-slate-200 rounded-[5px] shadow-xl animate-fade-in overflow-hidden">
          {ACTIVITY_TYPES.map((type) => {
            const TypeIcon = type.icon;
            return (
              <div
                key={type.value}
                onClick={() => {
                  onChange({ target: { name: "activityType", value: type.value } });
                  setIsOpen(false);
                }}
                className={`px-3 py-2.5 text-[12px] cursor-pointer flex items-center gap-2 transition-colors ${value === type.value ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50"}`}
              >
                <TypeIcon size={14} className={value === type.value ? "text-blue-600" : "text-slate-400"} strokeWidth={2.5} />
                {type.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};
// --------------------------------------------------------------

const toDatetimeLocal = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const ActivityFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const isEditMode = Boolean(initialData);
  const currentUserId = parseInt(localStorage.getItem("user_id") || "1", 10);

  const getInitialFormState = () => ({
    activityType: "CALL",
    subject: "",
    description: "",
    duration: 0,
    activityDate: toDatetimeLocal(new Date()),
    isCompleted: false,
    isPriority: false,
    callType: "OUTBOUND",
    callResult: "",
    startDate: "",
    endDate: "",
    location: "",
    nextFollowUpDate: "",
    parentType: "LEAD",
    parentId: "",
    taskId: null,
    contactId: null,
    createdBy: currentUserId
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);

  // ĐỒNG BỘ DỮ LIỆU TỪ API (HỖ TRỢ CẢ KIỂU CỘT SNAKE_CASE TỪ DATABASE)
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,
          activityType: initialData.activityType || initialData.activity_type || "CALL",
          parentType: initialData.parentType || initialData.parent_type || "LEAD",
          parentId: initialData.parentId || initialData.parent_id || "",
          taskId: initialData.taskId || initialData.task_id || null,
          contactId: initialData.contactId || initialData.contact_id || null,
          callType: initialData.callType || initialData.call_type || "OUTBOUND",
          callResult: initialData.callResult || initialData.call_result || "",
          location: initialData.location || "",
          subject: initialData.subject || "",
          description: initialData.description || "",
          duration: initialData.duration || 0,
          isCompleted: initialData.isCompleted ?? initialData.is_completed ?? false,
          isPriority: initialData.isPriority ?? initialData.is_priority ?? false,
          activityDate: toDatetimeLocal(initialData.activityDate || initialData.activity_type),
          startDate: toDatetimeLocal(initialData.startDate || initialData.start_date),
          endDate: toDatetimeLocal(initialData.endDate || initialData.end_date),
          nextFollowUpDate: toDatetimeLocal(initialData.nextFollowUpDate || initialData.next_follow_up_date),
          createdBy: initialData.createdBy || initialData.created_by || currentUserId,
        });
      } else {
        setFormData(getInitialFormState());
      }
      setErrors({});
    }
  }, [isOpen, initialData, currentUserId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value === "" ? null : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject || !formData.subject.trim()) newErrors.subject = "Bắt buộc";
    if (!formData.parentId) newErrors.parentId = "Bắt buộc";

    if (formData.activityType === "CALL") {
      if (!formData.activityDate) newErrors.activityDate = "Bắt buộc";
      if (!formData.duration || formData.duration <= 0) newErrors.duration = "> 0";
      if (!formData.callResult || !formData.callResult.trim()) newErrors.callResult = "Bắt buộc";
    } else if (formData.activityType === "MEETING") {
      if (!formData.location || !formData.location.trim()) newErrors.location = "Bắt buộc";
      if (!formData.startDate) newErrors.startDate = "Bắt buộc";
      if (!formData.endDate) newErrors.endDate = "Bắt buộc";
      if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = "Phải sau TG bắt đầu";
      }
    } else if (formData.activityType === "NOTE") {
      if (!formData.description || !formData.description.trim()) newErrors.description = "Bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin nhập.");
      return;
    }

    setIsSubmitting(true);
    try {
      const taskIdVal = formData.taskId || formData.task_id ? Number(formData.taskId || formData.task_id) : null;
      const contactIdVal = formData.contactId || formData.contact_id ? Number(formData.contactId || formData.contact_id) : null;
      const parentIdVal = formData.parentId || formData.parent_id ? Number(formData.parentId || formData.parent_id) : null;

      // FIX LỖI DB KHÔNG ĐỔI: Tạo Payload chứa song song cả camelCase và snake_case để khớp chuẩn DB của bạn
      const payload = {
        ...formData,
        id: isEditMode ? initialData.id : undefined,
        duration: formData.duration ? Number(formData.duration) : 0,
        
        // --- CHUẨN CAMELCASE ---
        taskId: taskIdVal,
        contactId: contactIdVal,
        parentId: parentIdVal,
        activityType: formData.activityType,
        callType: formData.callType,
        callResult: formData.callResult,
        isPriority: formData.isPriority,
        isCompleted: formData.isCompleted,
        activityDate: formData.activityDate,
        nextFollowUpDate: formData.nextFollowUpDate,
        startDate: formData.startDate,
        endDate: formData.endDate,
        createdBy: isEditMode ? (formData.createdBy || formData.created_by) : currentUserId,
        updatedBy: currentUserId,

        // --- CHUẨN SNAKE_CASE (Khớp 100% tên cột Database của bạn) ---
        task_id: taskIdVal,
        contact_id: contactIdVal,
        parent_id: parentIdVal,
        parent_type: formData.parentType,
        activity_type: formData.activityType,
        call_type: formData.callType,
        call_result: formData.callResult,
        is_priority: formData.isPriority,
        is_completed: formData.isCompleted,
        activity_date: formData.activityDate,
        next_follow_up_date: formData.nextFollowUpDate,
        start_date: formData.startDate,
        end_date: formData.endDate,
        created_by: isEditMode ? (formData.createdBy || formData.created_by) : currentUserId,
        updated_by: currentUserId,
      };

      if (isEditMode) await api.put(`/activities/${initialData.id}`, payload);
      else await api.post("/activities", payload);

      toast.success(isEditMode ? "Cập nhật thành công!" : "Tạo mới thành công!");
      onSave();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lưu hoạt động thất bại!";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorClass = (fieldName) => (errors[fieldName] ? "border-red-500 bg-red-50/50" : "border-slate-300 focus:ring-blue-500/30");
  const renderError = (fieldName) => errors[fieldName] && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors[fieldName]}</p>;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col animate-slide-up border border-slate-200">
        
        <div className="p-5 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">
              {isEditMode ? "edit_note" : "add_box"}
            </span>
            {isEditMode ? "Cập nhật nhật ký hoạt động" : "Tạo mới nhật ký hoạt động"}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50">
            <span className="material-symbols-outlined text-[20px] block">close</span>
          </button>
        </div>

        <form id="activityForm" onSubmit={handleSubmit} className="p-6 space-y-6 text-[11px]">
          
          <div className="flex gap-6 items-start">
            <div className="w-1/4 space-y-1.5 pt-5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Loại hoạt động</label>
              <ActivityTypeSelect
                value={formData.activityType}
                onChange={handleChange}
                disabled={isEditMode}
              />
            </div>
            <div className="flex-1">
               {/* FIX HIỂN THỊ DỮ LIỆU CŨ: Map an toàn dữ liệu snake_case sang camelCase trước khi đưa vào ReferencesFields */}
               <ReferencesFields 
                 formData={formData} 
                 handleChange={handleChange} 
                 errorClass={errorClass} 
                 renderError={renderError} 
                 currentActivity={{
                    ...initialData,
                    contactId: initialData?.contactId || initialData?.contact_id,
                    parentId: initialData?.parentId || initialData?.parent_id,
                    taskId: initialData?.taskId || initialData?.task_id
                 }} 
               />
            </div>
          </div>

          <div className="p-5 border border-slate-200 rounded-[5px] bg-white shadow-sm relative mt-2">
            <span className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chi tiết nội dung</span>
            {formData.activityType === "CALL" && <CallFields formData={formData} handleChange={handleChange} errorClass={errorClass} renderError={renderError} />}
            {formData.activityType === "MEETING" && <MeetingFields formData={formData} handleChange={handleChange} errorClass={errorClass} renderError={renderError} />}
            {["NOTE", "EMAIL_QUOTE", "EMAIL_TRANSACTION"].includes(formData.activityType) && <GenericFields formData={formData} handleChange={handleChange} errorClass={errorClass} renderError={renderError} />}
          </div>

          {/* CHỈ CÒN LẠI 2 Ô CHECKBOX (ĐÃ BỎ Ô NHÂN VIÊN PHỤ TRÁCH KHÔNG CÓ TRONG DB) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-slate-50 rounded-[5px] border border-slate-200 items-end">
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 border border-slate-200 rounded-[5px] shadow-sm transition-all hover:border-blue-300">
              <input type="checkbox" name="isCompleted" id="isCompleted" checked={formData.isCompleted || false} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded-[3px] cursor-pointer" />
              <label htmlFor="isCompleted" className="font-bold text-slate-700 cursor-pointer select-none text-[12px]">Đã hoàn thành</label>
            </div>

            <div className="flex items-center gap-3 bg-white px-4 py-2.5 border border-slate-200 rounded-[5px] shadow-sm transition-all hover:border-amber-300">
              <input type="checkbox" name="isPriority" id="isPriority" checked={formData.isPriority || false} onChange={handleChange} className="w-4 h-4 text-amber-500 rounded-[3px] cursor-pointer" />
              <label htmlFor="isPriority" className="font-bold text-amber-700 cursor-pointer select-none text-[12px]">Ưu tiên (Quan trọng)</label>
            </div>
          </div>
        </form>

        <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2.5 text-[12px] font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-[5px] transition-colors">
            Hủy bỏ
          </button>
          <button type="submit" form="activityForm" disabled={isSubmitting} className="px-8 py-2.5 bg-blue-700 text-white rounded-[5px] text-[12px] font-bold shadow-md hover:bg-blue-800 transition-all flex items-center gap-2">
            {isSubmitting ? "Đang lưu..." : "Lưu nhật ký"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ActivityFormModal;