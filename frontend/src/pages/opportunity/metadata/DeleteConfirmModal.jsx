import React from "react";

const iconStyle = {
  fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24",
};

export default function DeleteConfirmModal({
  targetName,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Container M3 Dialog chuẩn */}
      <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center border border-slate-100 transform transition-all scale-100">
        {/* Icon container M3 style (màu error nhẹ) */}
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
          <span
            className="material-symbols-outlined text-[28px]"
            style={iconStyle}
          >
            delete_forever
          </span>
        </div>

        {/* Nội dung M3 Typography */}
        <h3 className="text-md font-bold text-slate-900 mb-2 tracking-tight">
          Xác nhận xóa bản ghi?
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-6 px-2">
          Bạn chắc chắn muốn loại bỏ danh mục{" "}
          <span className="text-slate-900 font-bold italic">
            "{targetName}"
          </span>
          ? Toàn bộ quy trình liên kết có thể bị ảnh hưởng. Hành động không thể
          hoàn tác.
        </p>

        {/* Hàng nút bấm chuẩn M3 Alignment */}
        <div className="flex gap-3 w-full justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            HỦY BỎ
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-200 transition-all"
          >
            XÁC NHẬN XÓA
          </button>
        </div>
      </div>
    </div>
  );
}
