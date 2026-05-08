// OpportunityFilter.jsx — inline right panel (giống ProductFilter)
import React, { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080/api/v1" });

const SORT_OPTIONS = [
  { label: "Mặc định", value: "" },
  { label: "Tiền cọc ↓", value: "deposit_desc" },
  { label: "Tiền cọc ↑", value: "deposit_asc" },
  { label: "Xác suất ↓", value: "prob_desc" },
  { label: "Tên A → Z", value: "name_asc" },
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
        <p className="text-xs text-slate-400 italic col-span-full">
          Đang tải...
        </p>
      ) : (
        items.map((item) => {
          const checked = selected.includes(item.value);
          return (
            <button
              key={item.value}
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
  const [statuses, setStatuses] = useState([]);
  const [reasons, setReasons] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/opportunity-stages"),
      api.get("/opportunity-statuses"),
      api.get("/lost-reasons"),
    ]).then(([stgRes, stsRes, rsnRes]) => {
      setStages(
        stgRes.data.map((s) => ({ label: s.name, value: String(s.id) })),
      );
      setStatuses(
        stsRes.data.map((s) => ({ label: s.name, value: String(s.id) })),
      );
      setReasons(
        rsnRes.data.map((r) => ({ label: r.name, value: String(r.id) })),
      );
    });
  }, []);

  const handleReset = () =>
    onChange({ sort: "", stageIds: [], statusIds: [], reasonIds: [] });

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs p-4 animate-fade-in relative">
      <button
        onClick={onClose}
        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
      >
        <span className="material-symbols-outlined text-md">close</span>
      </button>

      <h3 className="text-[10px] font-black uppercase text-[#1A237E] mb-4">
        Bộ lọc nâng cao
      </h3>

      <div className="space-y-4">
        {/* Sắp xếp */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
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
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
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
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
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
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
            Lý do thất bại
          </p>
          <CheckboxButtonGroup
            items={reasons}
            selected={filters.reasonIds}
            onChange={(v) => onChange({ ...filters, reasonIds: v })}
            cols={2}
          />
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="w-full py-2 text-[11px] font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
        >
          Xóa tất cả bộ lọc
        </button>
      </div>
    </div>
  );
}
