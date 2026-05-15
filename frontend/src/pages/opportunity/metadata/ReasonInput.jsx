import { useState, useEffect, useRef } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080/api/v1" });

export default function ReasonInput({ open, onClose, onSaved }) {
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open) return null;

  const handleSave = async () => {
    const nextErrors = {};
    const trimmedName = form.name.trim();
    const trimmedCode = form.code.trim();

    if (!trimmedName) nextErrors.name = "Tên lý do không được trống";
    if (!trimmedCode) nextErrors.code = "Mã lý do không được trống";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    try {
      await api.post("/lost-reasons", {
        ...form,
        name: trimmedName,
        code: trimmedCode,
      });
      onSaved();
      onClose();
      setForm({ code: "", name: "", description: "" });
      setErrors({});
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        <div className="px-6 py-4 border-b bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 uppercase">
            Thêm lý do thất bại
          </h3>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[0.65rem] font-bold tracking-widest text-slate-400 uppercase">
              Tên lý do *
            </label>
            <input
              ref={inputRef}
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full bg-slate-100 border-none rounded-lg px-3 py-2 text-sm outline-none ${errors.name ? "ring-1 ring-red-400" : ""}`}
            />
            {errors.name && (
              <span className="text-[0.6rem] text-red-500 font-medium">
                {errors.name}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[0.65rem] font-bold tracking-widest text-slate-400 uppercase">
              Mã lý do *
            </label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className={`w-full bg-slate-100 border-none rounded-lg px-3 py-2 text-sm outline-none ${errors.code ? "ring-1 ring-red-400" : ""}`}
            />
            {errors.code && (
              <span className="text-[0.6rem] text-red-500 font-medium">
                {errors.code}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[0.65rem] font-bold tracking-widest text-slate-400 uppercase">
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
        <div className="flex items-center justify-end gap-2 px-6 py-3 border-t bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-400"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-1.5 text-xs font-bold text-white bg-[#1a237e] rounded-lg disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu lý do"}
          </button>
        </div>
      </div>
    </div>
  );
}
