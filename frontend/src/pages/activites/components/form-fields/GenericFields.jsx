import React from "react";

const GenericFields = ({ formData, handleChange, errorClass, renderError }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div className="md:col-span-4 space-y-1">
        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">
          Chủ đề / Tiêu đề <span className="text-red-500">*</span>
        </label>
        <input
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass("subject")}`}
        />
        {renderError("subject")}
      </div>
      <div className="md:col-span-8 space-y-1">
        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">
          Nội dung chi tiết{" "}
          {formData.activityType === "NOTE" && <span className="text-red-500">*</span>}
        </label>
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass("description")}`}
        />
        {renderError("description")}
      </div>
    </div>
  );
};

export default GenericFields;