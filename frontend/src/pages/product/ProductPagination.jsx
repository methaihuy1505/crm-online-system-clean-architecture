import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductPagination({
  current, total, pageSize, onPageChange, onPageSizeChange, selectRef
}) {
  const totalPages = Math.ceil(total / pageSize) || 1;

  const getPages = () => {
    if (totalPages <= 7) return [...Array(totalPages)].map((_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (current >= totalPages - 3)
      return [1, "...", ...Array(5).fill(0).map((_, i) => totalPages - 4 + i)];
    return [1, "...", current - 1, current, current + 1, "...", totalPages];
  };

  const showing = Math.min(pageSize, total - (current - 1) * pageSize);

  return (
    <div className="px-4 py-3 bg-[#f3f4f5]/50 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4 shrink-0 z-10 relative">
      <div className="flex items-center gap-3">
        <p className="text-xs text-slate-500 font-medium">
          Hiển thị <span className="font-bold text-[#191c1d]">{showing}</span> /{" "}
          <span className="font-bold text-[#191c1d]">{total}</span> sản phẩm
        </p>
        <select
          value={pageSize}
          ref={selectRef}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="text-xs font-bold border border-slate-200 rounded-lg px-2 py-1 bg-white text-[#191c1d] outline-none cursor-pointer hover:border-slate-300 transition-colors"
        >
          {[10, 50, 100, 250].map((s) => (
            <option key={s} value={s}>{s} / trang</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <button
          disabled={current === 1}
          onClick={() => onPageChange(current - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-500 transition-all disabled:opacity-20 outline-none"
        >
          <ChevronLeft size={18} />
        </button>
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`dot-${i}`} className="w-8 text-center text-slate-400 text-xs select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-all outline-none ${
                current === p ? "bg-[#1a237e] text-white" : "hover:bg-white text-slate-500"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={current >= totalPages}
          onClick={() => onPageChange(current + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-500 transition-all disabled:opacity-20 outline-none"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}