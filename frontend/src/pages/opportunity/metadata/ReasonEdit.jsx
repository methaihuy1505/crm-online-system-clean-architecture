import { useState, useEffect } from "react";
import api from "../../../lib/api";
import toast from "react-hot-toast";
import DeleteConfirmModal from "./DeleteConfirmModal";


export default function ReasonEdit({ open, reasonId, onClose, onSaved }) {
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (open && reasonId) {
      setLoading(true);
      api
        .get(`/lost-reasons/${reasonId}`)
        .then((res) => {
          setForm({
            code: res.data.code || res.data.code || "",
            name: res.data.name || res.data.name || "",
            description: res.data.description || "",
          });
          setErrors({});
        })
        .catch((err) => {
          const errorMessage = err.response?.data?.message || "Lỗi khi tải dữ liệu lý do thất bại!";
          toast.error(errorMessage);
          console.error("Lỗi khi tải dữ liệu lý do thất bại:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [open, reasonId]);

  if (!open || !reasonId) return null;

  const handleSave = async () => {
    const nextErrors = {};
    const trimmedName = form.name.trim();
    if (!trimmedName) nextErrors.name = "Tên lý do không được trống";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    try {
      await api.put(`/lost-reasons/${reasonId}`, {
        ...form,
        name: trimmedName,
        code: form.code.trim(),
      });
      onSaved();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Lỗi khi cập nhật lý do thất bại!";
      toast.error(errorMessage);
      console.error("Lỗi khi cập nhật lý do thất bại:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/lost-reasons/${reasonId}`);
      onSaved();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Lỗi khi xóa lý do thất bại!";
      toast.error(errorMessage);
      console.error("Lỗi khi xóa lý do thất bại:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 uppercase">
            Sửa lý do thất bại
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
                Tên lý do *
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
                Mã lý do
              </label>
              <input
                type="text"
                disabled
                value={form.code}
                className="w-full bg-slate-100 border-none rounded-lg px-3 py-2 text-sm outline-none opacity-60 cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[0.65rem] font-bold text-slate-400 uppercase">
                Mô tả chi tiết
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full bg-slate-100 border-none rounded-lg px-3 py-2 text-sm outline-none resize-none"
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
            Cập nhật
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
