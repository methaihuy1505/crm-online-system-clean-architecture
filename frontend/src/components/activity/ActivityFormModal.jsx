import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import api from '../../lib/api';

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
    activityType: 'CALL',
    subject: '',
    description: '',
    duration: 0,
    activityDate: toDatetimeLocal(new Date()),
    isCompleted: false,
    isPriority: false,

    // Call
    callType: 'OUTBOUND',
    callResult: '',

    // Meeting
    startDate: '',
    endDate: '',
    location: '',

    // Chung cho Call 
    nextFollowUpDate: '',

    // References
    parentType: 'LEAD',
    parentId: '',
    contactId: '',
    taskId: '',

    // Default assignment
    assignedTo: 1,
    createdBy: 1, // Đã thêm
    updatedBy: 1
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
        if (isEditMode && initialData) {
            setFormData({
                ...getInitialFormState(),
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
  }, [initialData, isEditMode, isOpen]);

  // Lắng nghe sự kiện phím tắt Ctrl+S hoặc Cmd+S và Ctrl+H hoặc Cmd+H
  useEffect(() => {
    if (!isOpen) return; // Chỉ bắt sự kiện khi form đang mở

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSubmit(e); // Gọi hàm submit
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        onClose(); // Đóng modal
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, formData, isSubmitting]); // Thêm dependencies cần thiết

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;

    if (name === 'subject' && val.length > 60) return;
    if (name === 'description' && val.length > 500) return;
    if (name === 'callResult' && val.length > 50) return;
    if (name === 'location' && val.length > 150) return;

    setFormData(prev => ({
        ...prev,
        [name]: val
    }));

    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleTypeSelect = (type) => {
    if (isEditMode) return; 
    setFormData(prev => ({
        ...getInitialFormState(),
        activityType: type,
        activityDate: prev.activityDate,
        parentType: prev.parentType,
        parentId: prev.parentId,
        createdBy: prev.createdBy
    }));
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    // =========================================================
    // LOGIC RÀNG BUỘC (VALIDATION)
    // =========================================================
    
    // 1. RÀNG BUỘC CHUNG TẤT CẢ CÁC TAB
    if (!formData.subject || !formData.subject.trim()) {
        newErrors.subject = 'Chủ đề không được để trống.';
    }
    if (!formData.createdBy) {
        newErrors.createdBy = 'Người tạo (Created By) không được để trống.';
    }
    if(formData.parentType === '') {
        newErrors.parentType = 'Loại đối tượng không được để trống.';
    }
    if (!formData.parentId) {
        newErrors.parentId = 'ID Đối tượng không được để trống.';
    }

    // 2. RÀNG BUỘC THEO TỪNG LOẠI
    switch (formData.activityType) {
        case 'CALL':
            if (!formData.activityDate) newErrors.activityDate = 'Ngày gọi không được để trống.';
            if (!formData.callType) newErrors.callType = 'Loại cuộc gọi không được để trống.';
            if (!formData.callResult || !formData.callResult.trim()) newErrors.callResult = 'Kết quả cuộc gọi không được để trống.';
            if (parseInt(formData.duration, 10) <= 0) newErrors.duration = 'Thời lượng cuộc gọi phải lớn hơn 0.';
            break;  

        case 'MEETING':
            if (!formData.location || !formData.location.trim()) newErrors.location = 'Địa điểm không được để trống.';
            if (!formData.startDate) newErrors.startDate = 'Ngày bắt đầu không được để trống.';
            if (!formData.endDate) newErrors.endDate = 'Ngày kết thúc không được để trống.';
            
            // Logic start < end
            if (formData.startDate && formData.endDate) {
                if (new Date(formData.startDate).getTime() >= new Date(formData.endDate).getTime()) {
                    newErrors.endDate = 'Ngày kết thúc phải lớn hơn ngày bắt đầu.';
                }
            }
            break;

        case 'NOTE':
            if (!formData.activityDate) newErrors.activityDate = 'Ngày ghi chú không được để trống.';
            if (!formData.description || !formData.description.trim()) newErrors.description = 'Nội dung ghi chú (Mô tả) không được để trống.';
            break;

        case 'EMAIL_QUOTE':
        case 'EMAIL_TRANSACTION':
            if (!formData.activityDate) newErrors.activityDate = 'Ngày gửi Email không được để trống.';
            break;
            
        default:
            break;
    }
    // =========================================================
    // KẾT THÚC LOGIC RÀNG BUỘC
    // =========================================================

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert("Vui lòng kiểm tra lại các trường bắt buộc!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
        setTimeout(() => {
            const firstErrorField = formRef.current?.querySelector('.border-red-500');
            if (firstErrorField) firstErrorField.focus();
        }, 100);
        return;
    }

    setIsSubmitting(true);

    const payload = {
        ...formData,
        duration: parseInt(formData.duration, 10) || 0,
        parentId: parseInt(formData.parentId, 10) || 1,
        contactId: formData.contactId ? parseInt(formData.contactId, 10) : null,
        taskId: formData.taskId ? parseInt(formData.taskId, 10) : null,
        assignedTo: parseInt(formData.assignedTo, 10) || 1,
        createdBy: parseInt(formData.createdBy, 10) || 1,
        updatedBy: parseInt(formData.updatedBy, 10) || 1,
    };

    // Chuẩn hóa null cho Date nếu trống để Spring Boot không lỗi
    if(!payload.startDate) payload.startDate = null;
    if(!payload.endDate) payload.endDate = null;
    if(!payload.nextFollowUpDate) payload.nextFollowUpDate = null;

    try {
      if (isEditMode) {
          await api.put(`/activities/${initialData.id}`, payload);
      } else {
          await api.post("/activities", payload);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Lỗi khi lưu hoạt động: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const renderError = (field) => errors[field] && <p className="text-red-500 text-[11px] mt-1 font-medium animate-pulse">{errors[field]}</p>;
  const errorClass = (field) => errors[field] ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/30';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* TĂNG CHIỀU RỘNG TỪ max-w-2xl (42rem = 672px) LÊN max-w-4xl (64rem = 1024px) ĐỂ FORM RỘNG VÀ THOẢI MÁI HƠN */}
      <div className="bg-white w-full max-w-4xl rounded-[5px] shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center rounded-t-[5px]">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">event_note</span>
              Quản lý các hoạt động chăm sóc
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 italic">
               <span className="text-red-500 font-bold">*</span>: Thông tin bắt buộc, không được để rỗng.
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-[5px] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form ref={formRef} id="activityForm" onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar text-[11px]">

          {/* LOẠI HOẠT ĐỘNG */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Loại hoạt động</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {['CALL', 'MEETING', 'NOTE', 'EMAIL_QUOTE', 'EMAIL_TRANSACTION'].map(type => {
                const isActive = formData.activityType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    disabled={isEditMode}
                    className={`py-2 px-1 text-[11px] font-bold rounded-[5px] border transition-all duration-200 truncate ${
                      isActive
                      ? 'bg-blue-800 text-white border-blue-800 shadow-md ring-2 ring-blue-800/20 ring-offset-1'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    } ${isEditMode && !isActive ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''} ${isEditMode && isActive ? 'cursor-default' : ''}`}
                    title={type.replace('_', ' ')}
                  >
                    {type.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC FIELDS BASED ON TYPE */}
          <div className="bg-white space-y-4">

              {/* --- CALL --- */}
              {formData.activityType === 'CALL' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Chủ đề và Mô tả trên cùng 1 hàng */}
                      <div className="md:col-span-6 space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">Chủ đề cuộc gọi <span className="text-red-500">*</span></label>
                        <input name="subject" value={formData.subject} onChange={handleChange} className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass('subject')}`} />
                        {renderError('subject')}
                      </div>
                      <div className="md:col-span-6 space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">Nội dung chi tiết</label>
                        <input name="description" value={formData.description} onChange={handleChange} placeholder="Nhập ghi chú..." className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass('description')}`} />
                        {renderError('description')}
                      </div>

                      {/* Các trường nhỏ ở dòng thứ 2 */}
                      <div className="md:col-span-4 space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">Loại <span className="text-red-500">*</span></label>
                        <select name="callType" value={formData.callType} onChange={handleChange} className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass('callType')}`}>
                            <option value="INBOUND">Đến (Inbound)</option>
                            <option value="OUTBOUND">Đi (Outbound)</option>
                        </select>
                        {renderError('callType')}
                      </div>
                      <div className="md:col-span-4 space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">Thời lượng (Phút) <span className="text-red-500">*</span></label>
                        <input type="number" name="duration" value={formData.duration} onChange={handleChange} className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass('duration')}`} />
                        {renderError('duration')}
                      </div>
                      <div className="md:col-span-4 space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">Kết quả <span className="text-red-500">*</span></label>
                        <input name="callResult" value={formData.callResult} onChange={handleChange} className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass('callResult')}`} />
                        {renderError('callResult')}
                      </div>
                  </div>
              )}

              {/* --- MEETING --- */}
              {formData.activityType === 'MEETING' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Chủ đề và Địa điểm trên cùng 1 hàng */}
                      <div className="md:col-span-6 space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">Chủ đề cuộc họp <span className="text-red-500">*</span></label>
                        <input name="subject" value={formData.subject} onChange={handleChange} className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass('subject')}`} />
                        {renderError('subject')}
                      </div>
                      <div className="md:col-span-6 space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">Địa điểm <span className="text-red-500">*</span></label>
                        <input name="location" value={formData.location} onChange={handleChange} className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass('location')}`} />
                        {renderError('location')}
                      </div>

                      {/* Ngày bắt đầu và kết thúc trên dòng thứ 2 */}
                      <div className="md:col-span-6 space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">Ngày bắt đầu <span className="text-red-500">*</span></label>
                        <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass('startDate')}`} />
                        {renderError('startDate')}
                      </div>
                      <div className="md:col-span-6 space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">Ngày kết thúc <span className="text-red-500">*</span></label>
                        <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass('endDate')}`} />
                        {renderError('endDate')}
                      </div>

                      {/* Nội dung chi tiết trên dòng thứ 3 (Do meeting cần nhập nhiều thông tin nên dùng textarea rộng) */}
                      <div className="md:col-span-12 space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">Nội dung cuộc họp</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="2"
                          className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all resize-none ${errorClass('description')}`}
                        ></textarea>
                      </div>
                  </div>
              )}

              {/* --- NOTE & EMAIL --- */}
              {['NOTE', 'EMAIL_QUOTE', 'EMAIL_TRANSACTION'].includes(formData.activityType) && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Chủ đề và Nội dung trên cùng 1 hàng */}
                      <div className="md:col-span-4 space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">Chủ đề / Tiêu đề <span className="text-red-500">*</span></label>
                        <input name="subject" value={formData.subject} onChange={handleChange} className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass('subject')}`} />
                        {renderError('subject')}
                      </div>
                      <div className="md:col-span-8 space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">Nội dung chi tiết {formData.activityType === 'NOTE' && <span className="text-red-500">*</span>}</label>
                        <input name="description" value={formData.description} onChange={handleChange} className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass('description')}`} />
                        {renderError('description')}
                      </div>
                  </div>
              )}

              {/* CHUNG: THỜI GIAN & TRẠNG THÁI */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-slate-100 mt-4">
                 <div className="md:col-span-4 space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">Ngày thực hiện / Ngày gửi <span className="text-red-500">*</span></label>
                    <input type="datetime-local" name="activityDate" value={formData.activityDate} onChange={handleChange} className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass('activityDate')}`} />
                    {renderError('activityDate')}
                 </div>
                 <div className="md:col-span-4 space-y-1">
                    <label className="block text-[11px] font-bold text-red-600 flex items-center gap-1 whitespace-nowrap">
                        Hẹn gọi lại
                    </label>
                    <input type="datetime-local" name="nextFollowUpDate" value={formData.nextFollowUpDate} onChange={handleChange} disabled={formData.activityType !== 'CALL' && formData.activityType !== 'EMAIL_QUOTE'} className={`w-full px-3 py-2 text-[11px] border rounded-[5px] outline-none focus:ring-1 transition-all ${formData.activityType === 'CALL' || formData.activityType === 'EMAIL_QUOTE' ? 'bg-red-50 text-red-900 border-red-200' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'}`} />
                 </div>
                 <div className="md:col-span-4 space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">Trạng thái & Mức độ</label>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center gap-2">
                          <input type="checkbox" id="isCompleted" name="isCompleted" checked={formData.isCompleted} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded-[5px] border-slate-300 focus:ring-blue-500 cursor-pointer" />
                          <label htmlFor="isCompleted" className="text-[11px] font-semibold text-slate-700 cursor-pointer whitespace-nowrap">Đã hoàn thành</label>
                      </div>
                      <div className="flex items-center gap-2">
                          <input type="checkbox" id="isPriority" name="isPriority" checked={formData.isPriority} onChange={handleChange} className="w-4 h-4 text-amber-500 rounded-[5px] border-slate-300 focus:ring-amber-500 cursor-pointer" />
                          <label htmlFor="isPriority" className="text-[11px] font-semibold text-slate-700 cursor-pointer whitespace-nowrap">Đánh dấu Quan trọng</label>
                      </div>
                    </div>
                 </div>
              </div>
          </div>

          {/* REFERENCES (Liên kết & Người tạo) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-[5px] border border-slate-200">
             <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase whitespace-nowrap">Lk Tới (Loại)</label>
                <select name="parentType" value={formData.parentType} onChange={handleChange} className="w-full px-3 py-2 text-[11px] bg-white border border-slate-300 rounded-[5px] outline-none focus:ring-1">
                   <option value="LEAD">Khách hàng TN (Lead)</option>
                   <option value="CUSTOMER">Khách hàng (Customer)</option>
                   <option value="OPPORTUNITY">Cơ hội (Opportunity)</option>
                </select>
             </div>
             <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase whitespace-nowrap">ID Đối tượng <span className="text-red-500">*</span></label>
                <input type="number" name="parentId" min="1" value={formData.parentId} onChange={handleChange} className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 ${errorClass('parentId')}`} />
                {renderError('parentId')}
             </div>
             <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase text-blue-600 truncate whitespace-nowrap">
                   Thuộc Task ID
                </label>
                <input type="number" name="taskId" min="1" value={formData.taskId || ''} onChange={handleChange} placeholder="Task ID..." className="w-full px-3 py-2 text-[11px] bg-white border border-blue-200 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500/30" />
             </div>
             {/* THÊM FIELD CREATED BY (NGƯỜI TẠO) */}
             <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase whitespace-nowrap">ID Người tạo <span className="text-red-500">*</span></label>
                <input type="number" name="createdBy" min="1" value={formData.createdBy} onChange={handleChange} className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 ${errorClass('createdBy')}`} />
                {renderError('createdBy')}
             </div>
             <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase whitespace-nowrap">ID Liên hệ</label>
                <input type="number" name="contactId" min="1" value={formData.contactId} onChange={handleChange} placeholder="Tùy chọn..." className="w-full px-4 py-2 text-[11px] bg-white border border-slate-300 rounded-[5px] outline-none focus:ring-1" />
             </div>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3 rounded-b-[5px]">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-100 rounded-[5px] transition-colors">
            Hủy (Ctrl + H)
          </button>
          <button type="submit" form="activityForm" disabled={isSubmitting} className="px-6 py-2 bg-blue-800 text-white rounded-[5px] text-[11px] font-bold shadow hover:bg-blue-900 flex items-center gap-2">
            {isSubmitting ? (
               <><span className="material-symbols-outlined text-[16px] animate-spin">sync</span> Đang lưu...</>
            ) : (
               <><span className="material-symbols-outlined text-[16px]">save</span> Ghi nhận (Ctrl + S)</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ActivityFormModal;