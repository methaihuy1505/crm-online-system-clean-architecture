import React from "react";
import { ChevronsUpDown } from "lucide-react";
import { formatDate, RenderActions, RenderRelated, RenderCreatedBy } from "./SharedCells";

export const EmailTable = ({ data, onEdit, onDelete, onToggleCompleted, onTogglePriority, onSortParentType, labelSubject = "Chủ đề Email", canView, canUpdate, canDelete, selectedRow, onRowClick, onRowDoubleClick }) => (
  <table className="w-full text-left border-collapse">
    <thead className="bg-slate-50 border-b border-slate-200">
      <tr>
        <th className="p-3 font-semibold text-slate-600 sticky top-0 bg-slate-50">{labelSubject}</th>
        <th className="p-3 font-semibold text-slate-600 sticky top-0 bg-slate-50">Ngày gửi</th>
        <th className="p-3 font-semibold text-slate-600 text-center sticky top-0 bg-slate-50">Quan trọng</th>
        <th className="p-3 font-semibold text-slate-600 text-center sticky top-0 bg-slate-50">Đã hoàn thành</th>
        <th className="p-3 font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 sticky top-0 bg-slate-50" onClick={onSortParentType}>
          <div className="flex items-center justify-center gap-1">Liên quan <ChevronsUpDown className="w-3 h-3 text-slate-400" /></div>
        </th>
        <th className="p-3 font-semibold text-slate-600 text-center sticky top-0 bg-slate-50">Người tạo</th>
        <th className="p-3 font-semibold text-slate-600 text-center sticky top-0 bg-slate-50">Công việc liên quan</th>
        <th className="p-3 font-semibold text-slate-600 text-center sticky top-0 bg-slate-50">Thao tác</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
      {data.map((act, index) => (
        <tr 
          key={act.id} 
          data-index={index}
          onClick={() => onRowClick && onRowClick(act, index)}
          onDoubleClick={() => canView && onRowDoubleClick && onRowDoubleClick(act)}
          className={`transition-colors cursor-pointer ${selectedRow?.id === act.id ? "bg-primary/5" : "hover:bg-slate-50/80"}`}
        >
          <td className="p-3 font-medium text-slate-800 truncate max-w-[150px]">{act.subject}</td>
          <td className="p-3 whitespace-nowrap">{formatDate(act.activityDate)}</td>
          <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
            <input type="checkbox" checked={act.isPriority || false} onChange={() => onTogglePriority(act)} disabled={!canUpdate} className="w-4 h-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" />
          </td>
          <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
            <input type="checkbox" checked={act.isCompleted || false} onChange={() => onToggleCompleted(act)} disabled={!canUpdate} className="w-4 h-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" />
          </td>
          <td className="p-3"><RenderRelated activity={act} /></td>
          <td className="p-3 text-center"><RenderCreatedBy activity={act} /></td>
          <td className="p-3 text-center truncate max-w-[120px]">{act.taskTitle || "-"}</td>
          <td className="p-3" onClick={(e) => e.stopPropagation()}>
            <RenderActions activity={act} onEdit={onEdit} onDelete={onDelete} canView={canView} canUpdate={canUpdate} canDelete={canDelete} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);