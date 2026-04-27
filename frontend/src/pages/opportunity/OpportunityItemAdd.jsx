import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 1. Import Axios

// --- (Giữ nguyên component Icon và object ic, fmt, cls bên dưới) ---
function Icon({ path, size = 18, color = "currentColor", strokeWidth = 1.5 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}
const ic = {
  grid: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z",
  handshake: "M7 11l4.08 4.08a1 1 0 001.41 0L20 7M4 12l3 3 7-7M16 7h4v4",
  inventory:
    "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z",
  analytics:
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  settings:
    "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0",
  bell: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  help: "M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  chevR: "M9 5l7 7-7 7",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  barcode:
    "M4 7V4h3M4 17v3h3M17 4h3v3M17 20h3v-3M7 8v8M10 8v8M13 8v4M16 8v4M13 14v2M16 14v2",
  category: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  payments:
    "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  notes:
    "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  trash:
    "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  sync: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  eye: "M15 12a3 3 0 11-6 0 3 3 0 016 0M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
};
const fmt = (n) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
const inputCls =
  "w-full bg-[#f3f4f5] border-none rounded-lg py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#000666]/15 focus:bg-white transition-all";
const readonlyCls =
  "w-full bg-[#e7e8e9] border-none rounded-lg py-2.5 px-4 text-sm font-medium cursor-not-allowed text-slate-400";
const labelCls =
  "block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5";
const API_BASE_URL = "http://localhost:8080/api/v1/opportunity-items";
const PRODUCT_API = "http://localhost:8080/api/v1/products";
export default function AddEditLineItem() {
  const { id } = useParams();

  // --- States ---
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // Form States
  const [lineNum, setLineNum] = useState();
  const [qty, setQty] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [vatPct, setVatPct] = useState(0);
  const [discPct, setDiscPct] = useState(0);
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  // UI States
  const [toast, setToast] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  // --- 2. Fetch Data với Axios (Chỉ chạy 1 lần khi load trang) ---
  // --- Fetch Products ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch danh sách sản phẩm (Luôn cần)
        const resProducts = await axios.get(PRODUCT_API);
        const prodData = Array.isArray(resProducts.data)
          ? resProducts.data
          : resProducts.data.content || [];
        setProducts(prodData);

        // Nếu có ID trên URL, fetch thông tin chi tiết của Item đó để điền vào Form
        if (id) {
          const resItem = await axios.get(`${API_BASE_URL}/${id}`);
          const item = resItem.data;

          // Điền dữ liệu vào các ô input
          setLineNum(item.lineItemNumber);
          setQty(item.quantity);
          setUnitPrice(item.unitPrice);
          setVatPct(item.vatPercentage);
          setDiscPct(item.discountPercentage);
          setNotes(item.notes);

          // Tìm và set sản phẩm đang chọn trong danh sách products
          const prod = prodData.find((p) => p.productCode === item.productCode);
          if (prod) setSelectedProduct(prod);
        }
      } catch (err) {
        console.error("Lỗi fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]); // Chạy lại nếu ID thay đổi

  // --- Auto Calculation Toast ---
  useEffect(() => {
    if (!loading) {
      setToast(true);
      const t = setTimeout(() => setToast(false), 2200);
      return () => clearTimeout(t);
    }
  }, [qty, unitPrice, vatPct, discPct]);

  // --- Event Handlers ---
  const handleProductChange = (e) => {
    const prodCode = e.target.value;
    const product = products.find((p) => p.productCode === prodCode);
    if (product) {
      setSelectedProduct(product);
      setUnitPrice(product.basePrice || 0);
      setVatPct(product.vatRate || 0);
    } else {
      setSelectedProduct(null);
    }
  };

  const handleSave = async () => {
    if (!selectedProduct) {
      alert("Please select a product first!");
      return;
    }

    const payload = {
      // Phải là opportunityId (vì Backend gọi getOpportunityId)
      opportunityId: Number(id),

      // Phải là productId (Backend dùng Integer ID, không phải Code String)
      // Bạn cần lấy id của product, không phải productCode
      productId: selectedProduct.id,

      lineItemNumber: Number(lineNum),
      quantity: Number(qty),
      unitPrice: unitPrice,

      // Backend chờ vatRate và discountRate
      vatRate: vatPct,
      discountRate: discPct,

      // Backend chờ note (số ít)
      note: notes,
    };

    console.log("Dữ liệu chuẩn gửi đi:", payload);

    try {
      setIsSaving(true);
      // Nếu là sửa (đã có id của item), dùng PUT. Nếu tạo mới cho Opportunity, dùng POST.
      // Ở đây mình giả định bạn đang POST tạo mới cho Opportunity có ID là {id}
      const response = await axios.post(API_BASE_URL, payload);

      if (response.status === 200 || response.status === 201) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Chi tiết lỗi từ Backend:", err.response?.data);
      alert("Lỗi: " + (err.response?.data?.message || "Server Error"));
    } finally {
      setIsSaving(false);
    }
  };

  // --- Calculations ---
  if (loading)
    return (
      <div className="p-10 text-center font-bold text-[#1a237e]">
        Initializing System...
      </div>
    );

  const subtotal = qty * unitPrice;
  const discAmt = subtotal * (discPct / 100);
  const vatAmt = (subtotal - discAmt) * (vatPct / 100);
  const lineTotal = subtotal - discAmt + vatAmt;

  if (loading)
    return (
      <div className="p-10 text-center font-bold">Loading system data...</div>
    );

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-[#191c1d] overflow-hidden font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-end">
          <div>
            <h3
              className="text-3xl font-extrabold tracking-tight text-[#191c1d]"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Add / Edit Line Item
            </h3>
            <p className="text-slate-400 mt-1.5 text-sm">
              Modify product specifications and financial configurations for the
              active opportunity.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
              onClick={() => navigate(`/opportunitylineitems/${id}`)}
            >
              Cancel
            </button>
            <button
              onClick={handleSave} // Sử dụng handleSave tại đây
              disabled={isSaving} // Sử dụng isSaving để chặn bấm liên tục
              className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all 
                    ${isSaving ? "bg-slate-400 cursor-not-allowed" : "bg-[#1a237e] hover:bg-[#000666] text-white shadow-lg"}`}
            >
              <Icon path={ic.sync} size={14} color="white" />
              {isSaving ? "Saving..." : "Save Item"}
              {savedSuccess && (
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-black animate-bounce">
                  ✓ SAVED TO SYSTEM
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-8 space-y-6">
              <div className="bg-white rounded-xl border border-slate-100 p-7">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Opportunity Code</label>
                    <input
                      className={readonlyCls}
                      type="text"
                      value={id || "N/A"}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Line Item Number</label>
                    <input
                      className={inputCls}
                      type="number"
                      value={lineNum}
                      onChange={(e) => setLineNum(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Select Product</label>
                    <select
                      className={inputCls}
                      onChange={handleProductChange}
                      value={selectedProduct?.productCode || ""}
                    >
                      <option value="">-- Choose a product --</option>
                      {/* Thêm Array.isArray để bảo vệ */}
                      {Array.isArray(products) &&
                        products.map((p) => (
                          <option key={p.id} value={p.productCode}>
                            {p.productCode} | {p.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="opacity-60">
                    <label className={labelCls}>Product Name</label>
                    <input
                      className={readonlyCls}
                      readOnly
                      value={selectedProduct?.name || ""}
                    />
                  </div>
                  <div className="opacity-60">
                    <label className={labelCls}>UOM</label>
                    <input
                      className={readonlyCls}
                      readOnly
                      value={selectedProduct?.uom?.name || "Standard Unit"}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-white rounded-xl border border-slate-100 p-7">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Quantity</label>
                    <input
                      className={inputCls}
                      type="number"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Unit Price ($)</label>
                    <input
                      className={inputCls}
                      type="number"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mt-5">
                  <div className="p-4 bg-[#f3f4f5] rounded-lg">
                    <label className={labelCls}>VAT (%)</label>
                    <input
                      className="w-full bg-white rounded p-2 text-sm font-bold"
                      type="number"
                      value={vatPct}
                      onChange={(e) => setVatPct(Number(e.target.value))}
                    />
                  </div>
                  <div className="p-4 bg-[#f3f4f5] rounded-lg">
                    <label className={labelCls}>Discount (%)</label>
                    <input
                      className="w-full bg-white rounded p-2 text-sm font-bold"
                      type="number"
                      value={discPct}
                      onChange={(e) => setDiscPct(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-xl border border-slate-100 p-7">
                <label className={labelCls}>Editorial Notes</label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={inputCls + " resize-none"}
                  placeholder="Enter notes..."
                />
              </div>
            </div>

            {/* Right Column (Summary) */}
            <div className="col-span-4 space-y-6">
              <div className="bg-[#1a237e] text-white p-7 rounded-xl">
                <h4 className="text-[10px] font-bold tracking-widest text-[#8690ee] mb-6 uppercase">
                  Financial Summary
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between opacity-70">
                    <span>Subtotal</span>
                    <span>{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#33a0fd]">
                    <span>Discount</span>
                    <span>- {fmt(discAmt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT</span>
                    <span>+ {fmt(vatAmt)}</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] uppercase text-[#8690ee]">
                        Final Line Total
                      </span>
                      <div className="text-2xl font-black">
                        {fmt(lineTotal)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Preview */}
              <div className="bg-white rounded-xl border border-slate-100 p-5">
                <img
                  src={
                    selectedProduct?.imageUrl ||
                    "https://via.placeholder.com/150"
                  }
                  className="rounded-lg w-full aspect-video object-cover"
                  alt="Preview"
                />
                <p className="mt-2 font-bold text-center">
                  {selectedProduct?.name || "No Product Selected"}
                </p>
              </div>

              {/* Danger Zone */}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div
        className={`fixed bottom-8 right-8 bg-white p-4 rounded-xl shadow-2xl border-l-4 border-blue-900 transition-all ${toast ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <p className="text-sm font-bold">Calculation Updated</p>
      </div>
    </div>
  );
}
