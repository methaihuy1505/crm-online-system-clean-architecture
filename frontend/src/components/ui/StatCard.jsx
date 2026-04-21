import React from "react";

const StatCard = ({
  title,
  value,
  icon,
  color,
  sub,
  subIcon,
  subColor,
  iconBg,
  iconColor,
}) => {
  return (
    <div
      className={`bg-surface-container-lowest p-6 rounded-xl border-l-4 ${color} shadow-sm flex items-start justify-between gap-4 h-full`}
    >
      <div className="flex-1 min-w-0 space-y-1.5">
        <p className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-widest leading-relaxed">
          {title}
        </p>

        {/* CẬP NHẬT 1: Thêm w-full vào div này để nó luôn giữ đúng kích thước khung */}
        <div className="flex items-baseline flex-wrap gap-1 w-full">
          {/* CẬP NHẬT 2: Đổi break-words thành break-all để ép bẻ dòng chữ số dính liền */}
          <h3 className="text-2xl md:text-3xl font-headline font-extrabold text-primary break-all">
            {value}
          </h3>

          {sub && !subIcon && (
            <span className="text-[10px] font-bold opacity-60 ml-1">{sub}</span>
          )}
        </div>

        {sub && subIcon && (
          <p
            className={`text-xs mt-1 flex items-start gap-1 ${subColor || "text-on-surface-variant"}`}
          >
            <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5">
              {subIcon}
            </span>
            {/* Giữ nguyên break-words ở đây vì nội dung phụ thường là câu chữ có khoảng trắng */}
            <span className="break-words">{sub}</span>
          </p>
        )}
      </div>

      <div className="shrink-0">
        {iconBg ? (
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}
          >
            <span className={`material-symbols-outlined ${iconColor}`}>
              {icon}
            </span>
          </div>
        ) : (
          <span className="material-symbols-outlined opacity-20 text-3xl">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
