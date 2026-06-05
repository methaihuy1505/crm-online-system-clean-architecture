import React from "react";
import { Settings2, X, Check } from "lucide-react";

const TaskFilter = ({ isOpen, onClose, filters, onFilterChange, clearFilters }) => {
  
  const FilterChip = ({ label, isSelected, onClick, activeClass = "bg-primary text-white border-primary shadow-md" }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 outline-none ${
        isSelected ? activeClass : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
      }`}
    >
      {isSelected && <Check size={14} />}
      {label}
    </button>
  );

  const handleMultiSelect = (field, value) => {
    const currentList = filters[field] || [];
    const newList = currentList.includes(value)
      ? currentList.filter((item) => item !== value)
      : [...currentList, value];
    onFilterChange(field, newList);
  };

  const handleSingleSelect = (field, value) => {
    const currentList = filters[field] || [];
    const newList = currentList.includes(value) ? [] : [value];
    onFilterChange(field, newList);
  };

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl border-l border-slate-200 z-[110] transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Settings2 size={20} className="text-primary" /> Bộ lọc Công việc
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg outline-none transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">Trạng thái</label>
            <div className="flex flex-wrap gap-2 pt-1">
              <FilterChip label="Mới tạo" isSelected={filters.status?.includes("NOT_STARTED")} onClick={() => handleMultiSelect("status", "NOT_STARTED")} />
              <FilterChip label="Đang làm" isSelected={filters.status?.includes("IN_PROGRESS")} onClick={() => handleMultiSelect("status", "IN_PROGRESS")} />
              <FilterChip label="Hoàn thành" isSelected={filters.status?.includes("COMPLETED")} onClick={() => handleMultiSelect("status", "COMPLETED")} activeClass="bg-emerald-600 text-white border-emerald-600 shadow-md" />
              <FilterChip label="Hủy bỏ" isSelected={filters.status?.includes("CANCELED")} onClick={() => handleMultiSelect("status", "CANCELED")} activeClass="bg-slate-700 text-white border-slate-700 shadow-md" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">Mức độ ưu tiên</label>
            <div className="flex flex-wrap gap-2 pt-1">
              <FilterChip label="Thấp" isSelected={filters.priority?.includes("LOW")} onClick={() => handleMultiSelect("priority", "LOW")} activeClass="bg-blue-600 text-white border-blue-600 shadow-md" />
              <FilterChip label="Trung bình" isSelected={filters.priority?.includes("MEDIUM")} onClick={() => handleMultiSelect("priority", "MEDIUM")} activeClass="bg-amber-500 text-white border-amber-500 shadow-md" />
              <FilterChip label="Cao" isSelected={filters.priority?.includes("HIGH")} onClick={() => handleMultiSelect("priority", "HIGH")} activeClass="bg-red-600 text-white border-red-600 shadow-md" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">Trạng thái hạn chót</label>
            <div className="flex flex-wrap gap-2 pt-1">
              <FilterChip label="Đã quá hạn" isSelected={filters.isOverdue?.includes(true)} onClick={() => handleSingleSelect("isOverdue", true)} activeClass="bg-red-500 text-white border-red-500 shadow-md" />
              <FilterChip label="Trong hạn" isSelected={filters.isOverdue?.includes(false)} onClick={() => handleSingleSelect("isOverdue", false)} activeClass="bg-emerald-500 text-white border-emerald-500 shadow-md" />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
          <button onClick={clearFilters} className="bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold py-2.5 rounded-lg outline-none text-sm">Xóa bộ lọc</button>
          <button onClick={onClose} className="bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-primary/90 shadow-md outline-none text-sm">Thu gọn</button>
        </div>
      </div>
    </>
  );
};

export default TaskFilter;