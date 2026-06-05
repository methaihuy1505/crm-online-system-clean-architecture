import React from "react";
import { Settings2, X, Search } from "lucide-react";

const FilterChip = ({ label, value, selectedValues = [], onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all text-left outline-none ${
      selectedValues.includes(value)
        ? "bg-primary text-white border-primary shadow-md"
        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
    }`}
  >
    {label}
  </button>
);

const UserFilter = ({
  isOpen,
  onClose,
  filters = {},
  onFilterTextChange,
  onFilterChange,
  onFilterArrayChange,
  onClearFilters,
  roleOptions = [],
  branchOptions = [],
  teamOptions = [],
}) => {
  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl border-l border-slate-200 z-[110] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Settings2 size={20} className="text-primary" /> Bộ lọc Người dùng
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
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filters.keyword || ""}
                onChange={(e) => onFilterTextChange("keyword", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg text-sm pl-9 pr-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="Tên, email hoặc username..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
              Vai trò
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => onFilterChange("role", "ALL")}
                className={`px-3 py-1.5 border rounded-lg text-xs font-bold outline-none ${
                  filters.role === "ALL" ? "bg-slate-800 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Tất cả
              </button>
              {roleOptions.map((role) => (
                <button
                  key={role.id}
                  onClick={() => onFilterChange("role", role.id)}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-bold outline-none ${
                    filters.role === role.id ? "bg-primary/20 text-primary border-primary shadow-md" : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
              Trạng thái
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => onFilterChange("status", "ALL")}
                className={`px-3 py-1.5 border rounded-lg text-xs font-bold outline-none ${
                  filters.status === "ALL" ? "bg-slate-800 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => onFilterChange("status", "ACTIVE")}
                className={`px-3 py-1.5 border rounded-lg text-xs font-bold outline-none ${
                  filters.status === "ACTIVE" ? "bg-blue-50 text-blue-700 border-blue-200 shadow-md" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Đang hoạt động
              </button>
              <button
                onClick={() => onFilterChange("status", "INACTIVE")}
                className={`px-3 py-1.5 border rounded-lg text-xs font-bold outline-none ${
                  filters.status === "INACTIVE" ? "bg-red-50 text-red-700 border-red-200 shadow-md" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Ngưng hoạt động
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
              Chi nhánh
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {branchOptions.map((branch) => (
                <FilterChip
                  key={branch.id}
                  label={branch.label}
                  value={branch.id}
                  selectedValues={filters.branchIds || []}
                  onClick={(val) => onFilterArrayChange("branchIds", val)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
              Nhóm
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {teamOptions.map((team) => (
                <FilterChip
                  key={team.id}
                  label={team.label}
                  value={team.id}
                  selectedValues={filters.teamIds || []}
                  onClick={(val) => onFilterArrayChange("teamIds", val)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
          <button
            className="bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold py-2.5 rounded-lg outline-none transition-colors text-sm"
            onClick={onClearFilters}
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

export default UserFilter;
