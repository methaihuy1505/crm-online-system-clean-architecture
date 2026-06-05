import React from "react";
import { Edit, Trash2 } from "lucide-react"; // ĐỔI ICON

const formatCompactCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return "0 đ";
  const num = Number(value);
  if (num >= 1000000000) return `${(num / 1000000000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} Tỉ`;
  if (num >= 1000000) return `${(num / 1000000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} Triệu`;
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
};

const mapStyles = (stage, statusName) => {
  const stageStyleMap = {
    Qualification: "bg-purple-50 text-purple-700 border border-purple-100",
    Proposal: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    Negotiation: "bg-amber-50 text-amber-700 border border-amber-100",
  };
  const defaultStageStyle = "bg-slate-50 text-slate-700 border border-slate-200";

  const statusKey = String(statusName || "").toUpperCase();
  const statusStyleMap = {
    OPEN: "bg-blue-50 text-blue-700 border border-blue-100",
    WON: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    LOST: "bg-rose-50 text-rose-700 border border-rose-100",
  };
  const defaultStatusStyle = "bg-slate-50 text-slate-700 border border-slate-200";

  return { stage: stageStyleMap[stage] || defaultStageStyle, status: statusStyleMap[statusKey] || defaultStatusStyle };
};

// TRUYỀN THÊM QUYỀN CAN UPDATE, CAN DELETE
function OpportunityRow({ opp, isActive, index, onSelect, onDelete, onEdit, canUpdate, canDelete }) {
  const styles = mapStyles(opp.stageName, opp.statusName);

  return (
    <tr
      data-index={index}
      className={`group border-b border-slate-50 transition-colors duration-150 cursor-pointer ${
        isActive ? "bg-blue-50/70 hover:bg-blue-50" : "hover:bg-[#f3f4f5]"
      }`}
      onClick={() => onSelect(opp)}
    >
      <td className="pl-8 py-1 overflow-hidden">
        <p className={`text-sm truncate block ${isActive ? "font-bold text-[#1a237e]" : "font-semibold text-[#191c1d]"}`} title={opp.name}>{opp.name}</p>
      </td>
      <td className="pl-2 py-1 overflow-hidden">
        <p className="text-[13px] font-medium text-slate-600 truncate block">{opp.customerName || "Chưa có khách hàng"}</p>
      </td>
      <td className="pl-2 py-1 overflow-hidden">
        <p className="text-[13px] font-bold text-[#191c1d] truncate block">{formatCompactCurrency(opp.totalAmount)}</p>
      </td>
      <td className="pl-2 py-1 overflow-hidden">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
          <span className="text-[12px] font-bold text-[#191c1d]">{opp.probability}%</span>
        </div>
      </td>
      <td className="pl-2 py-1 overflow-hidden">
        <div className="flex"><span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase truncate ${styles.stage}`}>{opp.stageName || "N/A"}</span></div>
      </td>
      <td className="pl-2 py-1 overflow-hidden">
        <div className="flex"><span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${styles.status}`}>{opp.statusName || "N/A"}</span></div>
      </td>
      <td className={`pr-4 py-1 text-right transition-all`}>
        <div className="flex justify-end gap-1.5">
          {/* KIỂM TRA QUYỀN SỬA */}
          {canUpdate && (
            <button onClick={(e) => { e.stopPropagation(); onEdit(opp.id); }} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg outline-none transition-colors">
              <Edit size={16} />
            </button>
          )}
          {/* KIỂM TRA QUYỀN XÓA */}
          {canDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(opp); }} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg outline-none transition-colors">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default React.memo(OpportunityRow);