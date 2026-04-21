import React from "react";
import Button from "../../../components/ui/Button";

const CustomerFilter = ({
  filters,
  onFilterChange,
  showAdvanced,
  setShowAdvanced,
  clearFilters,
  statuses,
  ranks,
  sources,
  campaigns,
}) => {
  const hasActiveFilters =
    filters.keyword ||
    filters.statusId ||
    filters.rankId ||
    filters.isOrganization !== "" ||
    filters.provinceId ||
    filters.branchId ||
    filters.assignedUserId ||
    filters.sourceId ||
    filters.campaignId; // Bổ sung điều kiện hiện nút Clear

  return (
    <div className="bg-surface-container-low rounded-xl p-6 space-y-4 mb-6">
      {/* Khối Bộ lọc cơ bản giữ nguyên như cũ... */}
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
              placeholder="Mã KH, Tên, Số điện thoại, Email, MST..."
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
            <option value="">Tất cả trạng thái</option>
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
            className="flex-1 bg-surface-container-high text-primary font-semibold py-2.5 rounded-lg hover:bg-primary/10 flex justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            {showAdvanced ? "Thu gọn" : "Nâng cao"}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 bg-error/10 text-error font-semibold py-2.5 rounded-lg hover:bg-error/20 flex justify-center"
              title="Xóa bộ lọc"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Bộ lọc nâng cao */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t border-surface-variant/50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
              Phân hạng
            </label>
            <select
              name="rankId"
              value={filters.rankId}
              onChange={onFilterChange}
              className="w-full bg-surface-container-lowest border-none rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary/20"
            >
              <option value="">Tất cả phân hạng</option>
              {ranks.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
              Loại hình
            </label>
            <select
              name="isOrganization"
              value={filters.isOrganization}
              onChange={onFilterChange}
              className="w-full bg-surface-container-lowest border-none rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary/20"
            >
              <option value="">Tất cả loại hình</option>
              <option value="true">Tổ chức (B2B)</option>
              <option value="false">Cá nhân (B2C)</option>
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
              <option value="">Tất cả nguồn</option>
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
              <option value="">Tất cả chiến dịch</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerFilter;
