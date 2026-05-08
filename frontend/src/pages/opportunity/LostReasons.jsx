import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080/api/v1" });

export default function ReasonModal({ open, reasonId, onClose, onSaved }) {
  const [reasonCode, setReasonCode] = useState("");
  const [reasonName, setReasonName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const focusRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (reasonId) {
        setLoading(true);
        api
          .get(`/lost-reasons/${reasonId}`)
          .then((res) => {
            setReasonCode(res.data.code || res.data.reasonCode || "");
            setReasonName(res.data.name || res.data.reasonName || "");
            setDescription(res.data.description || "");
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      } else {
        setReasonCode("");
        setReasonName("");
        setDescription("");
      }
      const timer = setTimeout(() => focusRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [open, reasonId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reasonName || !reasonCode)
      return alert("Vui lòng điền đủ Tên và Mã lý do!");
    try {
      setLoading(true);
      const payload = {
        code: reasonCode,
        name: reasonName,
        description: description,
      };
      if (reasonId) {
        await api.put(`/lost-reasons/${reasonId}`, payload);
      } else {
        await api.post("/lost-reasons", payload);
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
          {reasonId ? "Cập nhật Lý do thất bại" : "Thêm mới Lý do thất bại"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Mã lý do
              </label>
              <input
                ref={focusRef}
                type="text"
                value={reasonCode}
                onChange={(e) => setReasonCode(e.target.value)}
                disabled={!!reasonId}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-600 bg-slate-50 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Tên lý do cụ thể
              </label>
              <input
                type="text"
                value={reasonName}
                onChange={(e) => setReasonName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-600 bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Mô tả lý do
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-600 bg-slate-50 resize-none"
            />
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
              {loading ? "Đang xử lý..." : reasonId ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
