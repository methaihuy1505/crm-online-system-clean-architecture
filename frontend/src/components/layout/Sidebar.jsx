import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Database,
  Menu,
  LayoutDashboard,
  Users,
  Target,
  Megaphone,
  Settings,
  Bell,
  HelpCircle,
  Headphones,
  ClipboardList,
  History,
  Box,        
  TrendingUp, 
  Server      
} from "lucide-react";

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  // Logic kiểm tra xem menu cha có nên active khi đang ở route con hay không
  const isGroupActive = (matchPaths) =>
    matchPaths.some((p) => location.pathname.startsWith(p));

  // --- MAP DANH SÁCH MENU  ---
  const navItems = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Bảng điều khiển" },
    { to: "/customers", icon: <Users size={20} />, label: "Khách hàng" },
    { to: "/leads", icon: <Target size={20} />, label: "Tiềm năng" },
    { to: "/task", icon: <ClipboardList size={20} />, label: "Công việc (Tasks)" },
    { to: "/activities", icon: <History size={20} />, label: "Lịch sử hoạt động" },
    { to: "/campaigns", icon: <Megaphone size={20} />, label: "Chiến dịch" },
    {
      to: "/productpage",
      icon: <Box size={20} />,
      label: "Sản phẩm",
      matchPaths: ["/productpage", "/productimport", "/productedit"],
    },
    {
      to: "/opportunities",
      icon: <TrendingUp size={20} />,
      label: "Cơ hội",
      matchPaths: [
        "/opportunities",
        "/editopportunitystatus",
        "/editstage",
        "/lostreason",
        "/opportunitylineitems",
        "/addeditlineitem",
      ],
    },
    {
      to: "/metadatamanagement",
      icon: <Server size={20} />,
      label: "Metadata",
      matchPaths: ["/metadatamanagement"],
    },
    { to: "/settings", icon: <Settings size={20} />, label: "Cài đặt" },
  ];

  // Logic gen CSS class cho từng item
  const itemClass = (active) =>
    `flex items-center rounded-xl transition-all duration-300 ${
      collapsed ? "justify-center px-3 py-3" : "gap-3 px-3 py-3"
    } ${
      active
        ? "bg-[#f3f4f5] dark:bg-slate-800 text-[#1A237E] dark:text-white shadow-sm font-bold"
        : "text-slate-600 dark:text-slate-400 hover:bg-[#f3f4f5] dark:hover:bg-slate-800 font-medium"
    }`;

  return (
    <aside
      className={`h-screen fixed left-0 top-0 border-r border-surface-variant/30 bg-white dark:bg-slate-900 shadow-[16px_0_32px_-4px_rgba(25,28,29,0.02)] z-50 transition-all duration-300 flex flex-col justify-between ${
        collapsed ? "w-[68px]" : "w-64"
      }`}
    >
      {/* KHU VỰC MENU TRÊN */}
      <div className="flex flex-col p-4 gap-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
        
        {/* Logo và Nút Thu/Phóng */}
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} py-2 mb-4`}>
          <div
            className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${
              collapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
            }`}
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-sm text-white">
              <Database size={20} strokeWidth={2.5} />
            </div>
            <div className="shrink-0 whitespace-nowrap">
              <h1 className="font-headline font-extrabold text-[#1A237E] text-lg leading-tight">
                CRM Việt
              </h1>
              <p className="text-xs text-slate-500 font-medium">Hệ thống quản lý</p>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0 outline-none"
            title={collapsed ? "Mở rộng" : "Thu gọn"}
          >
            <Menu size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* DANH SÁCH RENDER MENU */}
        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, icon, label, matchPaths }) => {
            // Xác định xem thẻ này có đang được chọn (active) hay không
            const active = matchPaths
              ? isGroupActive(matchPaths)
              : location.pathname.startsWith(to) && to !== "/dashboard" 
                || (to === "/dashboard" && location.pathname === "/dashboard");

            return (
              <NavLink
                key={to}
                to={to}
                className={() => itemClass(active)}
                title={collapsed ? label : ""}
              >
                {/* Wrap icon trong thẻ div để shrink-0 tránh bị bóp méo khi thu nhỏ */}
                <div className="shrink-0">{icon}</div>
                <span
                  className={`text-sm whitespace-nowrap transition-all duration-300 ${
                    collapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
                  }`}
                >
                  {label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* KHU VỰC THÔNG TIN CÁ NHÂN & CÔNG CỤ */}
      <div className="p-4 border-t border-surface-variant/30 flex flex-col gap-3 overflow-x-hidden">
        {/* Nút Hỗ trợ & Thông báo */}
        <div className={`flex items-center ${collapsed ? "flex-col gap-2" : "justify-around px-2"}`}>
          <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative outline-none" title="Thông báo">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-white"></span>
          </button>
          <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors outline-none" title="Trợ giúp">
            <HelpCircle size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors outline-none" title="Liên hệ CSKH">
            <Headphones size={20} />
          </button>
        </div>

        {/* Thông tin User */}
        <button
          className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-300 hover:bg-[#f3f4f5] dark:hover:bg-slate-800 outline-none ${
            collapsed ? "justify-center" : "px-3"
          }`}
        >
          <img
            alt="Ảnh đại diện"
            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 shadow-sm"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMxU8dkgZqBNsrPVx3559J5pOW58ghDKRPGMq_42fY2U8H-v42j5LUhzP-SXRDMCJaT_WP9oV_DoNI8Ay8oJw86h5zUzbEL8XUI408RyTh8eYbTXmK0hEFIl5rFtrD4lIByY0s2MWahm0LedxZbSDmwCPtX_ilad3Q3CKcYUmoFi3O83MTOT3Dyuu4h9MymZj_TtDLLKa5cmokT4iUBhJhRbLLOWfY87cd6ZXVHdSWtPzKq4n83Ky3ccLHucM96Z5oX3ZHqUrPgryY"
          />
          <div
            className={`overflow-hidden transition-all duration-300 text-left ${
              collapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
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