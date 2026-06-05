import React from "react";
import { Edit, Trash2 } from "lucide-react";

const fmt = (v) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

export default function OpportunityItemRow({ item, isActive, index, onSelect, onDelete, onEdit, canUpdate, canDelete }) {
  return (
    <tr
      data-index={index}
      className={`group border-b border-slate-50 transition-colors duration-150 cursor-pointer ${isActive ? "bg-blue-50/70 hover:bg-blue-50" : "hover:bg-[#f3f4f5]"}`}
      onClick={() => onSelect(item)}
    >
      <td className="pl-6 py-2 w-12 text-center text-xs font-semibold text-slate-400">{item.lineItemNumber || index + 1}</td>
      <td className="pl-4 py-2 max-w-[200px] overflow-hidden">
        <p className={`text-sm truncate block ${isActive ? "font-bold text-[#1a237e]" : "font-semibold text-[#191c1d]"}`} title={item.productName}>{item.productName}</p>
        {item.note && <span className="text-[10px] font-medium text-slate-400 truncate block mt-0.5" title={item.note}>📝 {item.note}</span>}
      </td>
      <td className="pl-2 py-2 text-center">
        <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">{item.quantity}</span>
        <span className="text-[11px] text-slate-400 ml-1 font-medium">{item.uomName || "Cái"}</span>
      </td>
      
      {/* ĐÃ BỎ FONT-MONO */}
      <td className="pl-2 py-2 text-right"><p className="text-[13px] font-bold text-[#191c1d]">{fmt(item.unitPrice)}</p></td>
      
      {/* ĐÃ BỎ FONT-MONO */}
      <td className="pl-2 py-2 text-right">
        {item.discountRate > 0 ? (
          <div><p className="text-[13px] font-bold text-rose-600">-{fmt(item.discountAmount)}</p><span className="text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100 px-1 rounded-sm">{item.discountRate}%</span></div>
        ) : <span className="text-xs text-slate-300">-</span>}
      </td>
      
      {/* ĐÃ BỎ FONT-MONO */}
      <td className="pl-2 py-2 text-center">
        <div className="inline-flex items-center gap-1 bg-blue-50/50 border border-blue-100/50 px-1.5 py-0.5 rounded-sm">
          <div className="w-1 h-1 rounded-full bg-blue-600"></div><span className="text-[11px] font-bold text-[#191c1d]">{item.vatRate}%</span>
        </div>
      </td>
      
      {/* ĐÃ BỎ FONT-MONO */}
      <td className="pl-2 py-2 text-right"><p className="text-sm font-black text-[#1A237E]">{fmt(item.finalLineTotal)}</p></td>
      
      
      <td className={`pr-4 py-2 text-right transition-all`}>
        <div className="flex justify-end gap-1.5">
          {canUpdate && (
              <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg outline-none transition-colors" title="Chỉnh sửa"><Edit size={16} /></button>
          )}
          {canDelete && (
              <button onClick={(e) => { e.stopPropagation(); onDelete(item); }} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg outline-none transition-colors" title="Xóa"><Trash2 size={16} /></button>
          )}
        </div>
      </td>
    </tr>
  );
}