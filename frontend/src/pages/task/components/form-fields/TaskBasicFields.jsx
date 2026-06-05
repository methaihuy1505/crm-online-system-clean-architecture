import React from "react";

const TaskBasicFields = ({ formData, handleChange, errorClass, renderError }) => {
  return (
    <>
      {/* Tiêu đề công việc */}
      <div className="space-y-1">
        <label className="block text-[11px] font-bold text-slate-500 uppercase whitespace-nowrap">
          Tiêu đề công việc <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-4 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 ${errorClass("title")}`}
        />
        {renderError("title")}
      </div>

      {/* Mức độ ưu tiên và Trạng thái */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-500 uppercase whitespace-nowrap">
            Mức độ ưu tiên <span className="text-red-500">*</span>
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 text-[11px] bg-white border border-slate-300 rounded-[5px] outline-none focus:ring-1"
          >
            <option value="LOW">Thấp</option>
            <option value="MEDIUM">Trung bình</option>
            <option value="HIGH">Cao</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-500 uppercase whitespace-nowrap">
            Trạng thái công việc <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 text-[11px] bg-white border border-slate-300 rounded-[5px] outline-none focus:ring-1"
          >
            <option value="NOT_STARTED">Chưa bắt đầu</option>
            <option value="IN_PROGRESS">Đang làm</option>
            <option value="COMPLETED">Đã hoàn thành</option>
            <option value="DEFERRED">Tạm hoãn</option>
            <option value="CANCELED">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Thời gian thực hiện */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-500 uppercase whitespace-nowrap">
            Ngày bắt đầu <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`w-full px-4 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 ${errorClass("startDate")}`}
          />
          {renderError("startDate")}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-500 uppercase whitespace-nowrap">
            Hạn chót (End Date) <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`w-full px-4 py-2 text-[11px] bg-white border rounded-[5px] outline-none focus:ring-1 ${errorClass("endDate")}`}
          />
          {renderError("endDate")}
        </div>
      </div>

      {/* Mô tả nội dung */}
      <div className="space-y-1">
        <label className="block text-[11px] font-bold text-slate-500 uppercase whitespace-nowrap">
          Mô tả nội dung công việc
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 text-[11px] bg-white border border-slate-300 rounded-[5px] outline-none focus:ring-1 resize-none"
        ></textarea>
      </div>
    </>
  );
};

export default TaskBasicFields;