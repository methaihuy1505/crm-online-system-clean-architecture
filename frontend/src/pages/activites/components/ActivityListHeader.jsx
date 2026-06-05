import React from "react";
import { PlusCircle as Plus, Search } from "lucide-react";

// Nhận props canCreate
const ActivityListHeader = ({ 
  keyword, 
  setKeyword, 
  onSearch, 
  onOpenFilter, 
  onOpenCreate, 
  activeType, 
  onTabChange,
  canCreate
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Quản lý các hoạt động chăm sóc</h1>
        {canCreate && (
          <button 
            onClick={onOpenCreate} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-[5px] font-semibold flex items-center gap-2 shadow-sm text-[11px]"
          >
            <Plus className="w-4 h-4" /> Tạo hoạt động (Alt + M)
          </button>
        )}
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-2 flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="w-full px-4 py-2 border border-slate-300 rounded-[5px] focus:ring-blue-500 text-[11px]"
          />
          <button onClick={onSearch} className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-[5px]">
            <Search className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <button 
          onClick={onOpenFilter} 
          className="flex items-center justify-start gap-2 px-0 py-2 bg-transparent text-[11px] font-bold text-slate-700 hover:text-primary transition-all group outline-none"
        >
          <span className="material-symbols-outlined text-primary text-[18px] group-hover:scale-110 transition-transform">tune</span>
          <span>Bộ lọc</span>
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: "CALL", label: "CALL", icon: "call" },
          { id: "MEETING", label: "MEETING", icon: "event" },
          { id: "NOTE", label: "NOTE", icon: "note" },
          { id: "EMAIL_QUOTE", label: "EMAIL QUOTE", icon: "email" },
          { id: "EMAIL_TRANSACTION", label: "EMAIL TRANSACTION", icon: "mail" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 rounded-t-[5px] font-medium flex items-center gap-2 text-[11px] transition-all outline-none ${
              activeType === tab.id 
                ? "bg-white text-blue-600 border-t border-l border-r border-slate-200" 
                : "text-gray-500 hover:bg-slate-100"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </>
  );
};

export default ActivityListHeader;