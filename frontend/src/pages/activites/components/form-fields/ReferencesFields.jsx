import React, { useState, useEffect } from "react";
import api from "../../../../lib/api"; 

const ReferencesFields = ({ formData, handleChange, errorClass, renderError }) => {
  const [leadsList, setLeadsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [opportunitiesList, setOpportunitiesList] = useState([]);
  const [contactsList, setContactsList] = useState([]);
  
  // THÊM STATE CHỨA DANH SÁCH TASK TỪ DATABASE
  const [tasksList, setTasksList] = useState([]);

  // Vá tạm danh sách nhân viên do module User chưa có backend
  const usersList = [
    { id: 1, fullName: "Võ Thanh Huy" },
    { id: 2, fullName: "Người quản trị (Admin)" },
    { id: 3, fullName: "Nhân viên kinh doanh #1" }
  ];

  // --- FETCH CONTACTS VÀ TASKS KHI MỞ FORM MẶC ĐỊNH ---
  useEffect(() => {
    // 1. Tải danh sách liên hệ (Có /api/v1/)
    api.get("/api/v1/contacts")
      .then(res => setContactsList(res.data.data || res.data || []))
      .catch(err => console.error("Lỗi tải danh sách liên hệ thật:", err));

    // 2. Tải danh sách Task/api/v1/)
    api.get("/tasks", { params: { size: 100 } })
      .then(res => setTasksList(res.data.data || res.data.content || res.data || []))
      .catch(err => console.error("Lỗi tải danh sách Task:", err));
  }, []);

  // --- FETCH DỮ LIỆU ĐA HÌNH KHI ĐỔI LOẠI LIÊN KẾT ---
  useEffect(() => {
    if (!formData.parentType) return;

    if (formData.parentType === "LEAD") {
      api.get("/api/v1/leads", { params: { size: 100 } })
        .then(res => setLeadsList(res.data.data || res.data.content || res.data || []))
        .catch(err => console.error("Lỗi tải danh sách Lead thật:", err));
    } else if (formData.parentType === "CUSTOMER") {
      api.get("/api/v1/customers", { params: { size: 100 } })
        .then(res => setCustomersList(res.data.data || res.data.content || res.data || []))
        .catch(err => console.error("Lỗi tải danh sách Customer thật:", err));
    } else if (formData.parentType === "OPPORTUNITY") {
      api.get("/api/v1/opportunities", { params: { size: 100 } })
        .then(res => setOpportunitiesList(res.data.data || res.data.content || res.data || []))
        .catch(err => console.error("Lỗi tải danh sách Opportunity thật:", err));
    }
  }, [formData.parentType]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-[5px] border border-slate-200">
      
      {/* 1. LOẠI ĐỐI TƯỢNG LIÊN KẾT */}
      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lk Tới (Loại)</label>
        <select
          name="parentType"
          value={formData.parentType || "LEAD"}
          onChange={(e) => {
            handleChange(e);
            handleChange({ target: { name: "parentId", value: "" } });
          }}
          className="w-full px-3 py-2 text-[11px] bg-white border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500/30 font-semibold text-slate-700"
        >
          <option value="LEAD">Khách hàng TN (Lead)</option>
          <option value="CUSTOMER">Khách hàng (Customer)</option>
          <option value="OPPORTUNITY">Cơ hội (Opportunity)</option>
        </select>
      </div>

      {/* 2. CHỌN ĐỐI TƯỢNG CỤ THỂ */}
      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Đối tượng cụ thể <span className="text-red-500">*</span>
        </label>
        <select
          name="parentId"
          value={formData.parentId || ""}
          onChange={handleChange}
          className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 font-medium ${errorClass("parentId")}`}
        >
          <option value="">-- Chọn đối tượng --</option>
          {formData.parentType === "LEAD" && leadsList.map((item) => (
            <option key={item.id} value={item.id}>{item.fullName || item.name} (ID: #{item.id})</option>
          ))}
          {formData.parentType === "CUSTOMER" && customersList.map((item) => (
            <option key={item.id} value={item.id}>{item.name || item.fullName} (ID: #{item.id})</option>
          ))}
          {formData.parentType === "OPPORTUNITY" && opportunitiesList.map((item) => (
            <option key={item.id} value={item.id}>{item.name || item.fullName} (ID: #{item.id})</option>
          ))}
        </select>
        {renderError("parentId")}
      </div>

      {/* 3. CHỌN CÔNG VIỆC TỪ DANH SÁCH*/}
      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-blue-600 uppercase tracking-wider">Thuộc công việc</label>
        <select
          name="taskId"
          value={formData.taskId || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 text-[11px] bg-white border border-blue-200 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500/30 font-medium text-slate-700"
        >
          <option value="">-- Chọn công việc (Không bắt buộc) --</option>
          {tasksList.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title} (ID: #{task.id})
            </option>
          ))}
        </select>
      </div>

      {/* 4. CHỌN NGƯỜI TẠO */}
      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Người tạo <span className="text-red-500">*</span>
        </label>
        <select
          name="createdBy"
          value={formData.createdBy || ""}
          onChange={handleChange}
          className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 ${errorClass("createdBy")}`}
        >
          <option value="">-- Chọn nhân viên --</option>
          {usersList.map((user) => (
            <option key={user.id} value={user.id}>{user.fullName}</option>
          ))}
        </select>
        {renderError("createdBy")}
      </div>

      {/* 5. NGƯỜI LIÊN HỆ LIÊN QUAN */}
      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Liên hệ liên quan</label>
        <select
          name="contactId"
          value={formData.contactId || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 text-[11px] bg-white border border-slate-300 rounded-[5px] outline-none focus:ring-1 text-slate-700"
        >
          <option value="">-- Chọn người liên hệ --</option>
          {(formData.parentType === "CUSTOMER" && formData.parentId
            ? contactsList.filter((c) => Number(c.customerId) === Number(formData.parentId))
            : contactsList
          ).map((item) => (
            <option key={item.id} value={item.id}>{item.fullName || item.name} (ID: #{item.id})</option>
          ))}
        </select>
      </div>

    </div>
  );
};

export default ReferencesFields;