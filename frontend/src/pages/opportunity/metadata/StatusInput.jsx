import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080/api/v1" });

export default function StatusModal({ open, statusId, onClose, onSaved }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isFinal, setIsFinal] = useState(false);
  const [loading, setLoading] = useState(false);

  const focusRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (statusId) {
        setLoading(true);
        api
          .get(`/opportunity-statuses/${statusId}`)
          .then((res) => {
            setName(res.data.name || "");
            setCode(res.data.code || "");
            setIsFinal(res.data.isFinal || false);
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      } else {
        setName("");
        setCode("");
        setIsFinal(false);
      }
      const timer = setTimeout(() => focusRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [open, statusId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedCode = code.trim();

    if (!trimmedName || !trimmedCode)
      return alert("Vui lòng điền đủ Tên và Mã trạng thái!");

    setLoading(true);
    try {
      if (statusId) {
        await api.put(`/opportunity-statuses/${statusId}`, {
          name: trimmedName,
          code: trimmedCode,
          isFinal,
        });
      } else {
        await api.post("/opportunity-statuses", {
          name: trimmedName,
          code: trimmedCode,
          isFinal,
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl w-full max-w-sm p-6 flex flex-col gap-4 shadow-2xl animate-scale-up"
      >
        <div className="border-b border-slate-100 pb-2">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
            {statusId ? "Cập nhật trạng thái" : "Thêm trạng thái mới"}
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Tên trạng thái *
            </label>
            <input
              ref={focusRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-600 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Mã trạng thái *
            </label>
            <input
              type="text"
              value={code}
              disabled={!!statusId}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-600 bg-slate-50 disabled:opacity-60"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mt-2 border border-slate-100">
            <div>
              <div className="text-xs font-bold text-slate-700">
                Trạng thái cuối cùng (Is Final)
              </div>
              <div className="text-[11px] text-slate-400">
                Xác định đây là trạng thái đóng của một cơ hội kinh doanh
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsFinal(!isFinal)}
              className={`relative w-11 h-6 rounded-full transition-colors ${isFinal ? "bg-[#1A237E]" : "bg-slate-300"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${isFinal ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#1A237E] text-white text-xs font-bold rounded-xl shadow-md hover:bg-blue-900 transition-all disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
