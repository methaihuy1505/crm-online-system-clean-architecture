import React from "react";

const LeadFilter = ({
  filters,
  onFilterChange,
  showAdvanced,
  setShowAdvanced,
  clearFilters,
  statuses,
  sources,
  campaigns,
}) => {
  // Kiểm tra xem có filter nào đang được sử dụng không (để hiện nút Xóa bộ lọc)
  const hasActiveFilters =
    filters.keyword ||
    filters.statusId ||
    filters.sourceId ||
    filters.campaignId ||
    filters.provinceId ||
    filters.branchId ||
    filters.assignedTo;

  return (
    <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
      {/* Bộ lọc cơ bản */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1.5 lg:col-span-2">
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
            Tìm kiếm
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
              search
            </span>
            <input
              name="keyword"
              value={filters.keyword}
              onChange={onFilterChange}
              className="w-full bg-surface-container-lowest border-none rounded-lg text-sm pl-9 pr-4 py-2.5 focus:ring-1 focus:ring-primary/20"
              placeholder="Tên, Email, SĐT, Tên công ty..."
              type="text"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
            Trạng thái
          </label>
          <select
            name="statusId"
            value={filters.statusId}
            onChange={onFilterChange}
            className="w-full bg-surface-container-lowest border-none rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary/20"
          >
            <option value="">Tất cả</option>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex-1 bg-surface-container-high text-primary font-semibold py-2.5 rounded-lg hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            {showAdvanced ? "Thu gọn" : "Nâng cao"}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 bg-error/10 text-error font-semibold py-2.5 rounded-lg hover:bg-error/20 transition-colors flex items-center justify-center"
              title="Xóa bộ lọc"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Bộ lọc nâng cao */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-surface-variant/50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
              Người phụ trách
            </label>
            <select
              name="assignedTo"
              value={filters.assignedTo}
              onChange={onFilterChange}
              className="w-full bg-surface-container-lowest border-none rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary/20"
            >
              <option value="">Tất cả</option>
              <option value="1">Nguyễn Văn A</option>
              <option value="2">Lê Thu Hà</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
              Nguồn khách
            </label>
            <select
              name="sourceId"
              value={filters.sourceId}
              onChange={onFilterChange}
              className="w-full bg-surface-container-lowest border-none rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary/20"
            >
              <option value="">Tất cả</option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
              Chiến dịch
            </label>
            <select
              name="campaignId"
              value={filters.campaignId}
              onChange={onFilterChange}
              className="w-full bg-surface-container-lowest border-none rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary/20"
            >
              <option value="">Tất cả</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
              Chi nhánh
            </label>
            <select
              name="branchId"
              value={filters.branchId}
              onChange={onFilterChange}
              className="w-full bg-surface-container-lowest border-none rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary/20"
            >
              <option value="">Tất cả</option>
              <option value="1">Trụ sở chính</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
              Tỉnh thành
            </label>
            <select
              name="provinceId"
              value={filters.provinceId}
              onChange={onFilterChange}
              className="w-full bg-surface-container-lowest border-none rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary/20"
            >
              <option value="">Tất cả</option>
              <option value="1">Hà Nội</option>
              <option value="2">TP. Hồ Chí Minh</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadFilter;