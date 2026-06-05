import { useState, useEffect } from "react";
import api from "../../../lib/api";
import toast from "react-hot-toast";
import DeleteConfirmModal from "./DeleteConfirmModal";



const inputCls = (hasError) =>
  `w-full bg-surface-container-low border-none rounded-lg px-3 py-2 text-sm transition-all outline-none focus:bg-white ${
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

export default function StageEdit({ open, stageId, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    probabilityDefault: "",
    isClosed: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (open && stageId) {
      setLoading(true);
      api
        .get(`/opportunity-stages/${stageId}`)
        .then((res) => {
          setForm({
            name: res.data.name || "",
            code: res.data.code || "",
            probabilityDefault:
              res.data.probabilityDefault !== undefined
                ? res.data.probabilityDefault
                : "",
            isClosed:
              res.data.isClosed !== undefined ? res.data.isClosed : true,
          });
          setErrors({});
        })
        .catch((err) => {
          const errorMessage = err.response?.data?.message || "Lỗi khi tải dữ liệu giai đoạn!";
          toast.error(errorMessage);
          console.error("Lỗi khi tải dữ liệu giai đoạn:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [open, stageId]);

  if (!open || !stageId) return null;

  const handleSave = async () => {
    const nextErrors = {};
    const trimmedName = form.name.trim();
    const trimmedCode = form.code.trim();

    if (!trimmedName) nextErrors.name = "Tên giai đoạn không được trống";

    if (form.probabilityDefault === "") {
      nextErrors.probabilityDefault = "Xác suất không được trống";
    } else {
      const prob = Number(form.probabilityDefault);
      if (isNaN(prob) || prob < 0 || prob > 100) {
        nextErrors.probabilityDefault = "Xác suất phải từ 0 đến 100";
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    try {
      await api.put(`/opportunity-stages/${stageId}`, {
        ...form,
        name: trimmedName,
        code: trimmedCode,
        probabilityDefault: parseInt(form.probabilityDefault, 10),
        isClosed: form.isClosed,
      });
      onSaved();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Lỗi khi cập nhật giai đoạn!";
      toast.error(errorMessage);
      console.error("Lỗi khi cập nhật giai đoạn:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/opportunity-stages/${stageId}`);
      onSaved();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Lỗi khi xóa giai đoạn!";
      toast.error(errorMessage);
      console.error("Lỗi khi xóa giai đoạn:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fade-in">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h3 className="text-sm font-bold text-on-surface tracking-tight">
            Chỉnh sửa giai đoạn
          </h3>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
          >
            XÓA MỤC NÀY
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="p-6 overflow-y-auto flex flex-col gap-4">
            <Field label="Tên giai đoạn *" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls(!!errors.name)}
              />
            </Field>
            <Field label="Mã giai đoạn *" error={errors.code}>
              <input
                type="text"
                value={form.code}
                disabled={true}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className={inputCls(!!errors.code)}
              />
            </Field>
            <Field
              label="Xác suất mặc định (%) *"
              error={errors.probabilityDefault}
            >
              <input
                type="number"
                min="0"
                max="100"
                value={form.probabilityDefault}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val === "") {
                    setForm({ ...form, probabilityDefault: "" });
                    return;
                  }
                  let num = parseInt(val, 10);
                  if (isNaN(num)) num = 0;
                  if (num > 100) num = 100;
                  if (num < 0) num = 0;
                  setForm({ ...form, probabilityDefault: num });
                }}
                className={inputCls(!!errors.probabilityDefault)}
              />
            </Field>
            <Field label="Loại quy trình">
              <select
                value={form.isClosed}
                onChange={(e) => setForm({ ...form, isClosed: e.target.value })}
                className={inputCls(false)}
              >
                <option value="false">Đang xử lý (OPEN)</option>
                <option value="true">Kết thúc quy trình (CLOSED)</option>
              </select>
            </Field>
          </div>
        )}

        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
          <p className="text-[0.65rem] text-slate-400 italic">
            Cập nhật thay đổi đồng bộ hệ thống.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-sm font-semibold text-on-surface bg-surface-container-low hover:bg-surface-variant rounded-lg transition-all"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="px-5 py-1.5 text-sm font-bold text-white rounded-lg bg-linear-to-br from-primary to-primary-container shadow-lg transition-all"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmModal
          targetName={form.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
