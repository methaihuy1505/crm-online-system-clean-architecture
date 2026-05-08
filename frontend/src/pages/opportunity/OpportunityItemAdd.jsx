import { useState, useEffect, useRef } from "react";
import axios from "axios";

// Hàm format tiền tệ
const fmt = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v,
  );

// Component Icon nội bộ để tối ưu
function Icon({ path, size = 18, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

// Chỉ giữ lại các Path cần thiết để tránh lỗi 'unused-vars'
const ICONS = {
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  close: "M18 6L6 18M6 6l12 12",
  save: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8",
};

export default function OpportunityItemAddModal({
  isOpen,
  onClose,
  opportunityId,
  itemId,
  onSuccess,
}) {
  const isEditMode = Boolean(itemId);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Sử dụng thay cho 'searching' bị báo lỗi
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dropdownRef = useRef(null);

  const [form, setForm] = useState({
    opportunityId: parseInt(opportunityId, 10),
    productId: "",
    quantity: 1,
    basePrice: 0,
    vatRate: 10,
    discountRate: 0,
    lineItemNumber: 1,
    note: "",
  });

  // Xử lý click ra ngoài dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tìm kiếm sản phẩm (Debounce)
  useEffect(() => {
    if (isEditMode || !searchTerm.trim()) return;
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/products/search`,
          {
            params: { keyword: searchTerm },
          },
        );
        setSearchResults(res.data || []);
      } catch (error) {
        console.error("Search error:", error); // Sử dụng biến error để tránh lỗi ESLint
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isEditMode]);

  const handleSave = async () => {
    if (!form.productId) return alert("Vui lòng chọn sản phẩm!");
    setLoading(true);
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:8080/api/v1/opportunity-items/${itemId}`,
          form,
        );
      } else {
        await axios.post(
          "http://localhost:8080/api/v1/opportunity-items",
          form,
        );
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Lưu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Logic tính toán hiển thị
  const rawSubtotal =
    (Number(form.quantity) || 0) * (Number(form.basePrice) || 0);
  const discountAmt = rawSubtotal * (Number(form.discountRate) / 100);
  const afterDiscount = rawSubtotal - discountAmt;
  const vatAmt = afterDiscount * (Number(form.vatRate) / 100);
  const lineTotal = afterDiscount + vatAmt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Header: Cố định, giảm padding */}
        <div className="px-5 py-3 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-sm font-black text-slate-700 uppercase">
            {isEditMode ? "Cập nhật sản phẩm" : "Thêm mới dòng hàng"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>

        {/* Body: No-scroll, chia cột 7-5 để bóp diện tích */}
        <div className="p-5 grid grid-cols-12 gap-5 overflow-hidden">
          {/* Cột trái: Form nhập (7/12) */}
          <div className="col-span-7 space-y-3">
            <div className="relative" ref={dropdownRef}>
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Tra cứu vật tư
              </label>
              <div className="relative flex items-center mt-1">
                <span className="absolute left-3 text-slate-400">
                  <Icon path={ICONS.search} size={16} />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  placeholder="Gõ tên sản phẩm..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 pl-9 text-sm focus:border-blue-900 outline-none"
                />
                {isSearching && (
                  <span className="absolute right-3 w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
                )}
              </div>

              {showDropdown && (
                <div className="absolute w-full bg-white border shadow-2xl rounded-lg mt-1 z-50 max-h-48 overflow-y-auto py-1">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedProduct(p);
                        setForm({
                          ...form,
                          productId: p.id,
                          basePrice: p.basePrice,
                        });
                        setSearchTerm(p.name);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm border-b last:border-0"
                    >
                      <div className="font-bold text-slate-800">{p.name}</div>
                      <div className="text-[10px] text-blue-600">
                        {fmt(p.basePrice)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Số lượng
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Đơn giá
                </label>
                <input
                  type="text"
                  readOnly
                  value={fmt(form.basePrice)}
                  className="w-full bg-slate-100 border rounded-lg p-2 text-sm mt-1 font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  VAT (%)
                </label>
                <input
                  type="number"
                  value={form.vatRate}
                  onChange={(e) =>
                    setForm({ ...form, vatRate: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Chiết khấu (%)
                </label>
                <input
                  type="number"
                  value={form.discountRate}
                  onChange={(e) =>
                    setForm({ ...form, discountRate: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 text-sm mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Ghi chú nhanh
              </label>
              <textarea
                rows={2}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="..."
                className="w-full border rounded-lg p-2 text-sm mt-1 resize-none"
              />
            </div>
          </div>

          {/* Cột phải: Summary & Preview (5/12) */}
          <div className="col-span-5 flex flex-col gap-4">
            <div className="bg-[#000666] text-white p-4 rounded-xl shadow-lg">
              <h3 className="text-[10px] font-bold opacity-60 uppercase mb-3">
                Tóm tắt giá trị dòng
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Thành tiền:</span>
                  <span>{fmt(rawSubtotal)}</span>
                </div>
                <div className="flex justify-between text-red-300">
                  <span>Giảm giá:</span>
                  <span>-{fmt(discountAmt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thuế VAT:</span>
                  <span>+{fmt(vatAmt)}</span>
                </div>
                <div className="border-t border-white/20 pt-2 mt-2 flex justify-between items-baseline">
                  <span className="font-bold">TỔNG CỘNG:</span>
                  <span className="text-xl font-black">{fmt(lineTotal)}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-3 bg-slate-50">
              <img
                src={
                  selectedProduct?.imageUrl ||
                  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300"
                }
                className="max-h-24 w-full object-contain rounded-lg mb-2"
                alt="Product"
              />
              <p className="text-[11px] font-bold text-slate-500 text-center uppercase tracking-tighter">
                {selectedProduct?.name || "Chưa xác định vật tư"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer: Cố định */}
        <div className="px-5 py-3 border-t flex justify-end gap-2 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600"
          >
            HỦY BỎ
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#000666] text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-800 transition-all disabled:opacity-50"
          >
            <Icon path={ICONS.save} size={14} />
            {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN LƯU"}
          </button>
        </div>
      </div>
    </div>
  );
}
