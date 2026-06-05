import React, { useState, useEffect } from "react";
import api from "../../../lib/api";
import toast from "react-hot-toast";
import { X, PhoneCall, Users, StickyNote, Receipt, Mail } from "lucide-react";

const toDatetimeLocal = (date) => {
  const d = date || new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

// ĐÃ THÊM PROP: contacts
const CustomerActivityModal = ({ isOpen, onClose, onSave, customerId, customerName, contacts = [] }) => {
  const currentUserId = parseInt(localStorage.getItem("user_id") || "1", 10);

  const getInitialForm = () => ({
    activityType: "CALL",
    subject: "",
    contactId: "", // THÊM TRƯỜNG NÀY
    description: "",
    duration: 0,
    activityDate: toDatetimeLocal(new Date()),
    callType: "OUTBOUND",
    callResult: "",
    startDate: "",
    endDate: "",
    location: "",
    isCompleted: true, 
    isPriority: false,
  });

  const [formData, setFormData] = useState(getInitialForm());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialForm());
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject?.trim()) newErrors.subject = "Bắt buộc nhập";

    if (formData.activityType === "CALL") {
      if (!formData.activityDate) newErrors.activityDate = "Bắt buộc";
      if (!formData.duration || formData.duration <= 0) newErrors.duration = "> 0";
      if (!formData.callResult?.trim()) newErrors.callResult = "Bắt buộc";
    } else if (formData.activityType === "MEETING") {
      if (!formData.location?.trim()) newErrors.location = "Bắt buộc";
      if (!formData.startDate) newErrors.startDate = "Bắt buộc";
      if (!formData.endDate) newErrors.endDate = "Bắt buộc";
      if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = "Phải sau TG bắt đầu";
      }
    } else if (["NOTE", "EMAIL_QUOTE", "EMAIL_TRANSACTION"].includes(formData.activityType)) {
      if (!formData.activityDate) newErrors.activityDate = "Bắt buộc";
      if (!formData.description?.trim()) newErrors.description = "Bắt buộc nhập nội dung";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setIsSubmitting(true);
    try {
      const contactIdVal = formData.contactId ? Number(formData.contactId) : null;

      const payload = {
        ...formData,
        duration: Number(formData.duration) || 0,
        
        // Chuẩn camelCase
        parentId: Number(customerId),
        parentType: "CUSTOMER", 
        contactId: contactIdVal, // GỬI LÊN API
        createdBy: currentUserId,
        updatedBy: currentUserId,

        // Chuẩn snake_case (Backup cho backend)
        parent_id: Number(customerId),
        parent_type: "CUSTOMER",
        contact_id: contactIdVal, // GỬI LÊN API
        activity_type: formData.activityType,
        call_type: formData.callType,
        call_result: formData.callResult,
        start_date: formData.startDate,
        end_date: formData.endDate,
        is_completed: formData.isCompleted,
        is_priority: formData.isPriority,
        activity_date: formData.activityDate,
        created_by: currentUserId,
        updated_by: currentUserId,
      };

      await api.post("/activities", payload);
      toast.success("Đã ghi nhận hoạt động thành công!");
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi lưu hoạt động!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const errorClass = (field) => errors[field] ? "border-red-500 bg-red-50" : "border-slate-300 focus:border-blue-500";
  const renderErr = (field) => errors[field] && <p className="text-red-500 text-[10px] mt-0.5">{errors[field]}</p>;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[700px] flex flex-col animate-slide-up border border-slate-200">
        
        <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Ghi nhận hoạt động</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Khách hàng: <strong className="text-blue-600">{customerName}</strong></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 p-1 bg-white rounded-lg border border-slate-200 hover:bg-red-50 transition-all outline-none">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 flex flex-wrap gap-2 border-b border-slate-100 bg-white">
          <button type="button" onClick={() => handleChange({ target: { name: 'activityType', value: 'CALL' }})} className={`flex-1 min-w-[100px] py-2 rounded-lg flex justify-center items-center gap-1.5 text-[11px] font-bold transition-all border ${formData.activityType === 'CALL' ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}><PhoneCall size={14} /> Cuộc gọi</button>
          <button type="button" onClick={() => handleChange({ target: { name: 'activityType', value: 'MEETING' }})} className={`flex-1 min-w-[100px] py-2 rounded-lg flex justify-center items-center gap-1.5 text-[11px] font-bold transition-all border ${formData.activityType === 'MEETING' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}><Users size={14} /> Cuộc họp</button>
          <button type="button" onClick={() => handleChange({ target: { name: 'activityType', value: 'NOTE' }})} className={`flex-1 min-w-[100px] py-2 rounded-lg flex justify-center items-center gap-1.5 text-[11px] font-bold transition-all border ${formData.activityType === 'NOTE' ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}><StickyNote size={14} /> Ghi chú</button>
          <button type="button" onClick={() => handleChange({ target: { name: 'activityType', value: 'EMAIL_QUOTE' }})} className={`flex-1 min-w-[100px] py-2 rounded-lg flex justify-center items-center gap-1.5 text-[11px] font-bold transition-all border ${formData.activityType === 'EMAIL_QUOTE' ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}><Receipt size={14} /> Báo giá</button>
          <button type="button" onClick={() => handleChange({ target: { name: 'activityType', value: 'EMAIL_TRANSACTION' }})} className={`flex-1 min-w-[110px] py-2 rounded-lg flex justify-center items-center gap-1.5 text-[11px] font-bold transition-all border ${formData.activityType === 'EMAIL_TRANSACTION' ? 'bg-teal-50 border-teal-200 text-teal-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}><Mail size={14} /> Email G.Dịch</button>
        </div>

        <form id="quickCustomerActivityForm" onSubmit={handleSubmit} className="p-5 space-y-4 text-[12px] bg-slate-50/50">
          
          {/* HÀNG 1: CHỦ ĐỀ & NGƯỜI LIÊN HỆ */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Chủ đề <span className="text-red-500">*</span></label>
              <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Ví dụ: Gọi điện CSKH..." className={`w-full px-3 py-2.5 rounded-lg border outline-none transition-all ${errorClass('subject')}`} />
              {renderErr('subject')}
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Người liên hệ</label>
              <select name="contactId" value={formData.contactId} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none bg-white focus:border-blue-500">
                <option value="">-- Không gán liên hệ --</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} {c.jobTitle ? `(${c.jobTitle})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DYNAMIC FIELDS */}
          {formData.activityType === "CALL" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Thời gian gọi <span className="text-red-500">*</span></label>
                <input type="datetime-local" name="activityDate" value={formData.activityDate} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border outline-none bg-white ${errorClass('activityDate')}`} />
                {renderErr('activityDate')}
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Hướng gọi</label>
                <select name="callType" value={formData.callType} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none bg-white">
                  <option value="OUTBOUND">Gọi đi (Outbound)</option>
                  <option value="INBOUND">Gọi đến (Inbound)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Kết quả <span className="text-red-500">*</span></label>
                <input name="callResult" value={formData.callResult} onChange={handleChange} placeholder="VD: Khách quan tâm, Máy bận..." className={`w-full px-3 py-2.5 rounded-lg border outline-none bg-white ${errorClass('callResult')}`} />
                {renderErr('callResult')}
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Thời lượng (Phút) <span className="text-red-500">*</span></label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border outline-none bg-white ${errorClass('duration')}`} />
                {renderErr('duration')}
              </div>
            </div>
          )}

          {formData.activityType === "MEETING" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <label className="font-bold text-slate-700">Địa điểm <span className="text-red-500">*</span></label>
                <input name="location" value={formData.location} onChange={handleChange} placeholder="Văn phòng VTI, Quán Cafe..." className={`w-full px-3 py-2.5 rounded-lg border outline-none bg-white ${errorClass('location')}`} />
                {renderErr('location')}
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Bắt đầu <span className="text-red-500">*</span></label>
                <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border outline-none bg-white ${errorClass('startDate')}`} />
                {renderErr('startDate')}
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Kết thúc <span className="text-red-500">*</span></label>
                <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border outline-none bg-white ${errorClass('endDate')}`} />
                {renderErr('endDate')}
              </div>
            </div>
          )}

          {["NOTE", "EMAIL_QUOTE", "EMAIL_TRANSACTION"].includes(formData.activityType) && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Ngày thực hiện <span className="text-red-500">*</span></label>
                <input type="datetime-local" name="activityDate" value={formData.activityDate} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border outline-none bg-white ${errorClass('activityDate')}`} />
                {renderErr('activityDate')}
              </div>
            </div>
          )}

          <div className="space-y-1.5 pt-2">
            <label className="font-bold text-slate-700">
              Chi tiết / Nội dung {["NOTE", "EMAIL_QUOTE", "EMAIL_TRANSACTION"].includes(formData.activityType) && <span className="text-red-500">*</span>}
            </label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Nhập nội dung chi tiết trao đổi..." className={`w-full px-3 py-2.5 rounded-lg border outline-none resize-none bg-white ${errorClass('description')}`}></textarea>
            {renderErr('description')}
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
              <input type="checkbox" name="isCompleted" checked={formData.isCompleted} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" /> Đã hoàn thành
            </label>
            <label className="flex items-center gap-2 font-bold text-amber-700 cursor-pointer">
              <input type="checkbox" name="isPriority" checked={formData.isPriority} onChange={handleChange} className="w-4 h-4 text-amber-500 rounded" /> Đánh dấu quan trọng
            </label>
          </div>

        </form>

        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors outline-none">Hủy bỏ</button>
          <button type="submit" form="quickCustomerActivityForm" disabled={isSubmitting} className="px-6 py-2.5 bg-primary text-white rounded-lg text-xs font-bold shadow-md hover:bg-blue-800 transition-all outline-none">{isSubmitting ? "Đang lưu..." : "Lưu hoạt động"}</button>
        </div>

      </div>
    </div>
  );
};

export default CustomerActivityModal;