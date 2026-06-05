import React, { useState, useEffect } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
const SORT_OPTIONS = [
  { label: "Tên A → Z", value: "name_asc" },
  { label: "Tên Z → A", value: "name_desc" },
  { label: "Tổng tiền ↓", value: "totalAmount_desc" },
  { label: "Tổng tiền ↑", value: "totalAmount_asc" },
  { label: "Xác suất ↓", value: "prob_desc" },
  { label: "Xác suất ↑", value: "prob_asc" },
];

function RadioButtonGroup({ options, selected, onChange, cols = 2 }) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => {
        const active = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-2 py-2 rounded-xl text-[10px] font-bold border transition-all text-center leading-tight ${
              active
                ? "bg-[#1a237e] text-white border-[#1a237e] shadow-sm"
                : "bg-white text-slate-500 border-slate-200 hover:border-[#1a237e] hover:text-[#1a237e]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function CheckboxButtonGroup({ items, selected, onChange, cols = 2 }) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {items.length === 0 ? (
        <span className="text-xs text-slate-400 italic col-span-2 text-center py-2">
          Đang tải...
        </span>
      ) : (
        items.map((item) => {
          const checked = selected.includes(item.value);
          return (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                onChange(
                  checked
                    ? selected.filter((v) => v !== item.value)
                    : [...selected, item.value],
                )
              }
              className={`px-2 py-2 rounded-xl text-[10px] font-bold border transition-all text-center truncate ${
                checked
                  ? "bg-[#1a237e] text-white border-[#1a237e] shadow-md"
                  : "bg-white text-slate-500 border-slate-200 hover:border-[#1a237e] hover:text-[#1a237e]"
              }`}
              title={item.label}
            >
              {item.label}
            </button>
          );
        })
      )}
    </div>
  );
}

export default function OpportunityFilterPanel({ filters, onChange, onClose }) {
  const [stages, setStages] = useState([]);
  const [statuses, setStatuses] = useState([]); // Bước 1: Chuyển trạng thái ban đầu thành mảng rỗng []
  const [reasons, setReasons] = useState([]);

  useEffect(() => {
    // Bước 2: Thêm api.get("/opportunity-statuses") vào Promise.all
    Promise.all([
      api.get("/opportunity-stages"),
      api.get("/opportunity-statuses"),
      api.get("/lost-reasons"),
    ])
      .then(([stageRes, statusRes, reasonRes]) => {
        setStages(
          stageRes.data.map((s) => ({ label: s.name, value: String(s.id) })),
        );

        // Bước 3: Đọc thuộc tính id và name từ OpportunityStatusResponse để gán vào state
        setStatuses(
          statusRes.data.map((st) => ({
            label: st.name,
            value: String(st.id),
          })),
        );

        setReasons(
          reasonRes.data.map((r) => ({ label: r.name, value: String(r.id) })),
        );
      })
      .catch((err) => {
        console.error("Lỗi tải danh mục bộ lọc", err);
        toast.error("Lỗi khi tải danh mục bộ lọc!");
      });
  }, []);

  const handleReset = () => {
    onChange({
      search: filters.search,
      sort: "",
      stageIds: [],
      statusIds: [],
      reasonIds: [],
    });
  };

  return (
    <div className="relative flex flex-col gap-5 p-5 bg-white h-full w-full">
      {/* Header Panel */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
          Bộ lọc nâng cao
        </h3>
        <button
          onClick={onClose}
          type="button"
          className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 text-xs font-bold transition-all"
        >
          ✕
        </button>
      </div>

      {/* Body Panel */}
      <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1">
        {/* Sắp xếp */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Sắp xếp
          </p>
          <RadioButtonGroup
            options={SORT_OPTIONS}
            selected={filters.sort}
            onChange={(v) => onChange({ ...filters, sort: v })}
            cols={2}
          />
        </div>

        {/* Giai đoạn */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Giai đoạn
          </p>
          <CheckboxButtonGroup
            items={stages}
            selected={filters.stageIds}
            onChange={(v) => onChange({ ...filters, stageIds: v })}
            cols={2}
          />
        </div>

        {/* Trạng thái */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Trạng thái
          </p>
          <CheckboxButtonGroup
            items={statuses}
            selected={filters.statusIds}
            onChange={(v) => onChange({ ...filters, statusIds: v })}
            cols={2}
          />
        </div>

        {/* Lý do thất bại */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Lý do thất bại
          </p>
          <CheckboxButtonGroup
            items={reasons}
            selected={filters.reasonIds}
            onChange={(v) => onChange({ ...filters, reasonIds: v })}
            cols={2}
          />
        </div>
      </div>

      {/* Footer Panel */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={handleReset}
          type="button"
          className="w-full py-2.5 text-[11px] font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
        >
          Xóa tất cả bộ lọc
        </button>
      </div>
    </div>
  );
}
