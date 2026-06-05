import React, { useState, useEffect } from "react";
import api from "../../../../lib/api"; 

const TaskReferencesFields = ({ formData, handleChange, errorClass, renderError }) => {
  const [leadsList, setLeadsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [opportunitiesList, setOpportunitiesList] = useState([]);

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* 1. CHỌN LOẠI ĐỐI TƯỢNG LIÊN KẾT */}
      <div className="space-y-1">
        <label className="block text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">
          Liên kết tới phân hệ
        </label>
        <select
          name="relateType"
          value={formData.relateType || ""}
          onChange={(e) => {
            handleChange(e);
            // Tự động reset Id đối tượng liên kết cũ khi đổi Loại hình
            handleChange({ target: { name: "relateId", value: "" } });
          }}
          className="w-full px-2 py-1.5 border border-slate-300 rounded-[5px] outline-none focus:ring-1 focus:ring-blue-500 bg-white text-[11px]"
        >
          <option value="">-- Không có liên kết --</option>
          <option value="LEAD">Khách hàng Tiềm năng (LEAD)</option>
          <option value="CUSTOMER">Khách hàng chính thức (CUSTOMER)</option>
          <option value="OPPORTUNITY">Cơ hội kinh doanh (OPPORTUNITY)</option>
        </select>
      </div>

      {/* 2. CHỌN ĐỐI TƯỢNG LIÊN KẾT CỤ THỂ ĐA HÌNH */}
      <div className="space-y-1">
        <label className="block text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">
          Đối tượng liên kết cụ thể {formData.relateType && <span className="text-red-500">*</span>}
        </label>
        <select
          name="relateId"
          value={formData.relateId || ""}
          onChange={handleChange}
          disabled={!formData.relateType}
          className={`w-full px-2 py-1.5 border rounded-[5px] outline-none transition-all text-[11px] bg-white ${
            !formData.relateType ? "bg-slate-100 text-slate-400 border-slate-200" : errorClass("relateId")
          }`}
        >
          <option value="">-- Chọn đối tượng cụ thể --</option>
          {formData.relateType === "LEAD" && leadsList.map((item) => (
            <option key={item.id} value={item.id}>{item.fullName || item.name} (ID: #{item.id})</option>
          ))}
          {formData.relateType === "CUSTOMER" && customersList.map((item) => (
            <option key={item.id} value={item.id}>{item.name || item.fullName} (ID: #{item.id})</option>
          ))}
          {formData.relateType === "OPPORTUNITY" && opportunitiesList.map((item) => (
            <option key={item.id} value={item.id}>{item.name} (ID: #{item.id})</option>
          ))}
        </select>
        {formData.relateType && renderError("relateId")}
      </div>
    </div>
  );
};

export default TaskReferencesFields;