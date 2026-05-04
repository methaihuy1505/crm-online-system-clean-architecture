// FilterSidebar.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080/api/v1" });

const SORT_OPTIONS = [
  { label: "Mặc định", value: "" },
  { label: "Giá cao → thấp", value: "price_desc" },
  { label: "Giá thấp → cao", value: "price_asc" },
  { label: "Tên A → Z", value: "name_asc" },
  { label: "Tên Z → A", value: "name_desc" },
];

const PRODUCT_TYPE_OPTIONS = [
  { label: "Tất cả", value: "" },
  { label: "Vật lý", value: "PHYSICAL" },
  { label: "Dịch vụ", value: "SERVICE" },
  { label: "Kỹ thuật số", value: "DIGITAL" },
];

// Radio dạng button pill
function RadioButtonGroup({ options, selected, onChange, cols = 3 }) {
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
            className={`px-2 py-2 rounded-xl text-[0.7rem] font-bold border transition-all text-center leading-tight ${
              active
                ? "bg-[#1a237e] text-white border-[#1a237e] shadow-md shadow-blue-900/20"
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

// Checkbox dạng button pill
function CheckboxButtonGroup({ items, selected, onChange, cols = 3 }) {
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
              className={`px-2 py-2 rounded-xl text-[0.7rem] font-bold border transition-all text-center leading-tight ${
                checked
                  ? "bg-[#1a237e] text-white border-[#1a237e] shadow-md shadow-blue-900/20"
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

export default function FilterSidebar({ open, onClose, filters, onChange }) {
  const [categories, setCategories] = useState([]);
  const [uoms, setUoms] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/product-categories"), api.get("/uoms")]).then(
      ([catRes, uomRes]) => {
        setCategories(
          catRes.data.map((c) => ({ label: c.name, value: String(c.id) })),
        );
        setUoms(
          uomRes.data.map((u) => ({ label: u.name, value: String(u.id) })),
        );
      },
    );
  }, []);

  const activeCount = [
    filters.sort !== "",
    filters.productType !== "",
    filters.categoryIds.length > 0,
    filters.uomIds.length > 0,
  ].filter(Boolean).length;

  const handleReset = () =>
    onChange({ sort: "", productType: "", categoryIds: [], uomIds: [] });

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[3px] z-40"
        onClick={onClose}
      />

      {/* Right Drawer */}
      <div className="fixed right-0 top-0 h-full w-80 bg-[#f8f9fa] shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/70 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1a237e] text-xl">
              tune
            </span>
            <h2 className="text-sm font-black text-[#1a237e]">Bộ lọc</h2>
            {activeCount > 0 && (
              <span className="bg-[#1a237e] text-white text-[0.6rem] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-slate-400 text-xl">
              close
            </span>
          </button>
        </div>

        {/* Body */}
        <div
          className="flex-1 overflow-y-auto px-6 py-5 space-y-7"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Sắp xếp */}
          <div>
            <p className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A237E] mb-3">
              Sắp xếp
            </p>
            <RadioButtonGroup
              options={SORT_OPTIONS}
              selected={filters.sort}
              onChange={(val) => onChange({ ...filters, sort: val })}
              cols={3}
            />
          </div>

          {/* Loại sản phẩm */}
          <div>
            <p className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A237E] mb-3">
              Loại sản phẩm
            </p>
            <RadioButtonGroup
              options={PRODUCT_TYPE_OPTIONS}
              selected={filters.productType}
              onChange={(val) => onChange({ ...filters, productType: val })}
              cols={2}
            />
          </div>

          {/* Danh mục */}
          <div>
            <p className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A237E] mb-3">
              Danh mục
            </p>
            <CheckboxButtonGroup
              items={categories}
              selected={filters.categoryIds}
              onChange={(val) => onChange({ ...filters, categoryIds: val })}
              cols={2}
            />
          </div>

          {/* Đơn vị tính */}
          <div>
            <p className="text-[0.65rem] font-black uppercase tracking-widest text-[#1A237E] mb-3">
              Đơn vị tính
            </p>
            <CheckboxButtonGroup
              items={uoms}
              selected={filters.uomIds}
              onChange={(val) => onChange({ ...filters, uomIds: val })}
              cols={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200/70 bg-white shrink-0 flex gap-3">
          <button
            onClick={handleReset}
            disabled={activeCount === 0}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:hover:border-slate-200"
          >
            Xóa bộ lọc
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#1a237e] text-white text-xs font-bold hover:bg-blue-800 transition-all shadow-md shadow-blue-900/20"
          >
            Xong
          </button>
        </div>
      </div>
    </>
  );
}
