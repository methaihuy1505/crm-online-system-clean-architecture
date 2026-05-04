import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const isGroupActive = (matchPaths) =>
    matchPaths.some((p) => location.pathname.startsWith(p));

  const navItems = [
    { to: "/dashboard", icon: "dashboard", label: "Bảng điều khiển" },
    { to: "/customers", icon: "groups", label: "Khách hàng" },
    { to: "/contacts", icon: "contact_phone", label: "Liên hệ" },
    {
      to: "/leads",
      icon: "person_search",
      label: "Khách hàng tiềm năng",
      fill: true,
    },
    { to: "/campaigns", icon: "campaign", label: "Chiến dịch" },
    {
      to: "/productpage",
      icon: "inventory_2",
      label: "Sản phẩm",
      matchPaths: ["/productpage", "/productimport", "/productedit"],
    },
    {
      to: "/opportunities",
      icon: "trending_up",
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
      icon: "database",
      label: "Metadata",
      matchPaths: ["/metadatamanagement"],
    },
    { to: "/settings", icon: "settings", label: "Cài đặt" },
  ];

  const itemClass = (active) =>
    `flex items-center gap-3 rounded-lg transition-all duration-200
    ${collapsed ? "justify-center px-2 py-3" : "px-4 py-3"}
    ${
      active
        ? "bg-[#f3f4f5] dark:bg-slate-800 text-[#1A237E] dark:text-white shadow-sm"
        : "text-slate-600 dark:text-slate-400 hover:bg-[#f3f4f5] dark:hover:bg-slate-800"
    }`;

  return (
    <aside
      className={`h-screen fixed left-0 top-0 border-r-0 bg-white dark:bg-slate-900 shadow-[32px_0_32px_-4px_rgba(25,28,29,0.06)] z-50 transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full p-4 gap-2">
        {/* Logo + toggle */}
        <div
          className={`flex items-center py-6 ${collapsed ? "justify-center px-0" : "px-4 justify-between"}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                dataset
              </span>
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="font-headline font-extrabold text-[#1A237E] text-lg leading-tight whitespace-nowrap">
                  CRM Việt
                </h1>
                <p className="text-xs text-on-surface-variant whitespace-nowrap">
                  Hệ thống quản lý
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-[#f3f4f5] hover:text-slate-600 transition-all shrink-0"
              title="Thu gọn"
            >
              <span className="material-symbols-outlined text-xl">
                chevron_left
              </span>
            </button>
          )}
        </div>

        {/* Nút mở rộng khi thu */}
        {collapsed && (
          <button
            onClick={onToggle}
            className="mx-auto p-1.5 rounded-lg text-slate-400 hover:bg-[#f3f4f5] hover:text-slate-600 transition-all"
            title="Mở rộng"
          >
            <span className="material-symbols-outlined text-xl">
              chevron_right
            </span>
          </button>
        )}

        {/* Nav */}
        <nav
          className="flex-1 space-y-1 overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {navItems.map(({ to, icon, label, fill, matchPaths }) => {
            const active = matchPaths
              ? isGroupActive(matchPaths)
              : location.pathname.startsWith(to);

            return (
              <NavLink
                key={to}
                to={to}
                className={itemClass(active)}
                title={collapsed ? label : undefined}
              >
                <span
                  className="material-symbols-outlined shrink-0"
                  style={
                    fill || active
                      ? { fontVariationSettings: "'FILL' 1" }
                      : undefined
                  }
                >
                  {icon}
                </span>
                {!collapsed && (
                  <span className="font-medium text-sm whitespace-nowrap">
                    {label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Support */}
        <div className="pt-4 border-t border-surface-variant/30">
          <NavLink
            to="/support"
            className={({ isActive }) => itemClass(isActive)}
            title={collapsed ? "Hỗ trợ" : undefined}
          >
            <span className="material-symbols-outlined shrink-0">
              contact_support
            </span>
            {!collapsed && <span className="font-medium text-sm">Hỗ trợ</span>}
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
