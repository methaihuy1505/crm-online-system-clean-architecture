import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

// Helper format ngày tháng giữ nguyên
export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

// Render cụm nút hành động giữ nguyên
export const RenderActions = ({ activity, onEdit, onDelete }) => (
  <div className="flex gap-2 justify-center">
    <button onClick={() => onEdit(activity)} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1.5 rounded-[5px]" title="Sửa">
      <Edit className="w-4 h-4" />
    </button>
    <button onClick={() => onDelete(activity.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-[5px]" title="Xóa">
      <Trash2 className="w-4 h-4" />
    </button>
    <Link to={`/activities/${activity.id}`} className="text-green-600 hover:text-green-900 bg-green-50 p-1.5 rounded-[5px]" title="Chi tiết">
      <Eye className="w-4 h-4" />
    </Link>
  </div>
);

// TỐI ƯU 1: Đọc thẳng trường chữ thật của Khách hàng/Cơ hội từ Backend
export const RenderRelated = ({ activity }) => (
  <span className="text-[11px] bg-slate-100 px-2 py-1 rounded-[5px] text-slate-600 font-medium whitespace-nowrap">
    {activity.parentName || "Không có liên kết"}
  </span>
);

// TỐI ƯU 2: Đọc thẳng trường tên người tạo thật từ Backend
export const RenderCreatedBy = ({ activity }) => (
  <span className="whitespace-nowrap font-medium text-slate-700">
    {activity.createdByName || "Hệ thống"}
  </span>
);