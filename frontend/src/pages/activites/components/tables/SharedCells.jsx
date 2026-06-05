import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

// ĐÃ THÊM PROPS PHÂN QUYỀN VÀ ẨN/HIỆN
export const RenderActions = ({ activity, onEdit, onDelete, canView, canUpdate, canDelete }) => (
  <div className="flex gap-2 justify-center">
    {canUpdate && (
      <button onClick={() => onEdit(activity)} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1.5 rounded-[5px]" title="Sửa">
        <Edit className="w-4 h-4" />
      </button>
    )}
    {canDelete && (
      <button onClick={() => onDelete(activity.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-[5px]" title="Xóa">
        <Trash2 className="w-4 h-4" />
      </button>
    )}
    {canView && (
      <Link to={`/activities/${activity.id}`} className="text-green-600 hover:text-green-900 bg-green-50 p-1.5 rounded-[5px]" title="Chi tiết">
        <Eye className="w-4 h-4" />
      </Link>
    )}
  </div>
);

export const RenderRelated = ({ activity }) => (
  <span className="text-[11px] bg-slate-100 px-2 py-1 rounded-[5px] text-slate-600 font-medium whitespace-nowrap">
    {activity.parentName || "Không có liên kết"}
  </span>
);

export const RenderCreatedBy = ({ activity }) => (
  <span className="whitespace-nowrap font-medium text-slate-700">
    {activity.createdByName || "Hệ thống"}
  </span>
);