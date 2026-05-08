import React from "react";

export default function ProductInspectionPanel({ selectedProduct }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-black uppercase tracking-widest text-[#1A237E]">
        Chi tiết nhanh
      </h3>
      {selectedProduct ? (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/50 animate-fadeIn">
          <div className="w-full h-40 bg-[#edeeef] rounded-xl mb-4 overflow-hidden border border-slate-100">
            <img
              src={
                selectedProduct.imageUrl || "https://via.placeholder.com/150"
              }
              className="w-full h-full object-cover"
              alt="preview"
            />
          </div>

          <div className="mb-4">
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded uppercase">
              {selectedProduct.productType || "Hàng hóa"}
            </span>
            <h4
              className="text-sm font-bold text-[#191c1d] mt-1 leading-tight truncate"
              title={selectedProduct.name}
            >
              {selectedProduct.name}
            </h4>
            <p className="text-xs text-slate-500 mt-2 line-clamp-3">
              {selectedProduct.description ||
                "Không có mô tả cho sản phẩm này."}
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <div className="flex justify-between text-[0.7rem]">
              <span className="text-slate-500 uppercase">Mã hệ thống</span>
              <span className="font-mono font-bold text-[#191c1d]">
                {selectedProduct.productCode}
              </span>
            </div>
            <div className="flex justify-between text-[0.7rem]">
              <span className="text-slate-500 uppercase">Đơn vị tính</span>
              <span className="font-bold text-[#191c1d]">
                {selectedProduct.uomName || "Cái"}
              </span>
            </div>
            <div className="flex justify-between text-[0.7rem]">
              <span className="text-slate-500 uppercase">Giá cơ bản</span>
              <span className="font-bold text-[#1a237e]">
                {formatCurrency(selectedProduct.basePrice)}
              </span>
            </div>
            <div className="flex justify-between text-[0.7rem]">
              <span className="text-slate-500 uppercase">Thuế VAT</span>
              <span className="font-bold text-[#191c1d]">
                {selectedProduct.vatRate}%
              </span>
            </div>
            {selectedProduct.depositOverride > 0 && (
              <div className="flex justify-between text-[0.7rem]">
                <span className="text-slate-500 uppercase">Đặt cọc</span>
                <span className="font-bold text-orange-600">
                  {formatCurrency(selectedProduct.depositOverride)}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
          <p className="text-xs text-slate-400">
            Chọn một sản phẩm để xem thông tin nhanh.
          </p>
        </div>
      )}
    </div>
  );
}
