import React from "react";
import { Trash2 } from "lucide-react"; // ĐỔI ICON

export default function ConfirmModal({ isOpen, title, targetName, onConfirm, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4 mx-auto text-red-600">
          <Trash2 size={24} />
        </div>
        <h3 className="text-sm font-black text-slate-900 mb-1 uppercase">{title || "Xác nhận xóa"}</h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">{targetName}</p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors">Hủy bỏ</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-all shadow-md shadow-red-900/10">Đồng ý xóa</button>
        </div>
      </div>
    </div>
  );
}