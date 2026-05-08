import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// ─── Helpers ────────────────────────────────────────────────────────────────

const inputCls = (hasError) =>
  `w-full bg-surface-container-low border-none rounded-lg px-3 py-2 text-sm
   transition-all outline-none focus:bg-white
   ${
     hasError
       ? "ring-1 ring-error/60 bg-red-50 focus:ring-error"
       : "focus:ring-1 focus:ring-primary/20"
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

// ─── Delete confirm ──────────────────────────────────────────────────────────

function DeleteConfirmModal({ productName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
        onClick={onCancel}
      />
      <div className="relative bg-white w-full max-w-sm rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-center w-14 h-14 bg-red-50 rounded-full mb-5 mx-auto">
          <span className="material-symbols-outlined text-red-600 text-2xl">
            warning
          </span>
        </div>
        <h2
          className="text-xl font-extrabold text-center mb-2"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Xác nhận xóa?
        </h2>
        <p className="text-center text-slate-500 text-sm mb-6">
          Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa{" "}
          <span className="font-bold text-on-surface">{productName}</span>?
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-2.5 bg-red-600 text-white rounded-lg font-bold text-sm"
          >
            Xóa sản phẩm
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2.5 bg-surface-container-low text-on-surface font-semibold rounded-lg text-sm"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Component chính ─────────────────────────────────────────────────────────

// Props:
//   open      : boolean
//   onClose   : () => void
//   onSaved   : () => void — cha gọi fetchProducts sau khi lưu/xóa thành công
//   productId : number | null
export default function EditProductModal({
  open,
  onClose,
  onSaved,
  productId,
}) {
  const fileInputRef = useRef(null); // dùng ref thay vì document.getElementById

  const [categories, setCategories] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const editInputRef = useRef(null);
  const defaultForm = {
    id: null,
    productCode: "",
    name: "",
    categoryId: "",
    productType: "PHYSICAL",
    uomId: "",
    description: "",
    basePrice: 0,
    vatRate: 0,
    depositOverride: 0,
    imageUrl: "",
    createdAt: null,
    updatedAt: null,
  };
  const [form, setForm] = useState(defaultForm);

  // useCallback để tránh warning exhaustive-deps
  const handleClose = useCallback(() => {
    setForm(defaultForm);
    setSelectedFile(null);
    setPreviewUrl("");
    setShowDeleteConfirm(false);
    setErrors({});
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  // Fetch khi modal mở + productId thay đổi
  useEffect(() => {
    if (!open || !productId) return;
    (async () => {
      try {
        setLoading(true);
        const [prodRes, catRes, uomRes] = await Promise.all([
          api.get(`/products/${productId}`),
          api.get("/product-categories"),
          api.get("/uoms"),
        ]);
        setForm(prodRes.data);
        setCategories(catRes.data);
        setUoms(uomRes.data);
        setPreviewUrl("");
        setSelectedFile(null);
        setErrors({});
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        alert("Không thể tải dữ liệu sản phẩm!");
        handleClose();
      } finally {
        setLoading(false);
      }
    })();
  }, [open, productId, handleClose]);
  useEffect(() => {
    // Focus khi modal mở HOẶC khi productId thay đổi (dữ liệu mới nạp xong)
    if (open) {
      const timer = setTimeout(() => {
        editInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [open, productId]);
  const change = (fieldName) => (e) => {
    let value = parseFloat(e.target.value);

    // Nếu ô nhập trống (người dùng đang xóa đi để nhập lại)
    if (isNaN(value)) {
      setForm((prev) => ({ ...prev, [fieldName]: "" }));
      return;
    }

    // Chặn logic cho từng trường dữ liệu
    if (fieldName === "basePrice") {
      value = Math.max(0, value); // Giá tiền không được âm
    }

    if (fieldName === "vatRate" || fieldName === "depositOverride") {
      value = Math.min(100, Math.max(0, value)); // Thuế và cọc chỉ được nằm trong khoảng 0 - 100
    }

    // Cập nhật lại state form của bạn (thay setForm bằng hàm update state thực tế bạn đang dùng)
    setForm((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Validate — trả về object lỗi, rỗng = hợp lệ
  const validate = () => {
    const e = {};
    if (!form.name?.toString().trim()) e.name = "Bắt buộc";
    if (!form.productCode?.toString().trim()) e.productCode = "Bắt buộc";
    if (!form.categoryId) e.categoryId = "Chọn danh mục";
    if (!form.uomId) e.uomId = "Chọn đơn vị";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append(
        "product",
        new Blob(
          [
            JSON.stringify({
              id: form.id,
              productCode: form.productCode,
              name: form.name,
              categoryId: form.categoryId
                ? parseInt(form.categoryId, 10)
                : null,
              uomId: form.uomId ? parseInt(form.uomId, 10) : null,
              productType: form.productType,
              basePrice: parseFloat(form.basePrice),
              vatRate: parseFloat(form.vatRate),
              depositOverride: parseFloat(form.depositOverride),
              description: form.description,
              imageUrl: form.imageUrl,
            }),
          ],
          { type: "application/json" },
        ),
      );
      if (selectedFile) formData.append("image", selectedFile);

      await api.put(`/products/${form.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSaved?.();
      handleClose();
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      alert("Có lỗi xảy ra khi lưu!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${form.id}`);
      onSaved?.();
      handleClose();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("Xóa thất bại!");
    }
  };

  const total = (
    (parseFloat(form.basePrice) || 0) *
    (1 + (parseFloat(form.vatRate) || 0) / 100)
  ).toLocaleString("vi-VN", { minimumFractionDigits: 0 });

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden">
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
            <div>
              <p className="text-[0.6rem] font-bold text-blue-600 uppercase tracking-widest mb-0.5">
                Catalog Manager
              </p>
              <h2
                className="text-lg font-extrabold text-primary-container"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                {loading ? "Đang tải..." : `Chỉnh sửa: ${form.name}`}
              </h2>
            </div>
            <div className="flex items-center gap-1">
              {/* Nút xóa trong header */}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-500
                           hover:bg-red-50 transition-all text-sm font-semibold"
              >
                <span className="material-symbols-outlined text-lg">
                  delete
                </span>
                Xóa
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-surface-container-low transition-all"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm py-16">
              Đang tải dữ liệu...
            </div>
          ) : (
            <div className="grid grid-cols-12 divide-x divide-slate-100 flex-1">
              {/* Cột trái — form chính (8/12) */}
              <div className="col-span-8 px-6 py-4 flex flex-col gap-4">
                {/* Hàng 1: Tên */}
                <Field label="Tên sản phẩm *" error={errors.name}>
                  <input
                    type="text"
                    ref={editInputRef}
                    className={inputCls(!!errors.name)}
                    value={form.name}
                    onChange={change("name")}
                    placeholder="Nhập tên sản phẩm"
                  />
                </Field>

                {/* Hàng 2: Mã + Loại */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Mã sản phẩm *" error={errors.productCode}>
                    <input
                      type="text"
                      disabled={true}
                      className={inputCls(!!errors.productCode)}
                      value={form.productCode}
                      onChange={change("productCode")}
                      placeholder="VD: SP001"
                    />
                  </Field>
                  <Field label="Loại sản phẩm">
                    <select
                      className={
                        inputCls(false) + " appearance-none cursor-pointer"
                      }
                      value={form.productType}
                      onChange={change("productType")}
                    >
                      <option value="PHYSICAL">Hàng hóa vật lý</option>
                      <option value="SERVICE">Gói dịch vụ</option>
                      <option value="DIGITAL">Sản phẩm kỹ thuật số</option>
                    </select>
                  </Field>
                </div>

                {/* Hàng 3: Danh mục + Đơn vị */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Danh mục *" error={errors.categoryId}>
                    <select
                      className={
                        inputCls(!!errors.categoryId) +
                        " appearance-none cursor-pointer"
                      }
                      value={form.categoryId}
                      onChange={change("categoryId")}
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Đơn vị tính *" error={errors.uomId}>
                    <select
                      className={
                        inputCls(!!errors.uomId) +
                        " appearance-none cursor-pointer"
                      }
                      value={form.uomId}
                      onChange={change("uomId")}
                    >
                      <option value="">-- Chọn đơn vị --</option>
                      {uoms.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Hàng 4: Mô tả */}
                <Field label="Mô tả">
                  <textarea
                    className={inputCls(false) + " resize-none"}
                    rows={2}
                    value={form.description}
                    onChange={change("description")}
                    placeholder="Mô tả ngắn về sản phẩm..."
                  />
                </Field>

                {/* ── Tài chính ── */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[0.6rem] font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                    Thông số tài chính
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Giá bán lẻ: Đã chuyển sang VND và cấu hình giới hạn >= 0 */}
                    <Field label="Giá bán lẻ (VND)">
                      <div className="relative">
                        <input
                          type="number"
                          min="0" // Giới hạn giao diện không cho giảm xuống dưới 0
                          className={inputCls(false) + " pr-10 font-mono"} // Đổi từ pl-6 sang pr-10 để nhường chỗ cho chữ "đ" bên phải
                          value={form.basePrice}
                          onChange={(e) => {
                            // Bạn có thể xử lý validate trực tiếp tại đây hoặc xử lý tập trung trong hàm change() như hướng dẫn bên dưới
                            change("basePrice")(e);
                          }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-semibold">
                          đ
                        </span>
                      </div>
                    </Field>

                    {/* Thuế VAT: Giới hạn từ 0% đến 100% */}
                    <Field label="Thuế VAT (%)">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className={inputCls(false) + " pr-6 font-mono"}
                          value={form.vatRate}
                          onChange={(e) => {
                            change("vatRate")(e);
                          }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-semibold">
                          %
                        </span>
                      </div>
                    </Field>

                    {/* Đặt cọc: Giới hạn từ 0% đến 100% */}
                    <Field label="Đặt cọc (%)">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className={inputCls(false) + " pr-6 font-mono"}
                          value={form.depositOverride}
                          onChange={(e) => {
                            change("depositOverride")(e);
                          }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-semibold">
                          %
                        </span>
                      </div>
                    </Field>
                  </div>

                  {/* Tổng realtime */}
                  <div className="mt-3 flex items-center justify-between px-3 py-2 bg-surface-container-low rounded-lg">
                    <span className="text-xs text-on-surface-variant">
                      Tổng (bao gồm VAT)
                    </span>
                    <span className="text-sm font-bold text-primary-container">
                      {total}đ
                    </span>
                  </div>
                </div>

                {/* Audit info — ngày tạo / cập nhật */}
                {(form.createdAt || form.updatedAt) && (
                  <div className="flex gap-4 pt-2 border-t border-slate-100">
                    {form.createdAt && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[0.6rem] text-on-surface-variant uppercase tracking-widest">
                          Ngày tạo
                        </span>
                        <span className="text-xs font-semibold">
                          {new Date(form.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    )}
                    {form.updatedAt && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[0.6rem] text-on-surface-variant uppercase tracking-widest">
                          Cập nhật cuối
                        </span>
                        <span className="text-xs font-semibold">
                          {new Date(form.updatedAt).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cột phải — ảnh + mã SP (4/12) */}
              <div className="col-span-4 px-5 py-4 flex flex-col gap-4 bg-[#fafafa]">
                <div className="flex flex-col gap-2 flex-1">
                  <p className="text-[0.6rem] font-bold tracking-widest text-on-surface-variant uppercase">
                    Hình ảnh
                  </p>

                  {/*
                    Khung ảnh — flex-1 chiếm hết chiều cao còn lại
                    Hover overlay để đổi ảnh
                  */}
                  <div
                    className="relative group flex-1 min-h-0 bg-surface-container-low rounded-xl
                               border-2 border-dashed border-slate-200 overflow-hidden cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {previewUrl || form.imageUrl ? (
                      <>
                        <img
                          src={previewUrl || form.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100
                                        transition-opacity flex items-center justify-center backdrop-blur-sm"
                        >
                          <div
                            className="flex items-center gap-1.5 text-white text-xs font-semibold
                                          px-3 py-1.5 bg-white/20 rounded-full border border-white/30"
                          >
                            <span className="material-symbols-outlined text-sm">
                              edit
                            </span>
                            Đổi ảnh
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                        <span className="material-symbols-outlined text-4xl text-slate-300">
                          image
                        </span>
                        <p className="text-[0.65rem] font-bold text-slate-300 uppercase text-center">
                          Nhấn để tải ảnh lên
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Input file ẩn — dùng ref */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 border-2 border-primary/10 border-dashed rounded-lg
                               flex items-center justify-center gap-1.5
                               hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-primary-container text-base">
                      upload_file
                    </span>
                    <span className="text-[0.65rem] font-bold text-primary-container uppercase">
                      Tải lên
                    </span>
                  </button>
                </div>

                {/* Mã sản phẩm badge */}
                <div className="bg-primary-container p-4 rounded-xl text-white shrink-0">
                  <p className="text-[0.6rem] font-bold tracking-widest uppercase opacity-60 mb-2">
                    Mã sản phẩm
                  </p>
                  <p className="text-sm font-bold font-mono">
                    {form.productCode || "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 shrink-0">
            <p className="text-[0.65rem] text-slate-400 italic">
              Các trường có dấu * là bắt buộc.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-1.5 text-sm font-semibold text-on-surface
                           bg-surface-container-low hover:bg-surface-variant
                           rounded-lg transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="px-5 py-1.5 text-sm font-bold text-white rounded-lg
                           bg-linear-to-br from-primary to-primary-container
                           shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirm — z cao hơn modal chính */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          productName={form.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}
