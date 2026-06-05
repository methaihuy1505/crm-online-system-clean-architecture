import React from "react";
import { Plus, Search, Filter } from "lucide-react";

const TaskListHeader = ({ openModal, keyword, setKeyword, onOpenFilter, activeFiltersCount, canCreate }) => {
  return (
    <div className="flex justify-between items-end gap-4 mb-2">
      <div>
        <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">
          Quản lý công việc
        </h2>
      </div>

      <div className="hidden lg:flex items-center bg-[#e6e6e7] px-4 py-2.5 rounded-full w-80 lg:w-96 focus-within:bg-white border border-transparent focus-within:border-slate-200 transition-all">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 text-[#191c1d] ml-2 outline-none"
          placeholder="Tìm theo tiêu đề công việc..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        {/* CHỈ HIỂN THỊ NÚT NẾU CÓ QUYỀN CREATE */}
        {canCreate && (
          <button
            onClick={openModal}
            className="bg-[#1a237e] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center gap-2 outline-none"
          >
            <Plus size={18} strokeWidth={2.5} /> Tạo công việc (Alt+N)
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskListHeader;