// ProductFilter.jsx — inline right panel (giống Opportunities)
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

export default function ProductFilterPanel({ filters, onChange, onClose }) {
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

  // CẬP NHẬT HÀM RESET: Giữ lại cấu trúc key `search`
  const handleReset = () =>
    onChange({
      search: "",
      sort: "",
      productType: "",
      categoryIds: [],
      uomIds: [],
    });

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

        {/* Loại sản phẩm */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
            Loại sản phẩm
          </p>
          <RadioButtonGroup
            options={PRODUCT_TYPE_OPTIONS}
            selected={filters.productType}
            onChange={(v) => onChange({ ...filters, productType: v })}
            cols={2}
          />
        </div>

        {/* Danh mục */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
            Danh mục
          </p>
          <CheckboxButtonGroup
            items={categories}
            selected={filters.categoryIds}
            onChange={(v) => onChange({ ...filters, categoryIds: v })}
            cols={2}
          />
        </div>

        {/* Đơn vị tính */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
            Đơn vị tính
          </p>
          <CheckboxButtonGroup
            items={uoms}
            selected={filters.uomIds}
            onChange={(v) => onChange({ ...filters, uomIds: v })}
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
