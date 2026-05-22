import { useState, useEffect } from "react";
import axios from "axios";
import DeleteConfirmModal from "./DeleteConfirmModal";

const api = axios.create({ baseURL: "http://localhost:8080/api/v1" });

export default function StatusEdit({ open, statusId, onClose, onSaved }) {
  const [form, setForm] = useState({ name: "", code: "", isFinal: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (open && statusId) {
      setLoading(true);
      api
        .get(`/opportunity-statuses/${statusId}`)
        .then((res) => {
          setForm({
            name: res.data.name || "",
            code: res.data.code || "",
            isFinal: res.data.isFinal || false,
          });
          setErrors({});
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [open, statusId]);

  if (!open || !statusId) return null;

  const handleSave = async () => {
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setErrors({ name: "Tên không được trống" });
      return;
    }
    setSaving(true);
    try {
      await api.put(`/opportunity-statuses/${statusId}`, {
        ...form,
        name: trimmedName,
        code: form.code.trim(),
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/opportunity-statuses/${statusId}`);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 uppercase">
            Sửa trạng thái
          </h3>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
          >
            XÓA MỤC NÀY
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[0.65rem] font-bold text-slate-400 uppercase">
                Tên trạng thái *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full bg-slate-100 border-none rounded-lg px-3 py-2 text-sm outline-none ${errors.name ? "ring-1 ring-red-400 bg-red-50" : ""}`}
              />
              {errors.name && (
                <span className="text-[0.6rem] text-red-500 font-medium">
                  {errors.name}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[0.65rem] font-bold text-slate-400 uppercase">
                Mã trạng thái
              </label>
              <input
                type="text"
                disabled={true}
                value={form.code}
                className="w-full bg-slate-100 border-none rounded-lg px-3 py-2 text-sm outline-none opacity-60 cursor-not-allowed"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mt-2 border">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Trạng thái cuối (Is Final)
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.isFinal}
                onChange={(e) =>
                  setForm({ ...form, isFinal: e.target.checked })
                }
                className="w-4 h-4 rounded border-slate-300 accent-indigo-900"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 px-6 py-3 border-t bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-400"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-5 py-1.5 text-xs font-bold text-white bg-[#1a237e] rounded-lg"
          >
            Lưu thay đổi
          </button>
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
