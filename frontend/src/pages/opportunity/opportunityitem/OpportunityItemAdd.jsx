import React, { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080/api/v1" });

const fmt = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v || 0,
  );

const inputCls = (hasError) =>
  `w-full bg-surface-container-low border-none rounded-lg px-3 py-2 text-sm transition-all outline-none focus:bg-white focus:ring-1 ${
    hasError
      ? "ring-1 ring-error/60 bg-red-50 focus:ring-error"
      : "focus:ring-primary/20"
  }`;

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[0.65rem] font-bold tracking-widest text-on-surface-variant uppercase">
        {label}
      </label>
      {children}
      {error && (
        <span className="text-[0.6rem] text-error font-medium">{error}</span>
      )}
    </div>
  );
}

export default function OpportunityItemModal({
  isOpen,
  onClose,
  opportunityId,
  editItem,
  onSuccess,
}) {
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    productId: "",
    quantity: 1,
    unitPrice: 0,
    discountRate: 0,
    lineItemNumber: 0,
    vatRate: 10,
    note: "",
  });

  // Tìm kiếm vật tư nâng cao kết hợp Debounce tránh spam API
  useEffect(() => {
    if (!isOpen) return;
    if (editItem) return; // Nếu đang sửa thì không tìm kiếm lại

    if (searchProduct.trim().length > 1) {
      const delayDebounce = setTimeout(() => {
        api
          .get(`/products?search=${searchProduct}`)
          .then((res) => {
            // SỬA TẠI ĐÂY: Log của bạn cho thấy data là một mảng trực tiếp, không nằm trong .content
            const data = Array.isArray(res.data)
              ? res.data
              : res.data?.content || [];
            setProducts(data);
          })
          .catch((err) => console.error(err));
      }, 300); // Đợi gõ xong 300ms mới gọi API

      return () => clearTimeout(delayDebounce);
    } else {
      setProducts([]);
    }
  }, [isOpen, searchProduct, editItem]);

  // Đổ dữ liệu cũ nếu ở chế độ Edit (Sửa)
  useEffect(() => {
    if (!isOpen) return;
    if (editItem) {
      setSelectedProduct({
        id: editItem.productId,
        name: editItem.productName,
      });
      setForm({
        productId: editItem.productId,
        quantity: editItem.quantity,
        unitPrice: editItem.unitPrice,
        discountRate: editItem.discountRate,
        lineItemNumber: editItem.lineItemNumber,
        vatRate: editItem.vatRate,
        note: editItem.note || "",
      });
    } else {
      setSelectedProduct(null);
      setSearchProduct("");
      setForm({
        productId: "",
        quantity: 1,
        unitPrice: 0,
        discountRate: 0,
        lineItemNumber: 0,
        vatRate: 10,
        note: "",
      });
    }
    setErrors({});
  }, [isOpen, editItem]);

  if (!isOpen) return null;

  // Xử lý tính toán xem trước (Preview) số tiền thời gian thực
  const totalPrice = form.quantity * form.unitPrice;
  const discountAmount = (totalPrice * form.discountRate) / 100;
  const priceAfterDiscount = totalPrice - discountAmount;
  const vatAmount = (priceAfterDiscount * form.vatRate) / 100;
  const finalLineTotal = priceAfterDiscount + vatAmount;

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    setForm((prev) => ({
      ...prev,
      productId: prod.id,
      unitPrice: prod.basePrice || 0,
      vatRate: prod.vatRate || 10,
    }));
    setSearchProduct("");
    setProducts([]);
  };

  const validate = () => {
    let errs = {};
    if (!form.productId) errs.productId = "Vui lòng chọn một mặt hàng/vật tư.";
    if (Number(form.quantity) <= 0) errs.quantity = "Số lượng phải lớn hơn 0.";
    if (Number(form.unitPrice) < 0) errs.unitPrice = "Đơn giá không hợp lệ.";
    if (Number(form.discountRate) < 0 || Number(form.discountRate) > 100)
      errs.discountRate = "Tỉ lệ chiết khấu từ 0 - 100%.";
    setErrors(errs);
    if (Number(form.vatRate) < 0 || Number(form.vatRate) > 10)
      errs.vatRate = "Tỉ lệ Vat từ 0 - 10%.";
    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form, opportunityId: Number(opportunityId) };
      if (editItem) {
        await api.put(`/opportunity-items/${editItem.id}`, payload);
      } else {
        await api.post(`/opportunity-items`, payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({ global: "Có lỗi xảy ra trong quá trình xử lý lưu." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
          <h3
            className="text-base font-black text-[#1A237E] uppercase"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {editItem
              ? "Cập nhật mặt hàng trong cơ hội"
              : "Thêm mặt hàng vào cơ hội"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-200"
          >
            <span className="material-symbols-outlined block">close</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4 flex-1">
          {/* Ô tìm kiếm vật tư */}
          <Field label="Mặt hàng / Vật tư" error={errors.productId}>
            {editItem ? (
              <input
                className={inputCls(false)}
                value={selectedProduct?.name || ""}
                disabled
              />
            ) : selectedProduct ? (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <span className="text-sm font-semibold text-blue-900 truncate">
                  {selectedProduct.name}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="text-xs font-bold text-red-500 hover:text-red-700"
                >
                  Thay đổi
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  className={inputCls(errors.productId)}
                  placeholder="Nhập tên hoặc mã sản phẩm để tìm kiếm..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                />
                {products.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex justify-between items-center text-xs border-b border-slate-100 transition-colors"
                        onClick={() => handleSelectProduct(p)}
                      >
                        <span className="font-medium text-slate-700">
                          {p.name}
                        </span>
                        <span className="font-bold text-blue-800">
                          {fmt(p.basePrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            {/* Số lượng */}
            <Field label="Số lượng" error={errors.quantity}>
              <input
                type="number"
                className={inputCls(errors.quantity)}
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: Number(e.target.value) })
                }
              />
            </Field>

            {/* Đơn giá */}
            <Field label="Đơn giá (VNĐ)" error={errors.unitPrice}>
              <input
                type="number"
                className={inputCls(errors.unitPrice)}
                disabled={true} // Đơn giá được tự động điền theo sản phẩm, không cho sửa tay
                value={form.unitPrice}
                onChange={(e) =>
                  setForm({ ...form, unitPrice: Number(e.target.value) })
                }
              />
            </Field>

            {/* Tỷ lệ Chiết khấu */}
            <Field label="Chiết khấu (%)" error={errors.discountRate}>
              <input
                type="number"
                className={inputCls(errors.discountRate)}
                value={form.discountRate}
                onChange={(e) =>
                  setForm({ ...form, discountRate: Number(e.target.value) })
                }
              />
            </Field>

            {/* Tỷ lệ Thuế VAT */}
            <Field label="Thuế VAT (%)" error={errors.vatRate}>
              <input
                type="number"
                className={inputCls(errors.vatRate)}
                value={form.vatRate}
                onChange={(e) =>
                  setForm({ ...form, vatRate: Number(e.target.value) })
                }
              />
            </Field>
          </div>

          {/* Ghi chú mặt hàng */}
          <Field label="Ghi chú mặt hàng">
            <textarea
              className={inputCls(false)}
              rows={2}
              placeholder="Nhập yêu cầu đặc biệt về cấu hình, đóng gói, giao nhận..."
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </Field>

          {/* Bảng xem trước tài chính */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-2.5 mt-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Bảng tính toán xem trước thành tiền
            </p>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Tổng tiền gốc (Số lượng × Đơn giá):</span>
              <span className="font-mono">{fmt(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-xs text-red-600">
              <span>Tiền chiết khấu trừ ra:</span>
              <span className="font-mono">-{fmt(discountAmount)}</span>
            </div>
            <div className="flex justify-between text-xs text-green-600">
              <span>Tiền thuế VAT cộng thêm:</span>
              <span className="font-mono">+{fmt(vatAmount)}</span>
            </div>
            <div className="h-px bg-slate-200 my-1" />
            <div className="flex justify-between items-center text-sm font-black text-[#1A237E]">
              <span>Thành tiền cuối cùng:</span>
              <span className="text-base font-black font-mono">
                {fmt(finalLineTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t flex justify-end gap-2 bg-slate-50 items-center">
          {errors.global && (
            <span className="text-xs text-error font-semibold mr-auto">
              {errors.global}
            </span>
          )}
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-1.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            type="button"
            className="px-5 py-1.5 text-sm font-bold text-white rounded-lg bg-[#1A237E] shadow-md hover:opacity-90 transition-all disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : "Lưu dữ liệu"}
          </button>
        </div>
      </div>
    </div>
  );
}
