import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

const iconStyle = {
  fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
};
const iconFill = {
  fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24",
};

// ─── Modal Xác nhận xóa ───────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
        onClick={onCancel}
      />
      <div className="relative bg-white w-full max-w-sm rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-center w-14 h-14 bg-[#ffdad6] rounded-full mb-5 mx-auto">
          <span
            className="material-symbols-outlined text-[#ba1a1a] text-2xl"
            style={iconStyle}
          >
            delete_forever
          </span>
        </div>
        <h2
          className="text-xl font-extrabold text-center mb-2"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Xác nhận xóa
        </h2>
        <p className="text-center text-slate-500 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-[#e7e8e9] text-[#191c1d] font-semibold rounded-lg hover:bg-[#d9dadb] transition-colors text-sm"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-[#ba1a1a] text-white font-bold rounded-lg text-sm"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section Giai đoạn (Stages) ─────────────────────────────
function StagesSection({ stages, onAdd, onEdit, onDelete }) {
  return (
    <div className="lg:col-span-12 bg-[#f3f4f5] rounded-xl p-8 shadow-[0_32px_64px_-12px_rgba(25,28,29,0.06)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2
            className="text-2xl font-bold text-[#000666] flex items-center gap-3"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            <span
              className="material-symbols-outlined text-blue-700"
              style={iconStyle}
            >
              alt_route
            </span>
            Giai đoạn
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Xác định các cột mốc tiến triển.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="bg-[#000666] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-lg" style={iconStyle}>
            add
          </span>
          Thêm giai đoạn
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left">
              {[
                "ID",
                "Tên giai đoạn",
                "Xác suất",
                "Sắp xếp",
                "Đã đóng?",
                "Thao tác",
              ].map((h, i) => (
                <th
                  key={h}
                  className={`px-4 py-2 text-[10px] uppercase tracking-widest text-slate-500 opacity-60 font-medium ${i >= 2 && i <= 4 ? "text-center" : i === 5 ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stages.map((s) => (
              <tr
                key={s.id}
                className="bg-white hover:bg-[#f8f9fa] transition-colors"
              >
                <td className="px-4 py-4 rounded-l-lg text-sm font-medium text-slate-500">
                  {s.id}
                </td>
                <td
                  className="px-4 py-4 font-bold text-[#191c1d] text-sm"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {s.name}
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="bg-blue-50 text-[#0061a4] px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0061a4]"></span>
                    {s.probabilityDefault}%
                  </span>
                </td>
                <td className="px-4 py-4 text-center font-mono text-sm text-slate-600">
                  {s.sortOrder}
                </td>
                <td className="px-4 py-4 text-center">
                  <span
                    className={`material-symbols-outlined text-xl ${s.isClosed ? "text-blue-700" : "text-slate-300"}`}
                    style={s.isClosed ? iconFill : iconStyle}
                  >
                    {s.isClosed ? "check_circle" : "radio_button_unchecked"}
                  </span>
                </td>
                <td className="px-4 py-4 rounded-r-lg text-right space-x-2">
                  <button
                    onClick={() => onEdit(s.id)}
                    className="text-slate-400 hover:text-[#000666]"
                  >
                    <span
                      className="material-symbols-outlined text-lg"
                      style={iconStyle}
                    >
                      edit
                    </span>
                  </button>
                  <button
                    onClick={() => onDelete(s.id)}
                    className="text-slate-400 hover:text-[#ba1a1a]"
                  >
                    <span
                      className="material-symbols-outlined text-lg"
                      style={iconStyle}
                    >
                      delete
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Section Trạng thái (Statuses) ──────────────────────────
function StatusesSection({ statuses, onAdd, onEdit, onDelete }) {
  const getStatusDecoration = (status) => {
    if (status.isFinal) return { dot: "bg-indigo-600", sub: "Trạng thái cuối" };
    const n = status.name.toLowerCase();
    if (n.includes("thành công") || n.includes("won"))
      return { dot: "bg-green-500", sub: "Thành công" };
    if (n.includes("hủy") || n.includes("lost") || n.includes("fail"))
      return { dot: "bg-red-500", sub: "Thất bại" };
    return { dot: "bg-blue-500", sub: "Đang xử lý" };
  };

  return (
    <div className="lg:col-span-5 bg-[#f3f4f5] rounded-xl p-8 shadow-[0_32px_64px_-12px_rgba(25,28,29,0.06)] h-fit">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-xl font-bold text-[#000666] flex items-center gap-3"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          <span
            className="material-symbols-outlined text-blue-700"
            style={iconStyle}
          >
            rule
          </span>
          Trạng thái
        </h2>
        <button
          onClick={onAdd}
          className="bg-[#e1e3e4] text-[#00497d] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-200"
        >
          Thêm mới
        </button>
      </div>
      <div className="space-y-3">
        {statuses.map((s) => {
          const deco = getStatusDecoration(s);
          return (
            <div
              key={s.id}
              className="bg-white p-4 rounded-lg flex items-center justify-between group border border-transparent hover:border-blue-100 shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-10 rounded bg-slate-100 flex items-center justify-center font-mono text-[9px] font-bold text-blue-900 border border-slate-200">
                  {s.code || "N/A"}
                </div>
                <div>
                  <p
                    className="text-sm font-bold text-[#191c1d]"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    {s.name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${deco.dot}`}
                    ></span>
                    <p className="text-[10px] text-slate-500 uppercase font-medium">
                      {deco.sub}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(s.id)}
                  className="p-1.5 text-slate-400 hover:text-[#000666]"
                >
                  <span
                    className="material-symbols-outlined text-lg"
                    style={iconStyle}
                  >
                    edit
                  </span>
                </button>
                <button
                  onClick={() => onDelete(s.id)}
                  className="p-1.5 text-slate-400 hover:text-[#ba1a1a]"
                >
                  <span
                    className="material-symbols-outlined text-lg"
                    style={iconStyle}
                  >
                    delete
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Section Lý do (Reasons) ──────────────────────────────
function ReasonsSection({ reasons, onAdd, onEdit, onDelete }) {
  if (!reasons || !Array.isArray(reasons)) {
    return (
      <div className="p-4 text-center text-gray-500">Đang tải dữ liệu...</div>
    );
  }
  return (
    <div className="lg:col-span-7 bg-[#f3f4f5] rounded-xl p-8 shadow-[0_32px_64px_-12px_rgba(25,28,29,0.06)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-[#000666] flex items-center gap-3"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            <span
              className="material-symbols-outlined text-blue-700"
              style={iconStyle}
            >
              sentiment_dissatisfied
            </span>
            Lý do thất bại
          </h2>
        </div>
        <button
          onClick={onAdd}
          className="bg-[#e1e3e4] text-[#00497d] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-200"
        >
          Thêm lý do
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reasons.map((r) => (
          <div
            key={r.id}
            className="bg-white p-5 rounded-xl group relative border border-transparent hover:border-blue-700/10 shadow-sm transition-all"
          >
            <div className="flex justify-between mb-3">
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                ID: {r.id} | CODE: {r.code}
              </span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(r.id)}
                  className="text-slate-400 hover:text-[#000666]"
                >
                  <span
                    className="material-symbols-outlined text-base"
                    style={iconStyle}
                  >
                    edit
                  </span>
                </button>
                <button
                  onClick={() => onDelete(r.id)}
                  className="text-slate-400 hover:text-[#ba1a1a]"
                >
                  <span
                    className="material-symbols-outlined text-base"
                    style={iconStyle}
                  >
                    delete
                  </span>
                </button>
              </div>
            </div>
            <h3
              className="font-bold text-sm mb-1 text-[#191c1d]"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {r.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              {r.description || "Không có mô tả"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Trang Chính MetadataManagement ────────────────────────
export default function MetadataManagement() {
  const navigate = useNavigate();
  const [stages, setStages] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resStages, resStatuses, resReasons] = await Promise.all([
          api.get("/opportunity-stages"),
          api.get("/opportunity-statuses"),
          api.get("/lost-reasons"),
        ]);

        setStages(resStages.data);
        setStatuses(resStatuses.data);
        setReasons(resReasons.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };

    loadData();
  }, [location.key]);

  // Logic Xóa dùng chung
  const handleDelete = (type, id, name) => {
    const configs = {
      stage: {
        url: "/opportunity-stages",
        setter: setStages,
        label: "giai đoạn",
      },
      status: {
        url: "/opportunity-statuses",
        setter: setStatuses,
        label: "trạng thái",
      },
      reason: { url: "/lost-reasons", setter: setReasons, label: "lý do" },
    };

    setConfirm({
      message: `Bạn có chắc chắn muốn xóa ${configs[type].label} "${name}"?`,
      onConfirm: async () => {
        try {
          await api.delete(`${configs[type].url}/${id}`);
          configs[type].setter((prev) => prev.filter((item) => item.id !== id));
          setConfirm(null);
        } catch (err) {
          alert("Không thể xóa mục này do có dữ liệu liên quan. " + err);
          setConfirm(null);
        }
      },
    });
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      <header className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 border-b border-slate-200">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-[#000666] transition-colors"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          <span className="text-sm font-medium">Quay lại</span>
        </button>
      </header>

      <main className="p-12 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1
            className="text-[2.75rem] font-extrabold text-[#000666] mb-2"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Metadata
          </h1>
          <p className="text-slate-500">
            Quản lý cấu hình hệ thống: Giai đoạn, Trạng thái và Lý do thất bại.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* STAGES */}
          <StagesSection
            stages={stages}
            onAdd={() => navigate("/editstage/")}
            onEdit={(id) => navigate(`/editstage/${id}`)}
            onDelete={(id) =>
              handleDelete("stage", id, stages.find((x) => x.id === id)?.name)
            }
          />

          {/* STATUSES */}
          <StatusesSection
            statuses={statuses}
            onAdd={() => navigate("/editopportunitystatus/")}
            onEdit={(id) => navigate(`/editopportunitystatus/${id}`)}
            onDelete={(id) =>
              handleDelete(
                "status",
                id,
                statuses.find((x) => x.id === id)?.name,
              )
            }
          />

          {/* REASONS */}
          <ReasonsSection
            reasons={reasons}
            onAdd={() => navigate("/lostreason/")}
            onEdit={(id) => navigate(`/lostreason/${id}`)}
            onDelete={(id) =>
              handleDelete("reason", id, reasons.find((x) => x.id === id)?.name)
            }
          />
        </div>
      </main>
    </div>
  );
}
