import React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Button from "../../../components/ui/Button";

const ActivityFilter = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  clearFilters,
  activityTypes, // [{id: 'CALL', name: 'Cuộc gọi'}, ...]
  parentTypes,   // [{id: 'LEAD', name: 'Tiềm năng'}, ...]
}) => {
  
  // Component con cho các nút lựa chọn (Chip)
  const FilterChip = ({ label, isSelected, onClick, activeClass = "bg-primary text-white border-primary" }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 border rounded-lg text-[11px] font-bold transition-all ${
        isSelected
          ? `${activeClass} shadow-md`
          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );


  const handleSingleSelect = (field, id) => {
    const isAlreadySelected = filters[field]?.includes(id);
    const newValue = isAlreadySelected ? [] : [id]; 
    onFilterChange(field, newValue);
  };

  const handleMultiSelect = (field, value) => {
    const currentList = filters[field] || [];
    const newList = currentList.includes(value)
      ? currentList.filter((item) => item !== value)
      : [...currentList, value];
    onFilterChange(field, newList);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar trượt từ phải sang */}
      <div
        className={`fixed top-0 right-0 h-full w-[380px] bg-white shadow-2xl z-[110] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">filter_alt</span>
            <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Bộ lọc nâng cao</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Body - Các mục lọc */}
        <div className="flex-1 overflow-y-auto p-6 space-y-7 custom-scrollbar">
          
          {/* Section: Loại hoạt động (SINGLE SELECT) */}
          <div className="space-y-3">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Loại hoạt động (Chọn 1)
            </label>
            <div className="flex flex-wrap gap-2">
              {activityTypes.map((type) => (
                <FilterChip
                  key={type.id}
                  label={type.name}
                  isSelected={filters.activityTypes?.includes(type.id)}
                  onClick={() => handleSingleSelect("activityTypes", type.id)}
                />
              ))}
            </div>
          </div>

          {/* Section: Đối tượng liên quan (MULTI SELECT) */}
          <div className="space-y-3">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Đối tượng liên quan (Chọn nhiều)
            </label>
            <div className="flex flex-wrap gap-2">
              {parentTypes.map((pt) => (
                <FilterChip
                  key={pt.id}
                  label={pt.name}
                  isSelected={filters.parentTypes?.includes(pt.id)}
                  onClick={() => handleMultiSelect("parentTypes", pt.id)}
                  activeClass="bg-indigo-600 text-white border-indigo-600"
                />
              ))}
            </div>
          </div>

          {/* Section: Độ ưu tiên (MULTI SELECT) */}
          <div className="space-y-3">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Mức độ ưu tiên
            </label>
            <div className="flex gap-2">
              <FilterChip
                label="Quan trọng"
                isSelected={filters.isPriority?.includes(true)}
                onClick={() => handleMultiSelect("isPriority", true)}
                activeClass="bg-red-500 text-white border-red-500"
              />
              <FilterChip
                label="Thường"
                isSelected={filters.isPriority?.includes(false)}
                onClick={() => handleMultiSelect("isPriority", false)}
                activeClass="bg-slate-600 text-white border-slate-600"
              />
            </div>
          </div>

          {/* Section: Trạng thái (MULTI SELECT) */}
          <div className="space-y-3">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Trạng thái hoàn thành
            </label>
            <div className="flex gap-2">
              <FilterChip
                label="Đã xong"
                isSelected={filters.isCompleted?.includes(true)}
                onClick={() => handleMultiSelect("isCompleted", true)}
                activeClass="bg-emerald-500 text-white border-emerald-500"
              />
              <FilterChip
                label="Chưa xong"
                isSelected={filters.isCompleted?.includes(false)}
                onClick={() => handleMultiSelect("isCompleted", false)}
                activeClass="bg-orange-500 text-white border-orange-500"
              />
            </div>
          </div>

          {/* Section: Hướng cuộc gọi (MULTI SELECT - Chỉ hiện khi đang chọn CALL) */}
          {filters.activityTypes?.includes('CALL') && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                Hướng cuộc gọi
              </label>
              <div className="flex gap-2">
                <FilterChip
                  label="Gọi đến"
                  isSelected={filters.callTypes?.includes('INBOUND')}
                  onClick={() => handleMultiSelect("callTypes", 'INBOUND')}
                />
                <FilterChip
                  label="Gọi đi"
                  isSelected={filters.callTypes?.includes('OUTBOUND')}
                  onClick={() => handleMultiSelect("callTypes", 'OUTBOUND')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex gap-3 bg-slate-50/50">
          <button
            className="flex-1 py-2 text-[11px] font-bold text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={clearFilters}
          >
            Xóa bộ lọc
          </button>
          <button
            className="flex-[1.5] py-2 text-[11px] font-bold text-white bg-primary rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
            onClick={onClose}
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </div>
    </>
  );
};

export default ActivityFilter;