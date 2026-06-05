import { useState, useEffect, useRef } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { X, Image as ImageIcon, Upload, Edit2, Search as SearchIcon } from "lucide-react"; // ĐỒNG BỘ LUCIDE-REACT

const PRODUCT_TYPE_OPTIONS = { PHYSICAL: "Hàng hóa vật lý", SERVICE: "Gói dịch vụ", DIGITAL: "Sản phẩm kỹ thuật số" };

const inputCls = (hasError) => `w-full bg-surface-container-low border-none rounded-lg px-3 py-2 text-sm transition-all outline-none focus:ring-1 focus:bg-white ${hasError ? "ring-1 ring-error/60 bg-red-50 focus:ring-error" : "focus:ring-primary/20"}`;

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[0.65rem] font-bold tracking-widest text-on-surface-variant uppercase">{label}</label>
      {children}
      {error && <span className="text-[0.6rem] text-error font-medium">{error}</span>}
    </div>
  );
}

// COMPONENT MỚI: Async Select cho Category
function CategoryAsyncSelect({ value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("Chọn danh mục...");
  const wrapperRef = useRef(null);

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lấy dữ liệu khi có thay đổi từ khóa (Debounce 300ms)
  useEffect(() => {
    if (!isOpen) return;
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // Gọi API có phân trang và tìm kiếm (đã làm ở bước Backend)
        const res = await api.get(`/product-categories`, {
          params: { search: searchTerm, page: 0, size: 20 }
        });
        // API trả về Page<ProductCategoryResponse>, ta lấy mảng data bên trong `content`
        const dataList = res.data.content || res.data || []; 
        setOptions(dataList);
      } catch (err) {
        console.error("Lỗi lấy danh mục:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchCategories, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  // Cập nhật Label nếu value từ form bị reset
  useEffect(() => {
    if (!value) {
      setSelectedLabel("Chọn danh mục...");
    }
  }, [value]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div 
        className={`${inputCls(error)} flex items-center justify-between cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`truncate ${!value ? "text-slate-400" : "text-slate-900"}`}>{selectedLabel}</span>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-slate-100 flex items-center bg-slate-50">
            <SearchIcon size={14} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-400"
              placeholder="Gõ để tìm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <ul className="overflow-y-auto flex-1 p-1 custom-scrollbar">
            {loading ? (
              <li className="px-3 py-2 text-xs text-slate-500 text-center italic">Đang tìm kiếm...</li>
            ) : options.length > 0 ? (
              options.map(cat => (
                <li 
                  key={cat.id} 
                  className="px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer rounded-md truncate transition-colors"
                  onClick={() => {
                    onChange(cat.id);
                    setSelectedLabel(cat.name);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {cat.name}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-xs text-slate-500 text-center italic">Không tìm thấy kết quả.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}


export default function AddProductModal({ open, onClose, onSaved }) {
  const fileInputRef = useRef(null);
  const [uoms, setUoms] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);
  const defaultForm = { name: "", code: "", type: "PHYSICAL", categoryId: "", uomId: "", description: "", basePrice: "0", vat: "10", deposit: "0" };
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        // Chỉ cần fetch UOM (đơn vị tính thường ít, dùng <select> vẫn ổn)
        const uomRes = await api.get("/uoms");
        setUoms(uomRes.data);
        setForm((p) => ({ ...p, uomId: uomRes.data[0]?.id ?? "" }));
      } catch (err) { console.error("Lỗi lấy UOM:", err); }
    })();
  }, [open]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => { inputRef.current?.focus(); }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Giữ nguyên các hàm nhập và lưu ...
  const set = (fieldsName) => (e) => {
    let value = e.target.value;
    let finalValue = value;
    let parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) value = 0;
    else if (fieldsName === "basePrice") finalValue = Math.max(0, parsedValue);
    else if (fieldsName === "vat" || fieldsName === "deposit") finalValue = Math.min(100, Math.max(0, parsedValue));
    else finalValue = value;
    setForm((prev) => ({ ...prev, [fieldsName]: finalValue }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setSelectedFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleClose = () => {
    setForm(defaultForm); setSelectedFile(null); setImagePreview(""); setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Bắt buộc";
    if (!form.code.trim()) e.code = "Bắt buộc";
    if (!form.categoryId) e.categoryId = "Chọn danh mục";
    if (!form.uomId) e.uomId = "Chọn đơn vị";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    try {
      setSaving(true);
      const data = new FormData();
      const productPayload = {
        productCode: form.code, name: form.name, categoryId: parseInt(form.categoryId),
        uomId: parseInt(form.uomId), productType: form.type, basePrice: parseFloat(form.basePrice) || 0,
        vatRate: parseFloat(form.vat) || 0, depositOverride: parseFloat(form.deposit) || 0, imageUrl: "", description: form.description || "",
      };
      data.append("product", new Blob([JSON.stringify(productPayload)], { type: "application/json" }));
      if (selectedFile) data.append("image", selectedFile);
      await api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } });
      onSaved?.(); handleClose(); toast.success("Thêm thành công!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể thêm sản phẩm!");
    } finally { setSaving(false); }
  };

  const total = ((parseFloat(form.basePrice) || 0) * (1 + (parseFloat(form.vat) || 0) / 100)).toLocaleString("vi-VN", { minimumFractionDigits: 0 });
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <p className="text-[0.6rem] font-bold text-blue-600 uppercase tracking-widest mb-0.5">Catalog Manager</p>
            <h2 className="text-lg font-extrabold text-primary-container">Thêm sản phẩm mới</h2>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-surface-container-low transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-12 divide-x divide-slate-100 flex-1">
          <div className="col-span-8 px-6 py-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Field label="Tên sản phẩm *" error={errors.name}>
                  <input type="text" ref={inputRef} className={inputCls(!!errors.name)} value={form.name} maxLength={50} onChange={set("name")} placeholder="Nhập tên sản phẩm" />
                </Field>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Mã sản phẩm *" error={errors.code}>
                <input type="text" className={inputCls(!!errors.code)} value={form.code} maxLength={50} onChange={set("code")} placeholder="VD: SP001" />
              </Field>
              <Field label="Loại sản phẩm">
                <select className={inputCls(false) + " appearance-none cursor-pointer"} value={form.type} onChange={set("type")}>
                  {Object.entries(PRODUCT_TYPE_OPTIONS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Danh mục *" error={errors.categoryId}>
                {/* DÙNG ASYNC SELECT THAY CHO THẺ SELECT CŨ */}
                <CategoryAsyncSelect 
                  value={form.categoryId} 
                  onChange={(id) => setForm(prev => ({ ...prev, categoryId: id }))} 
                  error={!!errors.categoryId}
                />
              </Field>
              <Field label="Đơn vị tính *" error={errors.uomId}>
                <select className={inputCls(!!errors.uomId) + " appearance-none cursor-pointer"} value={form.uomId} onChange={set("uomId")}>
                  <option value="">-- Chọn đơn vị --</option>
                  {uoms.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
                </select>
              </Field>
            </div>
            <Field label="Mô tả">
              <textarea className={inputCls(false) + " resize-none"} rows={2} value={form.description} onChange={set("description")} placeholder="Mô tả ngắn về sản phẩm..." />
            </Field>

            <div className="pt-3 border-t border-slate-100">
              <p className="text-[0.6rem] font-bold text-on-surface-variant uppercase tracking-widest mb-3">Thông số tài chính</p>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Giá cơ bản (VND)">
                  <div className="relative">
                    <input type="number" min="0" className={inputCls(false) + " pr-10 font-mono"} value={form.basePrice} onChange={(e) => { set("basePrice")(e); }} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-semibold">đ</span>
                  </div>
                </Field>
                <Field label="Thuế VAT (%)">
                  <div className="relative">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-semibold">%</span>
                    <input type="number" min="0" max="100" className={inputCls(false) + " pr-6 font-mono"} value={form.vat} onChange={(e) => { let val = parseFloat(e.target.value) || 0; if (val < 0) val = 0; if (val > 100) val = 100; set("vat")(e); }} />
                  </div>
                </Field>
                <Field label="Đặt cọc (%)">
                  <div className="relative">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-semibold">%</span>
                    <input type="number" min="0" max="100" className={inputCls(false) + " pr-6 font-mono"} value={form.deposit} onChange={(e) => { let val = parseFloat(e.target.value) || 0; if (val < 0) val = 0; if (val > 100) val = 100; set("deposit")(e); }} />
                  </div>
                </Field>
              </div>
              <div className="mt-3 flex items-center justify-between px-3 py-2 bg-surface-container-low rounded-lg">
                <span className="text-xs text-on-surface-variant">Tổng (bao gồm VAT)</span>
                <span className="text-sm font-bold text-primary-container">{total}đ</span>
              </div>
            </div>
          </div>

          <div className="col-span-4 px-5 py-4 flex flex-col gap-4 bg-[#fafafa]">
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-[0.6rem] font-bold tracking-widest text-on-surface-variant uppercase">Hình ảnh</p>
              <div className="relative group flex-1 min-h-0 bg-surface-container-low rounded-xl border-2 border-dashed border-slate-200 overflow-hidden cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <div className="flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-1.5 bg-white/20 rounded-full border border-white/30">
                        {/* FIX: ĐÃ SỬA THÀNH LUCIDE ICON ĐỂ ĐỒNG BỘ UI */}
                        <Edit2 size={14} /> Đổi ảnh 
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                    <ImageIcon size={40} className="text-slate-300" />
                    <p className="text-[0.65rem] font-bold text-slate-300 uppercase text-center">Nhấn để tải ảnh lên</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileChange} />
              
              <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 border-2 border-primary/10 border-dashed rounded-lg flex items-center justify-center gap-1.5 hover:bg-surface-container-low transition-colors outline-none">
                 {/* FIX: ĐÃ SỬA THÀNH LUCIDE ICON */}
                <Upload size={16} className="text-primary-container" />
                <span className="text-[0.65rem] font-bold text-primary-container uppercase">Tải lên</span>
              </button>
            </div>
            <div className="bg-primary-container p-4 rounded-xl text-white shrink-0">
              <p className="text-[0.6rem] font-bold tracking-widest uppercase opacity-60 mb-2">Trạng thái</p>
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-70">Tình trạng</span>
                <span className="text-xs font-bold">Mới tạo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 shrink-0">
          <p className="text-[0.65rem] text-slate-400 italic">Các trường có dấu * là bắt buộc.</p>
          <div className="flex gap-2">
            <button onClick={handleClose} className="px-4 py-1.5 text-sm font-semibold text-on-surface bg-surface-container-low hover:bg-surface-variant rounded-lg transition-all outline-none">Hủy</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-1.5 text-sm font-bold text-white rounded-lg bg-linear-to-br from-primary to-primary-container shadow-lg hover:shadow-xl transition-all disabled:opacity-60 outline-none">
              {saving ? "Đang lưu..." : "Lưu sản phẩm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}