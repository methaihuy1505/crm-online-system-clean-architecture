import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const baseNavClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium";

  const getNavClass = ({ isActive }) =>
    `${baseNavClass} ${
      isActive
        ? "bg-[#f3f4f5] text-[#1A237E]"
        : "text-slate-600 dark:text-slate-400 hover:bg-[#f3f4f5]"
    }`;

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r-0 bg-white dark:bg-slate-900 shadow-[32px_0_32px_-4px_rgba(25,28,29,0.06)] z-50">
      <div className="flex flex-col h-full p-4 gap-2">
        <div className="px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
            </div>
            <div>
              <h1 className="font-headline font-extrabold text-[#1A237E] text-lg leading-tight">CRM Việt</h1>
              <p className="text-xs text-on-surface-variant">Hệ thống quản lý</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <a className={`${baseNavClass} text-slate-600 dark:text-slate-400 hover:bg-[#f3f4f5]`} href="#">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-medium text-sm">Bảng điều khiển</span>
          </a>

          <NavLink className={getNavClass} to="/leads">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_search</span>
            <span className="font-medium text-sm">Khách hàng tiềm năng</span>
          </NavLink>

          <a className={`${baseNavClass} text-slate-600 dark:text-slate-400 hover:bg-[#f3f4f5]`} href="#">
            <span className="material-symbols-outlined">campaign</span>
            <span className="font-medium text-sm">Chiến dịch</span>
          </a>

          <NavLink className={getNavClass} to="/users">
            <span className="material-symbols-outlined">person</span>
            <span className="font-medium text-sm">Người dùng</span>
          </NavLink>

          <a className={`${baseNavClass} text-slate-600 dark:text-slate-400 hover:bg-[#f3f4f5]`} href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-medium text-sm">Cài đặt</span>
          </a>
        </nav>
        <div className="pt-4 border-t border-surface-variant/30">
          <a className={`${baseNavClass} text-slate-600 dark:text-slate-400 hover:bg-[#f3f4f5]`} href="#">
            <span className="material-symbols-outlined">contact_support</span>
            <span className="font-medium text-sm">Hỗ trợ</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;