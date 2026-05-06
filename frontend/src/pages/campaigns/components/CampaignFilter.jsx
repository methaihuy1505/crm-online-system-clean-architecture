import React from "react";
import Button from "../../../components/ui/Button";

// Nâng cấp FilterChip để nhận mảng selectedValues
const FilterChip = ({ label, value, selectedValues, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all text-left ${
      selectedValues.includes(value)
        ? "bg-primary text-white border-primary shadow-md"
        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
    }`}
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
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[100]"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[350px] bg-white shadow-2xl z-[110] transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              tune
            </span>{" "}
            Bộ lọc Chiến dịch
          </h2>
          <Button
            variant="iconOnly"
            icon="close"
            onClick={onClose}
            className="text-slate-400 hover:text-red-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Từ khóa
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
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
          <Button
            variant="cancel"
            className="bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold py-2.5"
            onClick={clearFilters}
          >
            Xóa bộ lọc
          </Button>
          <Button
            variant="primary"
            className="font-bold py-2.5 shadow-md shadow-primary/20"
            onClick={onClose}
          >
            Thu gọn
          </Button>
        </div>
      </div>
    </>
  );
};

export default CampaignFilter;
