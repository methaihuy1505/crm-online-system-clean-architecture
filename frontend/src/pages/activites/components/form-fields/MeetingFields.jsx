import React from "react";

const MeetingFields = ({ formData, handleChange, errorClass, renderError }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Chủ đề và Địa điểm */}
      <div className="md:col-span-6 space-y-1">
        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">
          Chủ đề cuộc họp <span className="text-red-500">*</span>
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
          Địa điểm <span className="text-red-500">*</span>
        </label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass("location")}`}
        />
        {renderError("location")}
      </div>

      {/* Ngày bắt đầu và kết thúc */}
      <div className="md:col-span-6 space-y-1">
        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">
          Ngày bắt đầu <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass("startDate")}`}
        />
        {renderError("startDate")}
      </div>
      <div className="md:col-span-6 space-y-1">
        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">
          Ngày kết thúc <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all ${errorClass("endDate")}`}
        />
        {renderError("endDate")}
      </div>

      {/* Nội dung cuộc họp */}
      <div className="md:col-span-12 space-y-1">
        <label className="block text-[11px] font-bold text-slate-600 whitespace-nowrap">
          Nội dung cuộc họp
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="2"
          className={`w-full px-3 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 transition-all resize-none ${errorClass("description")}`}
        ></textarea>
      </div>
    </div>
  );
};

export default MeetingFields;