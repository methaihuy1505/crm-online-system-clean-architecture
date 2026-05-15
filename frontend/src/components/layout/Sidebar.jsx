import React from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const navItems = [
    { name: "Bảng điều khiển", icon: "dashboard", path: "/dashboard" },
    { name: "Khách hàng tiềm năng", icon: "person_search", path: "/leads" },
    { name: "Công việc (Tasks)", icon: "task", path: "/task" }, // Thêm Task vào sidebar
    { name: "Lịch sử hoạt động", icon: "history", path: "/activities" },
    { name: "Chiến dịch", icon: "campaign", path: "/campaigns" },
    { name: "Cài đặt", icon: "settings", path: "/settings" }
  ];

  return (
    <aside className={`h-screen fixed left-0 top-0 border-r-0 bg-white dark:bg-slate-900 shadow-[32px_0_32px_-4px_rgba(25,28,29,0.06)] z-50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-[60px]'}`}>
      <div className="flex flex-col h-full py-4 gap-2">
        <div className={`px-4 py-4 flex items-center justify-between`}>
          <div className={`flex items-center gap-3 ${!isOpen && 'hidden'}`}>
            <div className="w-8 h-8 bg-primary rounded-[5px] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
            </div>
            <div className="truncate">
              <h1 className="font-headline font-extrabold text-[#1A237E] text-base leading-tight">CRM Việt</h1>
              <p className="text-[10px] text-slate-500">Hệ thống quản lý</p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1.5 rounded-[5px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ${!isOpen && 'mx-auto'}`}
            title={isOpen ? "Thu gọn Sidebar" : "Mở rộng Sidebar"}
          >
            {isOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 mt-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={index}
                to={item.path}
                title={item.name}
                className={`flex items-center gap-3 py-3 transition-all duration-300 ${isOpen ? 'px-4 mx-2 rounded-[5px]' : 'justify-center mx-1 rounded-[5px]'} ${isActive ? 'bg-[#f3f4f5] dark:bg-slate-800 text-[#1A237E] dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-[#f3f4f5]'}`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: item.icon === 'person_search' ? "'FILL' 1" : "" }}>
                  {item.icon}
                </span>
                {isOpen && <span className="font-medium text-[11px] truncate">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="pt-4 border-t border-slate-100">
          <a className={`flex items-center gap-3 text-slate-600 dark:text-slate-400 py-3 hover:bg-[#f3f4f5] transition-all duration-300 ${isOpen ? 'px-4 mx-2 rounded-[5px]' : 'justify-center mx-1 rounded-[5px]'}`} href="#" title="Hỗ trợ">
            <span className="material-symbols-outlined">contact_support</span>
            {isOpen && <span className="font-medium text-[11px] truncate">Hỗ trợ</span>}
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;