import React from "react";

// Hàm định dạng tiền tệ rút gọn
const formatCompactCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return "0 đ";
  const num = Number(value);
  if (num >= 1000000000) {
    return `${(num / 1000000000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} Tỉ`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} Triệu`;
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

// Cập nhật mapping style theo đúng statusName và stageName thực tế từ BE
const mapStyles = (stage, statusName) => {
  const stageStyleMap = {
    Qualification: "bg-purple-50 text-purple-700 border border-purple-100",
    Proposal: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    Negotiation: "bg-amber-50 text-amber-700 border border-amber-100",
  };
  const defaultStageStyle =
    "bg-slate-50 text-slate-700 border border-slate-200";

  // Chuẩn hóa chuỗi text từ BE để so sánh không phân biệt hoa thường
  const statusKey = String(statusName || "").toUpperCase();
  const statusStyleMap = {
    OPEN: "bg-blue-50 text-blue-700 border border-blue-100",
    WON: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    LOST: "bg-rose-50 text-rose-700 border border-rose-100",
  };
  const defaultStatusStyle =
    "bg-slate-50 text-slate-700 border border-slate-200";

  return {
    stage: stageStyleMap[stage] || defaultStageStyle,
    status: statusStyleMap[statusKey] || defaultStatusStyle,
  };
};

function OpportunityRow({ opp, isActive, index, onSelect, onDelete, onEdit }) {
  const styles = mapStyles(opp.stageName, opp.statusName);

  return (
    <tr
      data-index={index}
      className={`group border-b border-slate-50 transition-colors duration-150 cursor-pointer ${
        isActive ? "bg-blue-50/70 hover:bg-blue-50" : "hover:bg-[#f3f4f5]"
      }`}
      onClick={() => onSelect(opp)}
    >
      {/* Cột 1: Tên cơ hội */}
      <td className="pl-8 py-0.5 overflow-hidden">
        <p
          className={`text-sm truncate block ${isActive ? "font-bold text-[#1a237e]" : "font-semibold text-[#191c1d]"}`}
          title={opp.name}
        >
          {opp.name}
        </p>
      </td>

      {/* Cột 2: Khách hàng */}
      <td className="pl-2 py-0.5 overflow-hidden">
        <p className="text-[13px] font-medium text-slate-600 truncate block">
          {opp.customerName || "Chưa có khách hàng"}
        </p>
      </td>

      {/* Cột 3: Tiền cọc (Đổi sang trường depositAmount) */}
      <td className="pl-2 py-0.5 overflow-hidden">
        <p className="text-[13px] font-bold text-[#191c1d] truncate block">
          {formatCompactCurrency(opp.totalAmount)}
        </p>
      </td>

      {/* Cột 4: Xác suất */}
      <td className="pl-2 py-0.5 overflow-hidden">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
          <span className="text-[12px] font-bold text-[#191c1d]">
            {opp.probability}%
          </span>
        </div>
      </td>

      {/* Cột 5: Giai đoạn */}
      <td className="pl-2 py-0.5 overflow-hidden">
        <div className="flex">
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase truncate ${styles.stage}`}
          >
            {opp.stageName || "N/A"}
          </span>
        </div>
      </td>

      {/* Cột 6: Trạng thái (Đổi sang trường statusName) */}
      <td className="pl-2 py-0.5 overflow-hidden">
        <div className="flex">
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${styles.status}`}
          >
            {opp.statusName || "N/A"}
          </span>
        </div>
      </td>

      {/* Cột 7: Thao tác */}
      <td
        className={`pr-4 py-0.5 text-right transition-all ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <div className="flex justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(opp.id);
            }}
            className="px-1.5 py-0.5 text-slate-400 hover:text-blue-900 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              edit_square
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(opp);
            }}
            className="px-1.5 py-0.5 text-slate-400 hover:text-red-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              delete
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default React.memo(OpportunityRow);
