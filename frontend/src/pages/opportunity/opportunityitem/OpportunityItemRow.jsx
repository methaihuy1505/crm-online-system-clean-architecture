import React from "react";

const fmt = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v || 0,
  );

export default function OpportunityItemRow({
  item,
  isActive,
  index,
  onSelect,
  onDelete,
  onEdit,
}) {
  return (
    <tr
      data-index={index}
      className={`group border-b border-slate-50 transition-colors duration-150 cursor-pointer ${
        isActive ? "bg-blue-50/70 hover:bg-blue-50" : "hover:bg-[#f3f4f5]"
      }`}
      onClick={() => onSelect(item)}
    >
      {/* STT / Line Number */}
      <td className="pl-6 py-2 w-12 text-center text-xs font-mono text-slate-400">
        {item.lineItemNumber || index + 1}
      </td>

      {/* Tên vật tư */}
      <td className="pl-4 py-2 max-w-[200px] overflow-hidden">
        <p
          className={`text-sm truncate block ${isActive ? "font-bold text-[#1a237e]" : "font-semibold text-[#191c1d]"}`}
          title={item.productName}
        >
          {item.productName}
        </p>
        {item.note && (
          <span
            className="text-[10px] font-medium text-slate-400 truncate block mt-0.5"
            title={item.note}
          >
            📝 {item.note}
          </span>
        )}
      </td>

      {/* Số lượng & Đơn vị tính */}
      <td className="pl-2 py-2 text-center">
        <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">
          {item.quantity}
        </span>
        <span className="text-[11px] text-slate-400 ml-1 font-medium">
          {item.uomName || "Cái"}
        </span>
      </td>

      {/* Đơn giá */}
      <td className="pl-2 py-2 text-right">
        <p className="text-[13px] font-mono font-bold text-slate-600">
          {fmt(item.unitPrice)}
        </p>
      </td>

      {/* Chiết khấu (Rate & Amount) */}
      <td className="pl-2 py-2 text-right">
        {item.discountRate > 0 ? (
          <div>
            <p className="text-[13px] font-mono font-bold text-rose-600">
              -{fmt(item.discountAmount)}
            </p>
            <span className="text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100 px-1 rounded-sm">
              {item.discountRate}%
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-300">-</span>
        )}
      </td>

      {/* Thuế VAT */}
      <td className="pl-2 py-2 text-center">
        <div className="inline-flex items-center gap-1 bg-blue-50/50 border border-blue-100/50 px-1.5 py-0.5 rounded-sm">
          <div className="w-1 h-1 rounded-full bg-blue-600"></div>
          <span className="text-[11px] font-mono font-bold text-blue-900">
            {item.vatRate}%
          </span>
        </div>
      </td>

      {/* Thành tiền (finalLineTotal) */}
      <td className="pl-2 py-2 text-right">
        <p className="text-sm font-mono font-black text-[#1A237E]">
          {fmt(item.finalLineTotal)}
        </p>
      </td>

      {/* Cụm nút Sửa/Xóa ẩn/hiện khi hover giống ProductRow */}
      <td
        className={`pr-6 py-2 text-right w-20 transition-all ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      >
        <div className="flex justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="p-1 text-slate-400 hover:text-blue-900 transition-colors"
            title="Sửa mặt hàng"
          >
            <span className="material-symbols-outlined text-[18px]">
              edit_square
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
            title="Xóa khỏi cơ hội"
          >
            <span className="material-symbols-outlined text-[18px]">
              delete
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
}
