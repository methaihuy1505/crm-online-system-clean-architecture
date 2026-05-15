import React from "react";

function ProductRow({ product, isActive, index, onSelect, onDelete, onEdit }) {
  return (
    <tr
      data-index={index}
      className={`group border-b border-slate-50 transition-colors duration-150 cursor-pointer ${
        isActive ? "bg-blue-50/70 hover:bg-blue-50" : "hover:bg-[#f3f4f5]"
      }`}
      onClick={() => onSelect(product)}
    >
      <td className="pl-8 py-0.5 overflow-hidden">
        <p
          className={`text-sm truncate block ${isActive ? "font-bold text-[#1a237e]" : "font-semibold text-[#191c1d]"}`}
          title={product.name}
        >
          {product.name}
        </p>
      </td>
      <td className="pl-2 py-0.5 overflow-hidden">
        <p className="text-[13px] font-mono text-slate-500 truncate block">
          {product.productCode}
        </p>
      </td>
      <td className="pl-2 py-0.5 overflow-hidden">
        <div className="flex">
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md border bg-blue-50 text-blue-700 border-blue-100 uppercase truncate">
            {product.categoryName || "N/A"}
          </span>
        </div>
      </td>
      <td className="pl-2 py-0.5 overflow-hidden">
        <p className="text-[13px] text-slate-500 truncate block">
          {product.uomName || "Cái"}
        </p>
      </td>
      <td className="pl-2 py-0.5 text-sm font-bold text-[#191c1d] overflow-hidden">
        <p className="truncate block">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(product.basePrice || 0)}
        </p>
      </td>
      <td className="pl-2 py-0.5 overflow-hidden">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-blue-600"></div>
          <span className="text-[12px] font-bold text-[#191c1d]">
            {product.vatRate}%
          </span>
        </div>
      </td>
      <td
        className={`pr-4 py-0.5 text-right transition-all ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <div className="flex justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product.id);
            }}
            className="px-1.5 py-0.5 text-slate-400 hover:text-blue-900 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              edit_square
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product.id);
            }}
            className="px-1.5 py-0.5 text-slate-400 hover:text-red-600 transition-colors"
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

export default React.memo(ProductRow);
