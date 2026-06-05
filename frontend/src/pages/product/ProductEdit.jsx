import { useState, useEffect, useCallback, useRef } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { X, Trash2, Upload, Image as ImageIcon, Edit2, AlertTriangle, Search as SearchIcon } from "lucide-react";
import { usePermission } from "../../hooks/usePermission";

const inputCls = (hasError) => `w-full bg-surface-container-low border-none rounded-lg px-3 py-2 text-sm transition-all outline-none focus:bg-white ${hasError ? "ring-1 ring-error/60 bg-red-50 focus:ring-error" : "focus:ring-1 focus:ring-primary/20"}`;

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[0.65rem] font-bold tracking-widest text-on-surface-variant uppercase">{label}</label>
      {children}
      {error && <span className="text-[0.6rem] text-error font-medium">{error}</span>}
    </div>
  );
}

// COMPONENT MỚI: Async Select cho Category (Cho Edit Modal)
function CategoryAsyncSelectEdit({ value, initialLabel, onChange, error, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("Chọn danh mục...");
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialLabel && value) {
      setSelectedLabel(initialLabel);
    } else if (!value) {
      setSelectedLabel("Chọn danh mục...");
    }
  }, [initialLabel, value]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/product-categories`, {
          params: { search: searchTerm, page: 0, size: 20 }
        });
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

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div 
        className={`${inputCls(error)} flex items-center justify-between ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`truncate ${!value ? "text-slate-400" : "text-slate-900"}`}>{selectedLabel}</span>
      </div>
      
      {isOpen && !disabled && (
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

function DeleteConfirmModal({ productName, onConfirm, onCancel }) { /* ...giữ nguyên code cũ... */
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={onCancel} />
      <div className="relative bg-white w-full max-w-sm rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-center w-14 h-14 bg-red-50 rounded-full mb-5 mx-auto">
          <AlertTriangle size={24} className="text-red-600" />
        </div>
        <h2 className="text-xl font-extrabold text-center mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>Xác nhận xóa sản phẩm</h2>
        <p className="text-center text-slate-500 text-sm mb-6">Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa <span className="font-bold text-on-surface">{productName}</span>?</p>
        <div className="flex flex-col gap-3">
          <button onClick={onConfirm} className="w-full py-2.5 bg-red-600 text-white rounded-lg font-bold text-sm outline-none">Xóa sản phẩm</button>
          <button onClick={onCancel} className="w-full py-2.5 bg-surface-container-low text-on-surface font-semibold rounded-lg text-sm outline-none">Hủy</button>
        </div>
      </div>
    </div>
  );
}

export default function EditProductModal({ open, onClose, onSaved, productId }) {
  const { hasPermission } = usePermission();
  const canUpdate = hasPermission("products.update");
  const canDelete = hasPermission("products.delete");

  const fileInputRef = useRef(null);
  const [uoms, setUoms] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const editInputRef = useRef(null);

  // Thêm field categoryName vào defaultForm
  const defaultForm = { id: null, productCode: "", name: "", categoryId: "", categoryName: "", productType: "PHYSICAL", uomId: "", description: "", basePrice: 0, vatRate: 0, depositOverride: 0, imageUrl: "", createdAt: null, updatedAt: null };
  const [form, setForm] = useState(defaultForm);

  const handleClose = useCallback(() => {
    setForm(defaultForm); setSelectedFile(null); setPreviewUrl(""); setShowDeleteConfirm(false); setErrors({}); onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open || !productId) return;
    (async () => {
      try {
        setLoading(true);
        // Chỉ gọi 2 API: Lấy chi tiết sản phẩm và danh sách UOM (vì UOM vẫn dùng <select>)
        const [prodRes, uomRes] = await Promise.all([
          api.get(`/products/${productId}`), 
          api.get("/uoms")
        ]);
        
        const productData = prodRes.data;
        // Ép kiểu ID sang String để khớp với select/input form
        productData.categoryId = productData.categoryId != null ? String(productData.categoryId) : "";
        productData.uomId = productData.uomId != null ? String(productData.uomId) : "";

        // API đã trả về sẵn categoryName rồi, ta chỉ việc ốp thẳng vào form
        setForm(productData); 
        setUoms(uomRes.data); 
        setPreviewUrl(""); 
        setSelectedFile(null); 
        setErrors({});
      } catch (err) {
        toast.error(err.response?.data?.message || "Không thể tải dữ liệu sản phẩm!");
        onClose();
      } finally { 
        setLoading(false); 
      }
    })();
  }, [open, productId]);

  const change = (fieldsName) => (e) => {
    if (!canUpdate) return;
    const value = e.target.value;
    let finalValue = value;
    if (["basePrice", "vatRate", "depositOverride"].includes(fieldsName)) {
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) finalValue = 0;
      else if (fieldsName === "basePrice") finalValue = Math.max(0, parsedValue);
      else if (fieldsName === "vatRate" || fieldsName === "depositOverride") finalValue = Math.min(100, Math.max(0, parsedValue));
    }
    setForm((prev) => ({ ...prev, [fieldsName]: finalValue }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const validate = () => {
    const e = {};
    if (!form.name?.toString().trim()) e.name = "Bắt buộc";
    if (!form.productCode?.toString().trim()) e.productCode = "Bắt buộc";
    if (!form.categoryId) e.categoryId = "Chọn danh mục";
    if (!form.uomId) e.uomId = "Chọn đơn vị";
    return e;
  };

  const formRef = useRef(form);
  useEffect(() => { formRef.current = form; }, [form]);

  const handleSave = async () => {
    if (!canUpdate) return;
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    try {
      setSaving(true);
      const formData = new FormData();
      const payload = {
        id: formRef.current.id ? parseInt(formRef.current.id, 10) : null,
        productCode: formRef.current.productCode, name: formRef.current.name,
        categoryId: formRef.current.categoryId ? parseInt(formRef.current.categoryId, 10) : null,
        uomId: formRef.current.uomId ? parseInt(formRef.current.uomId, 10) : null,
        productType: formRef.current.productType, basePrice: parseFloat(formRef.current.basePrice) || 0,
        vatRate: parseFloat(formRef.current.vatRate) || 0, depositOverride: parseFloat(formRef.current.depositOverride) || 0,
        description: formRef.current.description, imageUrl: formRef.current.imageUrl,
      };
      formData.append("product", new Blob([JSON.stringify(payload)], { type: "application/json" }));
      if (selectedFile) formData.append("image", selectedFile);
      await api.put(`/products/${formRef.current.id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Đã lưu thay đổi sản phẩm!");
      onSaved?.(); handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi lưu!");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!canDelete) return;
    try {
      await api.delete(`/products/${form.id}`);
      toast.success("Đã xóa sản phẩm!");
      onSaved?.(); handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi xóa sản phẩm!");
    }
  };

  const total = ((parseFloat(form.basePrice) || 0) * (1 + (parseFloat(form.vatRate) || 0) / 100)).toLocaleString("vi-VN", { minimumFractionDigits: 0 });
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-slate-50">
            <div>
              <p className="text-[0.6rem] font-bold text-blue-600 uppercase tracking-widest mb-0.5">Catalog Manager</p>
              <h2 className="text-lg font-extrabold text-primary-container" style={{ fontFamily: "Manrope, sans-serif" }}>
                {loading ? "Đang tải..." : (canUpdate ? `Chỉnh sửa: ${form.name}` : `Chi tiết: ${form.name}`)}
              </h2>
            </div>
            <div className="flex items-center gap-1">
              {canDelete && (
                <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-all text-sm font-semibold outline-none">
                  <Trash2 size={16} /> Xóa
                </button>
              )}
              <button onClick={handleClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-surface-container-low transition-all outline-none">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm py-16">Đang tải dữ liệu...</div>
          ) : (
            <div className="grid grid-cols-12 divide-x divide-slate-100 flex-1">
              <div className="col-span-8 px-6 py-4 flex flex-col gap-4">
                <Field label="Tên sản phẩm *" error={errors.name}>
                  <input type="text" ref={editInputRef} className={inputCls(!!errors.name)} value={form.name} onChange={change("name")} disabled={!canUpdate} placeholder="Nhập tên sản phẩm" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Mã sản phẩm *" error={errors.productCode}>
                    <input type="text" disabled={true} className={inputCls(!!errors.productCode)} value={form.productCode} onChange={change("productCode")} placeholder="VD: SP001" />
                  </Field>
                  <Field label="Loại sản phẩm">
                    <select className={inputCls(false) + " cursor-pointer"} value={form.productType} onChange={change("productType")} disabled={!canUpdate}>
                      <option value="PHYSICAL">Hàng hóa vật lý</option>
                      <option value="SERVICE">Gói dịch vụ</option>
                      <option value="DIGITAL">Sản phẩm kỹ thuật số</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Danh mục *" error={errors.categoryId}>
                    {/* DÙNG ASYNC SELECT CHO MÀN HÌNH EDIT */}
                    <CategoryAsyncSelectEdit
                      value={form.categoryId}
                      initialLabel={form.categoryName}
                      onChange={(id) => setForm(prev => ({ ...prev, categoryId: id }))}
                      error={!!errors.categoryId}
                      disabled={!canUpdate}
                    />
                  </Field>
                  <Field label="Đơn vị tính *" error={errors.uomId}>
                    <select className={inputCls(!!errors.uomId) + " cursor-pointer"} value={form.uomId} onChange={change("uomId")} disabled={!canUpdate}>
                      <option value="">-- Chọn đơn vị --</option>
                      {uoms.map((u) => (<option key={u.id} value={String(u.id)}>{u.name}</option>))}
                    </select>
                  </Field>
                </div>
                <Field label="Mô tả">
                  <textarea className={inputCls(false) + " resize-none"} rows={2} value={form.description} onChange={change("description")} disabled={!canUpdate} placeholder="Mô tả ngắn về sản phẩm..." />
                </Field>

                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[0.6rem] font-bold text-on-surface-variant uppercase tracking-widest mb-3">Thông số tài chính</p>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Giá bán lẻ (VND)">
                      <div className="relative">
                        <input type="number" min="0" className={inputCls(false) + " pr-10 font-mono"} value={form.basePrice} onChange={change("basePrice")} disabled={!canUpdate} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-semibold">đ</span>
                      </div>
                    </Field>
                    <Field label="Thuế VAT (%)">
                      <div className="relative">
                        <input type="number" min="0" max="100" className={inputCls(false) + " pr-6 font-mono"} value={form.vatRate} onChange={change("vatRate")} disabled={!canUpdate} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-semibold">%</span>
                      </div>
                    </Field>
                    <Field label="Đặt cọc (%)">
                      <div className="relative">
                        <input type="number" min="0" max="100" className={inputCls(false) + " pr-6 font-mono"} value={form.depositOverride} onChange={change("depositOverride")} disabled={!canUpdate} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-semibold">%</span>
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
                  <div
                    className={`relative group flex-1 min-h-0 bg-surface-container-low rounded-xl border-2 border-dashed border-slate-200 overflow-hidden ${canUpdate ? 'cursor-pointer' : ''}`}
                    onClick={() => canUpdate && fileInputRef.current?.click()}
                  >
                    {previewUrl || form.imageUrl ? (
                      <>
                        <img src={previewUrl || form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        {canUpdate && (
                          <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <div className="flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-1.5 bg-white/20 rounded-full border border-white/30">
                              <Edit2 size={14} /> Đổi ảnh
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                        <ImageIcon size={40} className="text-slate-300" />
                        <p className="text-[0.65rem] font-bold text-slate-300 uppercase text-center mt-1">Chưa có ảnh</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileChange} />
                  
                  {canUpdate && (
                    <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 border-2 border-primary/10 border-dashed rounded-lg flex items-center justify-center gap-1.5 hover:bg-surface-container-low transition-colors outline-none">
                      <Upload size={16} className="text-primary-container" />
                      <span className="text-[0.65rem] font-bold text-primary-container uppercase">Tải lên</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 shrink-0 bg-white">
            <p className="text-[0.65rem] text-slate-400 italic">
              {canUpdate ? "Các trường có dấu * là bắt buộc." : "Bạn đang xem ở chế độ chỉ đọc."}
            </p>
            <div className="flex gap-2">
              <button onClick={handleClose} className="px-4 py-1.5 text-sm font-semibold text-on-surface bg-surface-container-low hover:bg-surface-variant rounded-lg transition-all outline-none">
                Đóng
              </button>
              
              {canUpdate && (
                <button onClick={handleSave} disabled={saving || loading} className="px-5 py-1.5 text-sm font-bold text-white rounded-lg bg-linear-to-br from-primary to-primary-container shadow-lg hover:shadow-xl transition-all disabled:opacity-60 outline-none">
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {showDeleteConfirm && <DeleteConfirmModal productName={form.name} onConfirm={handleDelete} onCancel={() => setShowDeleteConfirm(false)} />}
    </>
  );
}