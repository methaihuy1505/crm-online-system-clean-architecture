import React from "react";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Xác nhận", cancelText = "Hủy" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 animate-in fade-in zoom-in duration-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{message}</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button 
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm transition-colors outline-none"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow-md shadow-red-600/20 transition-colors outline-none"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;