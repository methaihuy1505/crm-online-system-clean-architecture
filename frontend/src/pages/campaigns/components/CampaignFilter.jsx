import React from "react";
import { Settings2, X, Search } from "lucide-react";

const FilterChip = ({ label, value, selectedValues, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all text-left outline-none ${selectedValues.includes(value) ? "bg-primary text-white border-primary shadow-md" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
  >
    {label}
  </button>
);

const CampaignFilter = ({
  isOpen,
  onClose,
  filters,
  onFilterTextChange,
  onFilterArrayChange,
  clearFilters,
}) => {
  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-[350px] bg-white shadow-2xl border-l border-slate-200 z-[110] transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Settings2 size={20} className="text-primary" /> Bộ lọc Chiến dịch
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg outline-none transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Từ khóa
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => onFilterTextChange("keyword", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg text-sm pl-9 pr-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="Tên chiến dịch..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
              Trạng thái (Chọn nhiều)
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              <FilterChip
                label="Sắp tới"
                value="Sắp tới"
                selectedValues={filters.statuses}
                onClick={(val) => onFilterArrayChange("statuses", val)}
              />
              <FilterChip
                label="Đang diễn ra"
                value="Đang diễn ra"
                selectedValues={filters.statuses}
                onClick={(val) => onFilterArrayChange("statuses", val)}
              />
              <FilterChip
                label="Đã kết thúc"
                value="Đã kết thúc"
                selectedValues={filters.statuses}
                onClick={(val) => onFilterArrayChange("statuses", val)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
              Từ ngày
            </label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => onFilterTextChange("fromDate", e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg text-sm px-4 py-2.5 outline-none focus:ring-2"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
              Đến ngày
            </label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => onFilterTextChange("toDate", e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg text-sm px-4 py-2.5 outline-none focus:ring-2"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
          <button
            className="bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold py-2.5 rounded-lg outline-none transition-colors text-sm"
            onClick={clearFilters}
          >
            Xóa bộ lọc
          </button>
          <button
            className="bg-primary text-white font-bold py-2.5 rounded-lg outline-none hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 text-sm"
            onClick={onClose}
          >
            Thu gọn
          </button>
        </div>
      </div>
    </>
  );
};

export default CampaignFilter;