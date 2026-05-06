import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  // Style động cho các link menu
  const navLinkClass = ({ isActive }) =>
    `flex items-center px-3 py-3 rounded-xl transition-all duration-300 ${
      isActive
        ? "bg-[#f3f4f5] dark:bg-slate-800 text-[#1A237E] dark:text-white shadow-sm"
        : "text-slate-600 dark:text-slate-400 hover:bg-[#f3f4f5] dark:hover:bg-slate-800"
    } ${isCollapsed ? "justify-center" : "gap-3"}`;

  return (
    <aside
      className={`h-screen fixed left-0 top-0 border-r border-surface-variant/30 bg-white dark:bg-slate-900 shadow-[16px_0_32px_-4px_rgba(25,28,29,0.02)] z-50 transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* KHU VỰC MENU TRÊN */}
      <div className="flex flex-col p-4 gap-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {/* Logo và Nút Thu/Phóng */}
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} py-2 mb-4`}
        >
          <div
            className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                dataset
              </span>
            </div>
            <div className="shrink-0 whitespace-nowrap">
              <h1 className="font-headline font-extrabold text-[#1A237E] text-lg leading-tight">
                CRM Việt
              </h1>
            </div>
          </div>

          <button
            onClick={toggleSidebar}
            className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            title={isCollapsed ? "Mở rộng" : "Thu gọn"}
          >
            <span className="material-symbols-outlined">
              {isCollapsed ? "menu" : "menu_open"}
            </span>
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          <NavLink
            to="/dashboard"
            className={navLinkClass}
            title={isCollapsed ? "Bảng điều khiển" : ""}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span
              className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"}`}
            >
              Bảng điều khiển
            </span>
          </NavLink>

          <NavLink
            to="/customers"
            className={navLinkClass}
            title={isCollapsed ? "Khách hàng" : ""}
          >
            <span className="material-symbols-outlined">groups</span>
            <span
              className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"}`}
            >
              Khách hàng
            </span>
          </NavLink>

          <NavLink
            to="/leads"
            className={navLinkClass}
            title={isCollapsed ? "Tiềm năng" : ""}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              person_search
            </span>
            <span
              className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"}`}
            >
              Tiềm năng
            </span>
          </NavLink>

          <NavLink
            to="/campaigns"
            className={navLinkClass}
            title={isCollapsed ? "Chiến dịch" : ""}
          >
            <span className="material-symbols-outlined">campaign</span>
            <span
              className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"}`}
            >
              Chiến dịch
            </span>
          </NavLink>

          <NavLink
            to="/settings"
            className={navLinkClass}
            title={isCollapsed ? "Cài đặt" : ""}
          >
            <span className="material-symbols-outlined">settings</span>
            <span
              className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"}`}
            >
              Cài đặt
            </span>
          </NavLink>
        </nav>
      </div>

      {/* KHU VỰC THÔNG TIN CÁ NHÂN & CÔNG CỤ TỪ TOPBAR CHUYỂN XUỐNG */}
      <div className="p-4 border-t border-surface-variant/30 flex flex-col gap-3 overflow-x-hidden">
        {/* Nút Hỗ trợ & Thông báo */}
        <div
          className={`flex items-center ${isCollapsed ? "flex-col gap-2" : "justify-around px-2"}`}
        >
          <button
            className="p-2 text-on-surface-variant hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
            title="Thông báo"
          >
            <span className="material-symbols-outlined text-[22px]">
              notifications
            </span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-white"></span>
          </button>
          <button
            className="p-2 text-on-surface-variant hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Trợ giúp"
          >
            <span className="material-symbols-outlined text-[22px]">help</span>
          </button>
          <button
            className="p-2 text-on-surface-variant hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Liên hệ CSKH"
          >
            <span className="material-symbols-outlined text-[22px]">
              contact_support
            </span>
          </button>
        </div>

        {/* Thông tin User */}
        <button
          className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-300 hover:bg-[#f3f4f5] dark:hover:bg-slate-800 outline-none ${
            isCollapsed ? "justify-center" : "px-3"
          }`}
        >
          <img
            alt="Ảnh đại diện"
            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 shadow-sm"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMxU8dkgZqBNsrPVx3559J5pOW58ghDKRPGMq_42fY2U8H-v42j5LUhzP-SXRDMCJaT_WP9oV_DoNI8Ay8oJw86h5zUzbEL8XUI408RyTh8eYbTXmK0hEFIl5rFtrD4lIByY0s2MWahm0LedxZbSDmwCPtX_ilad3Q3CKcYUmoFi3O83MTOT3Dyuu4h9MymZj_TtDLLKa5cmokT4iUBhJhRbLLOWfY87cd6ZXVHdSWtPzKq4n83Ky3ccLHucM96Z5oX3ZHqUrPgryY"
          />
          <div
            className={`overflow-hidden transition-all duration-300 text-left ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <p className="text-sm font-bold text-slate-700 dark:text-white whitespace-nowrap">
              Nguyễn Văn A
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Quản lý cấp cao
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
