import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const api = axios.create({ baseURL: "http://localhost:8080/api/v1" });

// ─── Helpers ─────────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-surface-container-low border-none rounded-lg px-3 py-2 text-sm " +
  "focus:ring-1 focus:ring-primary/20 focus:bg-white outline-none " +
  "placeholder:text-slate-300 transition-all";

const selectCls =
  "w-full bg-surface-container-low border-none rounded-lg px-3 py-2 text-sm " +
  "focus:ring-1 focus:ring-primary/20 outline-none appearance-none cursor-pointer transition-all";

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.65rem] font-bold tracking-widest text-on-surface-variant uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Component chính ─────────────────────────────────────────────────────────

// Props:
//   isOpen        : boolean
//   onClose       : () => void
//   opportunityId : number | undefined — có = edit, không = create
//   onSaveSuccess : () => void — cha refresh danh sách
export default function OpportunityFormModal({
  isOpen,
  onClose,
  opportunityId,
  onSaveSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [stages, setStages] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const navigate = useNavigate();
  const defaultForm = {
    opportunityCode: "",
    name: "",
    customerId: 1,
    stageId: "",
    statusId: "",
    probability: 0,
    description: "",
  };
  const [form, setForm] = useState(defaultForm);

  // Fetch lookup + populate nếu là edit
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const [stageRes, statusRes] = await Promise.all([
          api.get("/opportunity-stages"),
          api.get("/opportunity-statuses"),
        ]);
        setStages(stageRes.data);
        setStatuses(statusRes.data);

        if (opportunityId) {
          const { data: d } = await api.get(`/opportunities/${opportunityId}`);
          setForm({
            opportunityCode: d.opportunityCode || "",
            name: d.name || "",
            customerId: d.customerId || 1,
            stageId: d.stage?.id || d.stageId || stageRes.data[0]?.id || "",
            statusId: d.status?.id || d.statusId || statusRes.data[0]?.id || "",
            probability: d.probability || 0,
            description: d.description || "",
          });
        } else {
          setForm((p) => ({
            ...p,
            stageId: stageRes.data[0]?.id || "",
            statusId: statusRes.data[0]?.id || "",
          }));
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu form:", err);
      }
    })();
  }, [isOpen, opportunityId]);

  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const payload = {
        opportunityCode: form.opportunityCode,
        name: form.name,
        customerId: Number(form.customerId),
        stageId: form.stageId ? Number(form.stageId) : null,
        statusId: form.statusId ? Number(form.statusId) : null,
        probability: Number(form.probability) || 0,
        description: form.description || "",
        totalAmount: 0,
        depositAmount: 0,
      };
      if (opportunityId) {
        await api.put(`/opportunities/${opportunityId}`, payload);
      } else {
        await api.post("/opportunities", payload);
      }
      onSaveSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Lỗi khi lưu cơ hội:", err);
      alert(err.response?.data?.message || "Lỗi khi kết nối hoặc lưu dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      {/*
        Modal — không dùng max-h + overflow-y-auto
        Toàn bộ form vừa 1 trang nhờ spacing compact
      */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden font-sans">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <p className="text-[0.6rem] font-bold text-primary uppercase tracking-widest mb-0.5">
              Cơ hội · {opportunityId ? "Chỉnh sửa" : "Tạo mới"}
            </p>
            <h3
              className="text-lg font-extrabold text-on-surface"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {opportunityId
                ? "Cập nhật thông tin cơ hội"
                : "Thêm cơ hội kinh doanh mới"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {/*
            HÀNG 1: Mã cơ hội (1/3) — Tên thương vụ (2/3)
          */}
          <div className="grid grid-cols-3 gap-4">
            <Field label="Mã cơ hội">
              <input
                type="text"
                className={inputCls}
                placeholder="VD: CH-2026-001"
                value={form.opportunityCode}
                onChange={set("opportunityCode")}
                disabled={!!opportunityId}
              />
            </Field>
            <div className="col-span-2">
              <Field label="Tên thương vụ *">
                <input
                  type="text"
                  className={inputCls}
                  placeholder="VD: Dự án phần mềm CRM"
                  value={form.name}
                  onChange={set("name")}
                />
              </Field>
            </div>
          </div>

          {/*
            HÀNG 2: Giai đoạn (1/3) — Xác suất (1/3) — Trạng thái (1/3)
            Box xác suất có chiều cao khớp với 2 select kề (py-2 + label = ~58px tổng)
          */}
          <div className="grid grid-cols-3 gap-4 items-end">
            <Field label="Giai đoạn">
              <select
                className={selectCls}
                value={form.stageId}
                onChange={set("stageId")}
              >
                <option value="">-- Chọn --</option>
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>

            {/*
              Box xác suất: label + slider trong bg-surface-container-low
              chiều cao tổng khớp với label + select ở 2 cột bên
            */}
            <Field label={`Xác suất`}>
              <div className="bg-surface-container-low rounded-lg  flex flex-col justify-center gap-1">
                <div className="relative flex items-center w-full">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0 - 100"
                    value={form.probability}
                    onChange={(e) => {
                      const val = e.target.value;

                      // Trường hợp người dùng xóa hết để nhập số mới: Cho phép tạm thời để trống
                      if (val === "") {
                        setForm((p) => ({ ...p, probability: "" }));
                        return;
                      }

                      let num = Number(val);

                      // Giới hạn cứng trong khoảng từ 0 đến 100
                      if (num > 100) num = 100;
                      if (num < 0) num = 0;

                      setForm((p) => ({ ...p, probability: num }));
                    }}
                    // Khi nhấn chuột ra ngoài nếu đang để trống thì tự động đưa về 0
                    onBlur={() => {
                      if (form.probability === "") {
                        setForm((p) => ({ ...p, probability: 0 }));
                      }
                    }}
                    className="w-full bg-surface rounded-md p-2 pr-7 text-sm text-on-surface focus:ring-1 focus:ring-primary/20 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />

                  {/* Ký hiệu % cố định tinh tế ở góc phải ô nhập */}
                  <span className="absolute right-2.5 text-xs font-bold text-on-surface-variant pointer-events-none select-none">
                    %
                  </span>
                </div>
              </div>
            </Field>

            <Field label="Trạng thái">
              <select
                className={selectCls}
                value={form.statusId}
                onChange={set("statusId")}
              >
                <option value="">-- Chọn --</option>
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/*
            HÀNG 3: Mô tả chi tiết (3/3 — full width)
          */}
          <Field label="Mô tả chi tiết">
            <textarea
              rows={3}
              className={inputCls + " resize-none"}
              placeholder="Nhập ghi chú, thông tin bổ sung quan trọng..."
              value={form.description}
              onChange={set("description")}
            />
          </Field>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 shrink-0 bg-white">
          {/* Bên trái: Ghi chú hoặc Nút cập nhật sản phẩm nếu có ID */}
          <div className="flex items-center gap-4">
            {opportunityId ? (
              <button
                onClick={() =>
                  navigate(`/opportunities/${opportunityId}/items`)
                }
                disabled={loading}
                className={`bg-[#000666] text-white px-5 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:scale-[1.02] active:scale-100 shadow-md"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  edit_note
                </span>
                Cập nhật sản phẩm
              </button>
            ) : (
              <p className="text-[0.65rem] text-slate-400 italic">
                Kiểm tra kỹ thông tin trước khi lưu dữ liệu tạo mới.
              </p>
            )}
          </div>

          {/* Bên phải: Các nút hành động chính */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-sm font-semibold text-on-surface bg-surface-container-low hover:bg-surface-variant rounded-lg transition-all"
            >
              Hủy bỏ
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-1.5 text-sm font-bold text-white rounded-lg bg-primary hover:bg-primary/90 flex items-center gap-2 shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : opportunityId ? (
                "Cập nhật"
              ) : (
                "Lưu dữ liệu"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
