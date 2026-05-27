import React from "react";
import { ChevronsUpDown } from "lucide-react";
import { formatDate, RenderActions, RenderRelated, RenderCreatedBy } from "./SharedCells";

export const MeetingTable = ({ data, onEdit, onDelete, onToggleCompleted, onTogglePriority, onSortParentType }) => (
  <table className="w-full text-left border-collapse">
    <thead className="bg-slate-50 border-b border-slate-200">
      <tr>
        <th className="p-3 font-semibold text-slate-600">Chủ đề</th>
        <th className="p-3 font-semibold text-slate-600">Ngày bắt đầu</th>
        <th className="p-3 font-semibold text-slate-600 text-center">Quan trọng</th>
        <th className="p-3 font-semibold text-slate-600 text-center">Đã hoàn thành</th>
        <th className="p-3 font-semibold text-slate-600 cursor-pointer hover:bg-slate-100" onClick={onSortParentType}>
          <div className="flex items-center justify-center gap-1">Liên quan <ChevronsUpDown className="w-3 h-3 text-slate-400" /></div>
        </th>
        <th className="p-3 font-semibold text-slate-600 text-center">Người tạo</th>
        <th className="p-3 font-semibold text-slate-600 text-center">Công việc liên quan</th>
        <th className="p-3 font-semibold text-slate-600 text-center">Thao tác</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
      {data.map((act) => (
        <tr key={act.id} className="hover:bg-slate-50/80">
          <td className="p-3 font-medium text-slate-800 truncate max-w-[150px]">{act.subject}</td>
          <td className="p-3 whitespace-nowrap">{formatDate(act.startDate || act.activityDate)}</td>
          <td className="p-3 text-center"><input type="checkbox" checked={act.isPriority || false} onChange={() => onTogglePriority(act)} className="w-4 h-4 cursor-pointer" /></td>
          <td className="p-3 text-center"><input type="checkbox" checked={act.isCompleted || false} onChange={() => onToggleCompleted(act)} className="w-4 h-4 cursor-pointer" /></td>
          <td className="p-3"><RenderRelated activity={act} /></td>
          <td className="p-3 text-center"><RenderCreatedBy activity={act} /></td>
          <td className="p-3 text-center truncate max-w-[120px]">{act.taskTitle || "-"}</td>
          <td className="p-3"><RenderActions activity={act} onEdit={onEdit} onDelete={onDelete} /></td>
        </tr>
      ))}
    </tbody>
  </table>
);