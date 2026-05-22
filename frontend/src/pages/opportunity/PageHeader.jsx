import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const iconStyle = {
  fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
};

/**
 * @param {Array} sortOptions - Danh sách các option để sort. VD: [{label: 'Mới nhất', value: 'newest'}]
 * @param {function} onSortChange - Hàm callback nhận giá trị value khi người dùng chọn một option
 */
const PageHeader = ({
  breadcrumbParent = "CRM",
  breadcrumbCurrent,
  title,
  addBtnText,
  navigateTo,
  sortOptions = [
    { label: "Tên (A-Z)", value: "name_asc" },
    { label: "Tên (Z-A)", value: "name_desc" },
    { label: "Giá trị cao", value: "high_amount" },
    { label: "Giá trị thấp", value: "low_amount" },
    { label: "Trạng thái (Active đầu)", value: "status_priority" },
    { label: "Mới nhất", value: "latest" },
  ],
  onSortChange,
}) => {
  const navigate = useNavigate();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Xử lý đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-end mb-10">
      <div>
        <nav className="flex mb-2 text-xs uppercase tracking-widest text-slate-400 gap-2 font-semibold">
          <span>{breadcrumbParent}</span>
          <span>/</span>
          <span className="text-[#000666] font-bold">{breadcrumbCurrent}</span>
        </nav>
        <h1
          className="text-4xl font-extrabold text-[#191c1d] tracking-tight"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          {title}
        </h1>
      </div>

      <div className="flex gap-3 items-center relative">
        {/* Sort Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="px-5 py-2.5 bg-[#e1e3e4] text-[#00497d] rounded-lg font-medium text-sm hover:bg-[#d9dadb] transition-colors flex items-center gap-2"
          >
            <span
              className="material-symbols-outlined text-lg"
              style={iconStyle}
            >
              sort
            </span>
            Sort By
            <span
              className={`material-symbols-outlined text-sm transition-transform ${isSortOpen ? "rotate-180" : ""}`}
            >
              expand_more
            </span>
          </button>

          {/* Dropdown Menu */}
          {isSortOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setIsSortOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#000666] transition-colors flex items-center justify-between group"
                >
                  {option.label}
                  <span className="material-symbols-outlined text-transparent group-hover:text-[#000666] text-sm">
                    check_circle
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Primary Action Button (Add New) */}
        <button
          onClick={() => navigate(navigateTo)}
          className="px-6 py-2.5 bg-gradient-to-br from-[#000666] to-[#1a237e] text-white rounded-lg font-bold text-sm shadow-xl hover:-translate-y-px active:translate-y-0 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg" style={iconStyle}>
            add_circle
          </span>
          {addBtnText}
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
