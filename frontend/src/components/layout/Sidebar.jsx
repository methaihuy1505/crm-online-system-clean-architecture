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
  Server,
  User,
  Shield,
  LogOut,
} from "lucide-react";
import { usePermission } from "../../hooks/usePermission";
const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { hasPermission } = usePermission();
  // Đọc dữ liệu từ localStorage theo cấu trúc mới
  const userName = localStorage.getItem("user_name") || "Khách";
  const userRole = localStorage.getItem("user_role") || "Chưa phân quyền";
  const allNavItems = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Bảng điều khiển",
      reqPerm: "dashboard.view",
    },
    {
      to: "/customers",
      icon: <Users size={20} />,
      label: "Khách hàng",
      reqPerm: "customers.view",
    },
    {
      to: "/leads",
      icon: <Target size={20} />,
      label: "Tiềm năng",
      reqPerm: "leads.view",
    },
    {
      to: "/tasks",
      icon: <ClipboardList size={20} />,
      label: "Công việc",
      reqPerm: "tasks.view",
    },
    {
      to: "/activities",
      icon: <History size={20} />,
      label: "Hoạt động chăm sóc",
      reqPerm: "activities.view",
    },
    {
      to: "/campaigns",
      icon: <Megaphone size={20} />,
      label: "Chiến dịch",
      reqPerm: "campaigns.view",
    },
    {
      to: "/productpage",
      icon: <Box size={20} />,
      label: "Sản phẩm",
      reqPerm: "products.view",
      matchPaths: ["/productpage", "/productimport", "/productedit"],
    },
    {
      to: "/opportunities",
      icon: <TrendingUp size={20} />,
      label: "Cơ hội",
      reqPerm: "opportunities.view",
      matchPaths: ["/opportunities", "/editopportunitystatus", "/editstage"],
    },
    {
      to: "/users",
      icon: <User size={20} />,
      label: "Người dùng",
      reqPerm: "users.view",
      matchPaths: ["/users", "/userimport", "/useredit"],
    },
    {
      to: "/roles",
      icon: <Shield size={20} />,
      label: "Vai trò & Quyền",
      reqPerm: "roles.view",
      matchPaths: ["/roles", "/roleedit"],
    },
    {
      to: "/metadatapage",
      icon: <Server size={20} />,
      label: "Metadata",
      reqPerm: "metadata.view",
      matchPaths: ["/metadatapage"],
    },
    { to: "/settings", icon: <Settings size={20} />, label: "Cài đặt" }, // Không có reqPerm -> Ai cũng thấy
  ];
  const authorizedNavItems = allNavItems.filter(
    (item) => !item.reqPerm || hasPermission(item.reqPerm),
  );
  // Tạo URL avatar tự động dựa trên tên người dùng
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random&color=fff&size=128`;
  const handleLogout = () => {
    // Xóa sạch các thông tin lưu trữ
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("access_token");

    // Chuyển hướng về trang đăng nhập
    window.location.href = "/login";
  };
  const currentUser = {
    fullName: userName,
    roleName: userRole,
    avatar: avatarUrl,
  };

  const isGroupActive = (matchPaths) =>
    matchPaths.some((p) => location.pathname.startsWith(p));


  const itemClass = (active) =>
    `flex items-center rounded-xl transition-all duration-300 ${collapsed ? "justify-center px-3 py-3" : "gap-3 px-3 py-3"} ${
      active
        ? "bg-[#f3f4f5] dark:bg-slate-800 text-[#1A237E] dark:text-white shadow-sm font-bold"
        : "text-slate-600 dark:text-slate-400 hover:bg-[#f3f4f5] dark:hover:bg-slate-800 font-medium"
    }`;

  return (
    <aside
      className={`h-screen fixed left-0 top-0 border-r border-surface-variant/30 bg-white dark:bg-slate-900 shadow-[16px_0_32px_-4px_rgba(25,28,29,0.02)] z-50 transition-all duration-300 flex flex-col justify-between ${collapsed ? "w-[68px]" : "w-64"}`}
    >
      <div className="flex flex-col p-4 gap-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {/* LOGO */}
        <div
          className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} py-2 mb-4`}
        >
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm">
                <Database size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="font-headline font-extrabold text-[#1A237E] text-lg leading-tight">
                  CRM Việt
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Hệ thống quản lý
                </p>
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors outline-none"
          >
            <Menu size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* MENU ITEMS */}
        <nav className="flex-1 space-y-1">
          {authorizedNavItems.map(({ to, icon, label, matchPaths }) => {
            const active = matchPaths
              ? isGroupActive(matchPaths)
              : (location.pathname.startsWith(to) && to !== "/dashboard") ||
                (to === "/dashboard" && location.pathname === "/dashboard");
            return (
              <NavLink
                key={to}
                to={to}
                className={() => itemClass(active)}
                title={collapsed ? label : ""}
              >
                <div className="shrink-0">{icon}</div>
                {!collapsed && (
                  <span className="text-sm whitespace-nowrap transition-all">
                    {label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* USER INFO & TOOLS */}
      <div className="p-4 border-t border-surface-variant/30 flex flex-col gap-3">
        <div
          className={`flex items-center gap-2 ${collapsed ? "flex-col" : "justify-between px-2"}`}
        >
          <button
            className={`flex items-center gap-3 p-2 rounded-xl hover:bg-[#f3f4f5] transition-all flex-1 ${collapsed ? "justify-center" : "px-3"}`}
          >
            <img
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
              src={currentUser.avatar}
            />
            {!collapsed && (
              <div className="text-left overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate">
                  {currentUser.fullName}
                </p>
                <p className="text-[10px] text-slate-500 uppercase truncate">
                  {currentUser.roleName}
                </p>
              </div>
            )}
          </button>

          {/* NÚT ĐĂNG XUẤT */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors outline-none"
            title="Đăng xuất"
          >
            <LogOut size={20} className="rotate-180" />
            {/* Hoặc bạn có thể import { LogOut } từ lucide-react để dùng biểu tượng LogOut */}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
