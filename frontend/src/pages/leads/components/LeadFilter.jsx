import React from "react";
import Button from "../../../components/ui/Button";

const LeadFilter = ({
  isOpen, 
  onClose, 
  filters, 
  onFilterTextChange, 
  onFilterArrayChange, 
  clearFilters, 
  statuses, 
  sources, 
  campaigns
}) => {

    const FilterChip = ({ label, isSelected, onClick }) => (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all text-left ${
        isSelected 
          ? "bg-primary text-white border-primary shadow-md" 
          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* Overlay che mờ màn hình khi mở Sidebar */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[100] transition-opacity" 
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar trượt từ phải sang */}
      <div 
        className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-[110] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        
        {/* Header Sidebar */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">tune</span> 
            Bộ lọc chi tiết
          </h2>
          <Button variant="iconOnly" icon="close" onClick={onClose} className="text-slate-400 hover:text-red-500" />
        </div>

        {/* Nội dung các trường lọc */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Ô tìm kiếm từ khóa */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Từ khóa tìm kiếm</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
              <input
                type="text" 
                value={filters.keyword} 
                onChange={(e) => onFilterTextChange(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg text-sm pl-9 pr-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="Tên, Email, SĐT..." 
              />
            </div>
          </div>

          {/* CHỌN TRẠNG THÁI (DẠNG CHIP - MULTI SELECT) */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
              Trạng thái (Chọn nhiều)
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
               {statuses.map(s => (
                 <FilterChip 
                   key={s.id} 
                   label={s.name} 
                   isSelected={filters.statusIds.includes(s.id.toString())} 
                   onClick={() => onFilterArrayChange("statusIds", s.id.toString())} 
                 />
               ))}
            </div>
          </div>

          {/* CHỌN NGUỒN KHÁCH (DẠNG CHIP - MULTI SELECT) */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
              Nguồn khách (Chọn nhiều)
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
               {sources.map(s => (
                 <FilterChip 
                   key={s.id} 
                   label={s.name} 
                   isSelected={filters.sourceIds.includes(s.id.toString())} 
                   onClick={() => onFilterArrayChange("sourceIds", s.id.toString())} 
                 />
               ))}
            </div>
          </div>

          {/* CHỌN CHIẾN DỊCH (DẠNG CHIP - MULTI SELECT) */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
              Chiến dịch (Chọn nhiều)
            </label>
            {/* Sử dụng khung cuộn trong trường hợp có quá nhiều chiến dịch */}
            <div className="flex flex-wrap gap-2 pt-1 max-h-[150px] overflow-y-auto custom-scrollbar">
               {campaigns.map(c => (
                 <FilterChip 
                   key={c.id} 
                   label={c.name} 
                   isSelected={filters.campaignIds.includes(c.id.toString())} 
                   onClick={() => onFilterArrayChange("campaignIds", c.id.toString())} 
                 />
               ))}
            </div>
          </div>

        </div>

        {/* Footer Sidebar */}
        <div className="p-6 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
          <Button variant="cancel" className="bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold py-2.5" onClick={clearFilters}>
            Xóa bộ lọc
          </Button>
          <Button variant="primary" className="font-bold py-2.5 shadow-md shadow-primary/20" onClick={onClose}>
            Thu gọn
          </Button>
        </div>
      </div>
    </>
  );
};

export default LeadFilter;