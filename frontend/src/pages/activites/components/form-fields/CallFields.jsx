import React from "react";

const CallFields = ({ formData, handleChange, errorClass, renderError }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Chủ đề và Mô tả */}
      <div className="md:col-span-6 space-y-1">
        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">
          Chủ đề cuộc gọi <span className="text-red-500">*</span>
        </label>
        <input
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass("subject")}`}
        />
        {renderError("subject")}
      </div>
      <div className="md:col-span-6 space-y-1">
        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">
          Nội dung chi tiết
        </label>
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Nhập ghi chú..."
          className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass("description")}`}
        />
        {renderError("description")}
      </div>

      {/* Các trường nhỏ dòng 2 */}
      <div className="md:col-span-3 space-y-1">
        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">
          Loại <span className="text-red-500">*</span>
        </label>
        <select
          name="callType"
          value={formData.callType}
          onChange={handleChange}
          className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass("callType")}`}
        >
          <option value="INBOUND">Đến (Inbound)</option>
          <option value="OUTBOUND">Đi (Outbound)</option>
        </select>
        {renderError("callType")}
      </div>
      <div className="md:col-span-3 space-y-1">
        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">
          Thời lượng (Phút) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass("duration")}`}
        />
        {renderError("duration")}
      </div>
      <div className="md:col-span-6 space-y-1">
        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">
          Kết quả <span className="text-red-500">*</span>
        </label>
        <input
          name="callResult"
          value={formData.callResult}
          onChange={handleChange}
          className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass("callResult")}`}
        />
        {renderError("callResult")}
      </div>
    </div>
  );
};

export default CallFields;