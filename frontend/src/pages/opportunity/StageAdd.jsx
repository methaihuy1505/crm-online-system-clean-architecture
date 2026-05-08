import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080/api/v1" });

export default function StageModal({ open, stageId, onClose, onSaved }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [probability, setProbability] = useState("");
  const [stageType, setStageType] = useState("OPEN");
  const [isClosed, setIsClosed] = useState(false);
  const [loading, setLoading] = useState(false);

  const nameInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (stageId) {
        setLoading(true);
        api
          .get(`/opportunity-stages/${stageId}`)
          .then((res) => {
            setName(res.data.name || "");
            setCode(res.data.code || "");
            setProbability(res.data.probability || "");
            setStageType(res.data.stageType || "OPEN");
            setIsClosed(res.data.isClosed || false);
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      } else {
        setName("");
        setCode("");
        setProbability("");
        setStageType("OPEN");
        setIsClosed(false);
      }

      const timer = setTimeout(() => nameInputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [open, stageId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return alert("Vui lòng điền đủ Tên giai đoạn!");
    try {
      setLoading(true);

      // Gửi đúng DTO map với Backend Controller
      const payload = {
        name: name,
        probabilityDefault: Number(probability) || 0, // Backend cần probabilityDefault
        sortOrder: 1, // Bổ sung trường bắt buộc này (để tạm là 1 hoặc tùy bạn cấu hình)
        isClosed: isClosed,
      };

      if (stageId) {
        await api.put(`/opportunity-stages/${stageId}`, payload);
      } else {
        await api.post("/opportunity-stages", payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      alert(
        "Lỗi 500 từ hệ thống: Kiểm tra lại cấu trúc dữ liệu truyền lên!" + err,
      );
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
      <div className="relative bg-white w-full max-w-3xl rounded-2xl p-6 shadow-2xl animate-fadeIn">
        <h3 className="text-lg font-bold text-[#1A237E] mb-4">
          {stageId ? "Cập nhật Giai đoạn" : "Thêm mới Giai đoạn"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Tên giai đoạn
              </label>
              <input
                ref={nameInputRef}
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
                disabled={!!stageId}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-600 bg-slate-50 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Xác suất (%)
              </label>
              <input
                type="number"
                value={probability}
                onChange={(e) => setProbability(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-600 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Loại giai đoạn
              </label>
              <select
                value={stageType}
                onChange={(e) => setStageType(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-600 bg-slate-50"
              >
                <option value="OPEN">Mở (Open)</option>
                <option value="WON">Thành công (Won)</option>
                <option value="LOST">Thất bại (Lost)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <div className="text-xs font-bold text-slate-700">
                Đánh dấu Đóng (Is Closed)
              </div>
              <div className="text-[11px] text-slate-400">
                Kết thúc quy trình theo dõi dữ liệu tại giai đoạn này
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsClosed(!isClosed)}
              className={`relative w-11 h-6 rounded-full transition-colors ${isClosed ? "bg-[#1A237E]" : "bg-slate-300"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${isClosed ? "translate-x-5" : "translate-x-0"}`}
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
              {loading ? "Đang xử lý..." : stageId ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
