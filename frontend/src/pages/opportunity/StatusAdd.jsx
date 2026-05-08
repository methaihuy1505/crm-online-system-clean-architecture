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
    if (!name || !code) return alert("Vui lòng điền đủ Tên và Mã!");
    try {
      setLoading(true);
      const payload = { name, code, isFinal };
      if (statusId) {
        // Khi cập nhật trạng thái, chỉ gửi name và isFinal theo đúng hàm update của Controller
        await api.put(`/opportunity-statuses/${statusId}`, {
          name: payload.name,
          isFinal: payload.isFinal,
        });
      } else {
        // Khi tạo mới thì gửi đủ cả 3 trường
        await api.post("/opportunity-statuses", {
          code: payload.code,
          name: payload.name,
          isFinal: payload.isFinal,
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      alert("Lỗi khi lưu dữ liệu!" + err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl animate-fadeIn">
        <h3 className="text-lg font-bold text-[#1A237E] mb-4">
          {statusId ? "Cập nhật Trạng thái" : "Thêm mới Trạng thái"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Tên trạng thái
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
                Mã hệ thống
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={!!statusId}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-600 bg-slate-50 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
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
              {loading ? "Đang xử lý..." : statusId ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
