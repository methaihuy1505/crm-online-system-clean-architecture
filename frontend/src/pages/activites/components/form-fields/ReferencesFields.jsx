import React, { useState, useEffect, useRef } from "react";
import api from "../../../../lib/api";

// --- COMPONENT TÌM KIẾM ĐỘNG (CHUẨN, KHÔNG DÙNG STATE ẢO) ---
export const SearchableSelect = ({ options, value, onChange, placeholder, disabled, errorClass, onSearchAsync }) => {
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

  // CHỈ TÌM TRONG OPTIONS: CÓ THÌ HIỂN THỊ, KHÔNG CÓ THÌ HIỂN THỊ PLACEHOLDER
  const selectedOption = options.find((o) => String(o.id) === String(value));
  const displayText = selectedOption ? selectedOption.name : placeholder;

  const filteredOptions = onSearchAsync 
    ? options 
    : options.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} className="relative w-full">
      <div
        className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] flex justify-between items-center outline-none transition-all ${
          disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200" : "cursor-pointer focus:border-blue-500"
        } ${errorClass || "border-slate-300"}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`truncate ${!selectedOption && "text-slate-400"}`}>{displayText}</span>
        <span className="material-symbols-outlined text-[16px] text-slate-500">expand_more</span>
      </div>
      
      {isOpen && !disabled && (
        <div className="absolute z-[200] w-full mt-1 bg-white border border-slate-200 rounded-[5px] shadow-xl animate-fade-in overflow-hidden">
          <div className="p-2 border-b border-slate-100 bg-slate-50">
            <input
              type="text"
              className="w-full px-3 py-2 text-[11px] border border-slate-200 rounded-[3px] outline-none focus:border-blue-400 transition-colors"
              placeholder="Gõ để tìm kiếm trên hệ thống..."
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
                  className={`px-4 py-2.5 text-[11px] cursor-pointer transition-colors ${
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
              <div className="px-4 py-4 text-[11px] text-slate-500 text-center italic">Không tìm thấy kết quả.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
// --------------------------------------------------------------

const ReferencesFields = ({ formData, handleChange, errorClass, renderError, currentActivity }) => {
  const [parentOptions, setParentOptions] = useState([]);
  const [parentKeyword, setParentKeyword] = useState("");

  const [contactsOptions, setContactsOptions] = useState([]);
  const [contactKeyword, setContactKeyword] = useState("");

  const [tasksOptions, setTasksOptions] = useState([]);
  const [taskKeyword, setTaskKeyword] = useState("");

  const isLead = formData.parentType === "LEAD";

  // 1. TÌM KIẾM ĐỐI TƯỢNG (LEAD/CUSTOMER/OPPORTUNITY)
  useEffect(() => {
    if (!formData.parentType) {
      setParentOptions([]);
      return;
    }

    const fetchRelates = async () => {
      let endpoint = formData.parentType === "LEAD" ? "/leads"
                   : formData.parentType === "CUSTOMER" ? "/customers"
                   : "/opportunities";
      try {
        const res = await api.get(endpoint, {
          params: { size: 50, keyword: parentKeyword || null }
        });

        const data = res.data?.content || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        let mapped = data.map(item => ({
          id: item.id,
          name: `${item.fullName || item.name} (ID: #${item.id})`
        }));

        // GỌI THẲNG API RỒI CHÈN DATA CŨ VÀO MẢNG (NẾU ĐANG EDIT)
        if (currentActivity?.parentType === formData.parentType && currentActivity?.parentId) {
          if (!mapped.find(m => String(m.id) === String(currentActivity.parentId))) {
            mapped.unshift({
              id: currentActivity.parentId,
              name: currentActivity.parentName ? `${currentActivity.parentName} (ID: #${currentActivity.parentId})` : `(ID: #${currentActivity.parentId})`
            });
          }
        }
        setParentOptions(mapped);
      } catch (err) {
        console.error("Lỗi tải đối tượng:", err);
        setParentOptions([]);
      }
    };

    const timeout = setTimeout(fetchRelates, 400);
    return () => clearTimeout(timeout);
  }, [formData.parentType, parentKeyword, currentActivity]);


  // 2. TÌM KIẾM CÔNG VIỆC
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks", { params: { size: 50, keyword: taskKeyword || null } });
        const data = res.data?.content || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        
        let mapped = data.map(t => ({ id: t.id, name: `${t.title} (ID: #${t.id})` }));

        if (currentActivity?.taskId) {
           if (!mapped.find(m => String(m.id) === String(currentActivity.taskId))) {
              mapped.unshift({ id: currentActivity.taskId, name: currentActivity.taskTitle || `(ID: #${currentActivity.taskId})`});
           }
        }
        setTasksOptions(mapped);
      } catch (err) {
         console.error("Lỗi tải Task:", err);
         setTasksOptions([]);
      }
    };
    const timeout = setTimeout(fetchTasks, 400);
    return () => clearTimeout(timeout);
  }, [taskKeyword, currentActivity]);


  // 3. TÌM KIẾM LIÊN HỆ (CHỈ CHO CUSTOMER)
  useEffect(() => {
    if (isLead || !formData.parentId) {
        setContactsOptions([]);
        return;
    }

    const fetchContacts = async () => {
      try {
        const res = await api.get("/contacts", { params: { size: 50, keyword: contactKeyword || null } });
        const data = res.data?.content || res.data?.data || (Array.isArray(res.data) ? res.data : []);

        let filtered = data;
        if (formData.parentType === "CUSTOMER") {
           filtered = data.filter(c => Number(c.customerId) === Number(formData.parentId));
        }

        let mapped = filtered.map(c => ({ id: c.id, name: `${c.fullName || c.name} (ID: #${c.id})` }));

        if (currentActivity?.contactId) {
           if (!mapped.find(m => String(m.id) === String(currentActivity.contactId))) {
              mapped.unshift({ id: currentActivity.contactId, name: currentActivity.contactName || `(ID: #${currentActivity.contactId})`});
           }
        }
        setContactsOptions(mapped);
      } catch (err) {
        console.error("Lỗi tải Contact:", err);
        setContactsOptions([]);
      }
    }
    const timeout = setTimeout(fetchContacts, 400);
    return () => clearTimeout(timeout);
  }, [isLead, formData.parentId, formData.parentType, contactKeyword, currentActivity]);

  return (
    <div className={`grid grid-cols-1 ${isLead ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-4 p-4 bg-slate-50/50 rounded-[5px] border border-slate-200`}>
      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lk Tới (Loại)</label>
        <select
          name="parentType"
          value={formData.parentType || "LEAD"}
          onChange={(e) => {
            handleChange(e);
            handleChange({ target: { name: "parentId", value: "" } });
            handleChange({ target: { name: "contactId", value: "" } });
            setParentKeyword("");
          }}
          className="w-full px-2 py-1.5 text-[11px] bg-white border border-slate-300 rounded-[5px] outline-none font-bold text-slate-700 focus:ring-1 focus:ring-blue-500 transition-all"
        >
          <option value="LEAD">Khách hàng TN (Lead)</option>
          <option value="CUSTOMER">Khách hàng (Customer)</option>
          <option value="OPPORTUNITY">Cơ hội (Opportunity)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Đối tượng cụ thể <span className="text-red-500">*</span>
        </label>
        <SearchableSelect
          options={parentOptions}
          value={formData.parentId}
          onChange={(val) => {
            handleChange({ target: { name: "parentId", value: val } });
            handleChange({ target: { name: "contactId", value: "" } });
          }}
          onSearchAsync={(val) => setParentKeyword(val)}
          placeholder="-- Gõ để tìm kiếm --"
          disabled={!formData.parentType}
          errorClass={!formData.parentType ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" : errorClass("parentId")}
        />
        {renderError("parentId")}
      </div>

      {!isLead && (
        <div className="space-y-1 animate-fade-in">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Liên hệ liên quan</label>
          <SearchableSelect
            options={contactsOptions}
            value={formData.contactId}
            onChange={(val) => handleChange({ target: { name: "contactId", value: val } })}
            onSearchAsync={(val) => setContactKeyword(val)}
            placeholder="-- Chọn người liên hệ --"
            disabled={!formData.parentId}
          />
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-blue-600 uppercase tracking-wider">Thuộc công việc</label>
        <SearchableSelect
          options={tasksOptions}
          value={formData.taskId}
          onChange={(val) => handleChange({ target: { name: "taskId", value: val } })}
          onSearchAsync={(val) => setTaskKeyword(val)}
          placeholder="-- Tìm công việc (K.bắt buộc) --"
          errorClass="border-blue-200"
        />
      </div>
    </div>
  );
};

export default ReferencesFields;