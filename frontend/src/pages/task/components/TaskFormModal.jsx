import React, { useState, useEffect, useRef } from "react";
import api from "../../../lib/api";
import toast from "react-hot-toast";
import { FileText, CalendarClock, Link2 } from "lucide-react";

// --- COMPONENT TÌM KIẾM ĐỘNG (CHUẨN REACT PATTERN) ---
export const SearchableSelect = ({ options, value, onChange, placeholder, disabled, errorClass, onSearchAsync, initialName }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => String(o.id) === String(value));
  const displayText = selectedOption ? selectedOption.name : (initialName || placeholder);

  const filteredOptions = onSearchAsync 
    ? options 
    : options.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} className="relative w-full">
      <div
        className={`w-full px-3 py-2 text-[12px] bg-white border rounded-[5px] flex justify-between items-center outline-none transition-all ${
          disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200" : "cursor-pointer focus:border-blue-500"
        } ${errorClass || "border-slate-300"}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`truncate ${!value && !initialName && "text-slate-400"}`}>{displayText}</span>
        <span className="material-symbols-outlined text-[16px] text-slate-500">expand_more</span>
      </div>
      
      {isOpen && !disabled && (
        <div className="absolute z-[200] w-full mt-1 bg-white border border-slate-200 rounded-[5px] shadow-xl animate-fade-in overflow-hidden">
          <div className="p-2 border-b border-slate-100 bg-slate-50">
            <input
              type="text"
              className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-[3px] outline-none focus:border-blue-400 transition-colors"
              placeholder="Gõ để tìm kiếm..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (onSearchAsync) onSearchAsync(e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((o) => (
                <div
                  key={o.id}
                  className={`px-4 py-2.5 text-[12px] cursor-pointer transition-colors ${
                    String(value) === String(o.id) ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={() => {
                    onChange(o.id);
                    setIsOpen(false);
                    setSearch("");
                    if (onSearchAsync) onSearchAsync("");
                  }}
                >
                  {o.name}
                </div>
              ))
            ) : (
              <div className="px-4 py-4 text-[12px] text-slate-500 text-center italic">Không tìm thấy kết quả.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
// --------------------------------------------------------------

const TaskFormModal = ({ isOpen, onClose, onSave, currentTask }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { roleId: 3, id: 1 };
  const currentUserId = Number(currentUser.id);
  
  const isAdminOrManager = Number(currentUser.roleId) === 1 || Number(currentUser.roleId) === 4;

  const [formData, setFormData] = useState({
    title: "", description: "", priority: "MEDIUM", startDate: "", endDate: "",
    status: "NOT_STARTED", assignedTo: "", relateType: "", relateId: "",
    extensionCount: 0, isOverdue: false, createdBy: currentUserId 
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [usersList, setUsersList] = useState([]);
  const [relateOptions, setRelateOptions] = useState([]);
  const [relateKeyword, setRelateKeyword] = useState("");

  const titleInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && isAdminOrManager) {
      api.get("/users", { params: { size: 1000 } })
        .then(res => {
          let mappedUsers = (res.data.content || res.data || []).map(u => ({ id: u.id, name: `${u.fullName} (ID: #${u.id})` }));
          if (currentTask && currentTask.assignedTo) {
            if (!mappedUsers.find(m => String(m.id) === String(currentTask.assignedTo))) {
              mappedUsers.unshift({ id: currentTask.assignedTo, name: currentTask.assignedToName || `ID: #${currentTask.assignedTo}` });
            }
          }
          setUsersList(mappedUsers);
        })
        .catch(err => console.error("Lỗi tải nhân viên:", err));
    }
  }, [isOpen, isAdminOrManager, currentTask]);

  useEffect(() => {
    if (!isOpen || !formData.relateType) {
      setRelateOptions([]);
      return;
    }

    const fetchRelates = async () => {
      let endpoint = formData.relateType === "LEAD" ? "/leads" 
                   : formData.relateType === "CUSTOMER" ? "/customers" 
                   : "/opportunities";

      try {
        const res = await api.get(endpoint, { 
          params: { size: 50, keyword: relateKeyword || null } 
        });
        
        const data = res.data.content || res.data || [];
        let mapped = data.map(item => ({
          id: item.id,
          name: `${item.fullName || item.name} (ID: #${item.id})`
        }));
        
        if (currentTask && currentTask.relateType === formData.relateType && currentTask.relateId) {
          if (!mapped.find(m => String(m.id) === String(currentTask.relateId))) {
            mapped.unshift({ 
              id: currentTask.relateId, 
              name: currentTask.relateName ? `${currentTask.relateName} (ID: #${currentTask.relateId})` : `(ID: #${currentTask.relateId})` 
            });
          }
        }
        
        setRelateOptions(mapped);
      } catch (err) {
        console.error("Lỗi tải đối tượng liên kết:", err);
      }
    };

    const timeout = setTimeout(fetchRelates, 400); 
    return () => clearTimeout(timeout);
  }, [formData.relateType, relateKeyword, isOpen, currentTask]);

  useEffect(() => {
    setErrors({});
    if (currentTask) {
      setFormData({
        title: currentTask.title || "",
        description: currentTask.description || "",
        priority: currentTask.priority || "MEDIUM",
        startDate: currentTask.startDate ? currentTask.startDate.slice(0, 16) : "",
        endDate: currentTask.endDate ? currentTask.endDate.slice(0, 16) : "",
        status: currentTask.status || "NOT_STARTED",
        assignedTo: currentTask.assignedTo || "",
        relateType: currentTask.relateType || "",
        relateId: currentTask.relateId || "",
        extensionCount: currentTask.extensionCount || 0,
        isOverdue: currentTask.isOverdue || false,
        createdBy: currentTask.createdBy || currentUserId
      });
      setRelateKeyword(""); 
    } else {
      setFormData({
        title: "", description: "", priority: "MEDIUM", startDate: "", endDate: "",
        status: "NOT_STARTED", assignedTo: "", // Không gán cứng nữa
        relateType: "", relateId: "", extensionCount: 0, isOverdue: false, createdBy: currentUserId 
      });
      setRelateKeyword("");
    }
  }, [currentTask, isOpen, isAdminOrManager, currentUserId]);

  const validateForm = () => {
    let newErrors = {};
    let focusRef = null;

    if (!formData.title?.trim()) { newErrors.title = "Bắt buộc"; focusRef = titleInputRef; } 
    else if (formData.title.length > 60) { newErrors.title = "Tối đa 60 ký tự"; focusRef = titleInputRef; }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) newErrors.endDate = "Phải sau TG bắt đầu";
    }

    // ĐÃ XÓA VALIDATE BẮT BUỘC NGƯỜI PHỤ TRÁCH CHO ADMIN/MANAGER
    if (formData.relateType && !formData.relateId) newErrors.relateId = "Bắt buộc";

    setErrors(newErrors);
    if (focusRef && focusRef.current) focusRef.current.focus();
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const newForm = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === "relateType") {
        newForm.relateId = ""; 
        setRelateKeyword(""); 
      }
      return newForm;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 🌟 ĐÃ SỬA: Nếu Admin bỏ trống -> null, Nếu là Sale -> currentUserId
      const payload = {
        ...formData,
        relateType: formData.relateType === "" ? null : formData.relateType,
        assignedTo: isAdminOrManager ? (formData.assignedTo ? parseInt(formData.assignedTo) : null) : currentUserId,
        relateId: formData.relateId ? parseInt(formData.relateId) : null,
        extensionCount: parseInt(formData.extensionCount || 0),
        updatedBy: currentUserId, 
      };

      if (currentTask?.id) await api.put(`/tasks/${currentTask.id}`, payload);
      else await api.post("/tasks", payload);

      toast.success(currentTask ? "Cập nhật thành công!" : "Đã giao việc thành công!");
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi lưu Task!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorClass = (fieldName) => (errors[fieldName] ? "border-red-500 bg-red-50" : "border-slate-300 focus:border-blue-500");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-[1000px] rounded-[8px] shadow-2xl flex flex-col animate-slide-up border border-slate-200">
        
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[8px]">
          <div>
            <h3 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">{currentTask ? "edit_square" : "add_task"}</span>
              {currentTask ? `Cập nhật Công việc #${currentTask.id}` : "Giao việc mới"}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 italic">Những trường có dấu <span className="text-red-500 font-bold">*</span> là bắt buộc nhập.</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50" title="Đóng (Esc)">
            <span className="material-symbols-outlined block text-[24px]">close</span>
          </button>
        </div>

        <form id="taskForm" onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-4">
            <h4 className="text-[12px] font-bold text-blue-800 border-b border-blue-100 pb-2 flex items-center gap-2 uppercase tracking-wider">
              <FileText size={16} /> Thông tin công việc
            </h4>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-600 uppercase">Tiêu đề công việc <span className="text-red-500">*</span></label>
                <span className={`text-[10px] font-semibold ${formData.title.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>{formData.title.length}/60</span>
              </div>
              <input ref={titleInputRef} name="title" value={formData.title} onChange={handleChange} placeholder="Nhập tiêu đề công việc..." className={`w-full px-3 py-2 border rounded-[5px] outline-none transition-all text-[12px] ${errorClass('title')}`} />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Mô tả chi tiết</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Ghi chú chi tiết về công việc cần thực hiện..." className="w-full px-3 py-2 border border-slate-300 rounded-[5px] outline-none text-[12px] resize-none focus:border-blue-500"></textarea>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[12px] font-bold text-blue-800 border-b border-blue-100 pb-2 flex items-center gap-2 uppercase tracking-wider">
              <CalendarClock size={16} /> Trạng thái & Lên lịch
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase">Mức độ <span className="text-red-500">*</span></label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-[5px] outline-none bg-white text-[12px] focus:border-blue-500">
                  <option value="LOW">Thấp</option>
                  <option value="MEDIUM">Trung bình</option>
                  <option value="HIGH">Cao</option>
                  <option value="URGENT">Khẩn cấp</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase">Trạng thái <span className="text-red-500">*</span></label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-[5px] outline-none bg-white text-[12px] focus:border-blue-500">
                  <option value="NOT_STARTED">Chưa bắt đầu</option>
                  <option value="IN_PROGRESS">Đang làm</option>
                  <option value="PENDING">Đang chờ</option>
                  <option value="COMPLETED">Đã hoàn thành</option>
                  <option value="CANCELED">Đã hủy</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Thời gian bắt đầu</label>
              <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-[5px] outline-none text-[12px] focus:border-blue-500" />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Hạn chót (Deadline)</label>
              <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} className={`w-full px-3 py-2 border rounded-[5px] outline-none text-[12px] bg-white ${errorClass('endDate')}`} />
              {errors.endDate && <p className="text-red-500 text-[10px] mt-0.5">{errors.endDate}</p>}
            </div>
          </div>

          <div className="space-y-4 bg-slate-50 border border-slate-200 p-4 rounded-[5px]">
            <h4 className="text-[12px] font-bold text-blue-800 border-b border-blue-100 pb-2 flex items-center gap-2 uppercase tracking-wider">
              <Link2 size={16} /> Liên kết & Phân công
            </h4>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Loại liên kết</label>
              <select name="relateType" value={formData.relateType} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-[5px] outline-none bg-white text-[12px] focus:border-blue-500">
                <option value="">-- Không có --</option>
                <option value="LEAD">Khách hàng TN (LEAD)</option>
                <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
                <option value="OPPORTUNITY">Cơ hội (OPPORTUNITY)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Đối tượng cụ thể {formData.relateType && <span className="text-red-500">*</span>}</label>
              <SearchableSelect
                options={relateOptions}
                value={formData.relateId}
                onChange={(val) => handleChange({ target: { name: 'relateId', value: val } })}
                onSearchAsync={(val) => setRelateKeyword(val)} 
                placeholder={!formData.relateType ? "-- Chưa chọn loại --" : "-- Gõ để tìm kiếm --"}
                disabled={!formData.relateType}
                initialName={currentTask?.relateName}
                errorClass={!formData.relateType ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" : errorClass('relateId')}
              />
              {errors.relateId && <p className="text-red-500 text-[10px] mt-0.5">{errors.relateId}</p>}
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-200">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Người phụ trách</label>
              {isAdminOrManager ? (
                <SearchableSelect
                  options={usersList}
                  value={formData.assignedTo}
                  onChange={(val) => handleChange({ target: { name: 'assignedTo', value: val } })}
                  placeholder="-- Bỏ trống để chưa giao việc --"
                  initialName={currentTask?.assignedToName}
                  errorClass={errorClass("assignedTo")}
                />
              ) : (
                <div className="w-full px-3 py-2 border border-slate-200 rounded-[5px] bg-white text-slate-500 text-[12px] italic">
                  Tự động gán cho: <b className="text-slate-700">Chính bạn</b>
                </div>
              )}
              {errors.assignedTo && <p className="text-red-500 text-[10px] mt-0.5">{errors.assignedTo}</p>}
            </div>
          </div>

        </form>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-[8px]">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2.5 text-[12px] font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-all rounded-[5px]">
            Hủy bỏ (Esc)
          </button>
          <button type="submit" form="taskForm" disabled={isSubmitting} className="px-8 py-2.5 rounded-[5px] font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 transition-all text-[12px]">
            {isSubmitting ? <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Đang xử lý...</> : <><span className="material-symbols-outlined text-[18px]">save</span> Ghi nhận (Ctrl + S)</>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default TaskFormModal;