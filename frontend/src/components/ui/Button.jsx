import React from "react";

const Button = ({
  children,
  variant = "primary",
  icon,
  className = "",
  ...props
}) => {
  // Class dùng chung cho mọi nút
  const baseClass =
    "rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  // Các biến thể giao diện
  const variants = {
    primary: "bg-primary text-white shadow-lg hover:bg-[#1A237E] px-6 py-2.5",
    gradient:
      "bg-gradient-to-br from-[#000666] to-[#1A237E] text-white shadow-lg hover:shadow-primary/20 px-6 py-3",
    cancel:
      "text-on-surface-variant hover:bg-surface-container-high px-6 py-2.5",
    danger: "bg-error text-white shadow-lg hover:bg-error/90 px-6 py-2.5",
    iconOnly: "p-1.5 rounded-md transition-colors", // Dành cho mấy nút icon bé trong bảng
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
      {children && <span>{children}</span>}
    </button>
  );
};

export default Button;
