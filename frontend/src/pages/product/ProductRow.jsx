import React from "react";
import { Edit, Trash2 } from "lucide-react";

function ProductRow({ product, isActive, index, onSelect, onDelete, onEdit }) {
  return (
    <tr
      data-index={index}
      className={`group border-b border-slate-50 transition-colors duration-150 cursor-pointer ${
        isActive ? "bg-blue-50/70 hover:bg-blue-50" : "hover:bg-slate-50/50"
      }`}
      onClick={() => onSelect(product)}
    >
      <td className="pl-8 py-2 overflow-hidden">
        <p className={`text-sm truncate block ${isActive ? "font-bold text-[#1a237e]" : "font-semibold text-[#191c1d]"}`} title={product.name}>
          {product.name}
        </p>
      </td>
      <td className="pl-2 py-2 overflow-hidden">
        <p className="text-[13px] font-mono text-slate-500 truncate block">
          {product.productCode}
        </p>
      </td>
      <td className="pl-2 py-2 overflow-hidden">
        <div className="flex">
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md border bg-blue-50 text-blue-700 border-blue-100 uppercase truncate">
            {product.categoryName || "N/A"}
          </span>
        </div>
      </td>
      <td className="pl-2 py-2 overflow-hidden">
        <p className="text-[13px] text-slate-500 truncate block">
          {product.uomName || "Cái"}
        </p>
      </td>
      <td className="pl-2 py-2 text-sm font-bold text-[#191c1d] overflow-hidden">
        <p className="truncate block">
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.basePrice || 0)}
        </p>
      </td>
      <td className="pl-2 py-2 overflow-hidden">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
          <span className="text-[12px] font-bold text-[#191c1d]">
            {product.vatRate}%
          </span>
        </div>
      </td>
      <td className={`pr-4 py-2 text-right transition-all ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <div className="flex justify-end gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(product.id); }}
            className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg outline-none transition-colors"
          >
            <Edit size={16} strokeWidth={2} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg outline-none transition-colors"
          >
            <Trash2 size={16} strokeWidth={2} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default React.memo(ProductRow);