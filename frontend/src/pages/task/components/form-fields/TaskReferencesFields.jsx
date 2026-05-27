import React, { useState, useEffect } from "react";
import api from "../../../../lib/api"; 

const TaskReferencesFields = ({ formData, handleChange, errorClass, renderError }) => {
  const [leadsList, setLeadsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [opportunitiesList, setOpportunitiesList] = useState([]);
  
  // Trả đại dữ liệu cứng cho phân hệ User do chưa làm Backend User
  const usersList = [
    { id: 1, name: "Võ Thanh Huy" },
    { id: 2, name: "Người quản trị (Admin)" },
    { id: 3, name: "Nhân viên kinh doanh #1" }
  ];

  // --- THÊM TIỀN TỐ /api/v1/ CHO CÁC MODULE ĐA HÌNH CỦA TASK ---
  useEffect(() => {
    if (!formData.relateType) return;

    if (formData.relateType === "LEAD") {
      api.get("/api/v1/leads", { params: { size: 100 } })
        .then(res => setLeadsList(res.data.data || res.data.content || res.data || []))
        .catch(err => console.error("Lỗi tải danh sách Lead cho Task:", err));
    } else if (formData.relateType === "CUSTOMER") {
      api.get("/api/v1/customers", { params: { size: 100 } })
        .then(res => setCustomersList(res.data.data || res.data.content || res.data || []))
        .catch(err => console.error("Lỗi tải danh sách Customer cho Task:", err));
    } else if (formData.relateType === "OPPORTUNITY") {
      api.get("/api/v1/opportunities", { params: { size: 100 } })
        .then(res => setOpportunitiesList(res.data.data || res.data.content || res.data || []))
        .catch(err => console.error("Lỗi tải danh sách Opportunity cho Task:", err));
    }
  }, [formData.relateType]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-[5px] border border-slate-200 text-[11px]">
      
      {/* 1. NGƯỜI GIAO VIỆC */}
      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Người giao việc <span className="text-red-500">*</span>
        </label>
        <select
          name="createdBy"
          value={formData.createdBy || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 text-[11px] bg-white border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500/30 font-medium text-slate-700"
        >
          {usersList.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      {/* 2. NGƯỜI PHỤ TRÁCH NHẬN VIỆC */}
      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Người phụ trách <span className="text-red-500">*</span>
        </label>
        <select
          name="assignedTo"
          value={formData.assignedTo || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 text-[11px] bg-white border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500/30 font-medium text-slate-700"
        >
          {usersList.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      {/* 3. LOẠI ĐỐI TƯỢNG LIÊN KẾT */}
      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Liên kết tới (Loại)</label>
        <select
          name="relateType"
          value={formData.relateType || ""}
          onChange={(e) => {
            handleChange(e);
            handleChange({ target: { name: "relateId", value: "" } });
          }}
          className="w-full px-3 py-2 text-[11px] bg-white border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500/30 font-semibold text-slate-700"
        >
          <option value="">-- Không chọn liên kết --</option>
          <option value="LEAD">Khách hàng TN (Lead)</option>
          <option value="CUSTOMER">Khách hàng (Customer)</option>
          <option value="OPPORTUNITY">Cơ hội (Opportunity)</option>
        </select>
      </div>

      {/* 4. ĐỐI TƯỢNG CỤ THỂ ĐƯỢC CHỌN */}
      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Đối tượng liên kết {formData.relateType && <span className="text-red-500">*</span>}
        </label>
        <select
          name="relateId"
          value={formData.relateId || ""}
          onChange={handleChange}
          disabled={!formData.relateType}
          className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 font-medium disabled:bg-slate-100 disabled:text-slate-400 ${errorClass("relateId")}`}
        >
          <option value="">-- Chọn đối tượng --</option>
          {formData.relateType === "LEAD" && leadsList.map((item) => (
            <option key={item.id} value={item.id}>{item.fullName || item.name} (ID: #{item.id})</option>
          ))}
          {formData.relateType === "CUSTOMER" && customersList.map((item) => (
            <option key={item.id} value={item.id}>{item.name || item.fullName} (ID: #{item.id})</option>
          ))}
          {formData.relateType === "OPPORTUNITY" && opportunitiesList.map((item) => (
            <option key={item.id} value={item.id}>{item.name || item.fullName} (ID: #{item.id})</option>
          ))}
        </select>
        {formData.relateType && renderError("relateId")}
      </div>

    </div>
  );
};

export default TaskReferencesFields;