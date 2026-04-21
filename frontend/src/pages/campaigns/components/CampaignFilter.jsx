import React from "react";

const CampaignFilter = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-surface-container-low p-6 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 shadow-sm border border-outline-variant/10">
      <input
        type="text"
        name="keyword"
        placeholder="Tìm tên chiến dịch..."
        className="rounded-lg border-outline-variant text-sm px-4 py-2"
        value={filters.keyword}
        onChange={onFilterChange}
      />
      <select
        name="status"
        className="rounded-lg border-outline-variant text-sm px-4 py-2"
        value={filters.status}
        onChange={onFilterChange}
      >
        <option value="">Tất cả trạng thái</option>
        <option value="Sắp tới">Sắp tới</option>
        <option value="Đang diễn ra">Đang diễn ra</option>
        <option value="Đã kết thúc">Đã kết thúc</option>
      </select>
      <input
        type="date"
        name="fromDate"
        className="rounded-lg border-outline-variant text-sm px-4 py-2"
        value={filters.fromDate}
        onChange={onFilterChange}
      />
      <input
        type="date"
        name="toDate"
        className="rounded-lg border-outline-variant text-sm px-4 py-2"
        value={filters.toDate}
        onChange={onFilterChange}
      />
    </div>
  );
};

export default CampaignFilter;
