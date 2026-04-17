import React from 'react';

const Topbar = () => {
  return (
    <header className="w-full top-0 sticky z-40 bg-[#f8f9fa] dark:bg-slate-950 flex justify-between items-center px-8 py-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20" placeholder="Tìm kiếm khách hàng..." type="text"/>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2 text-on-surface-variant hover:bg-slate-100 rounded-full transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-slate-100 rounded-full transition-colors">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
        <div className="flex items-center gap-3 pl-6 border-l border-surface-variant">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-on-surface">Nguyễn Văn A</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Quản lý cấp cao</p>
          </div>
          <img alt="Ảnh đại diện" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMxU8dkgZqBNsrPVx3559J5pOW58ghDKRPGMq_42fY2U8H-v42j5LUhzP-SXRDMCJaT_WP9oV_DoNI8Ay8oJw86h5zUzbEL8XUI408RyTh8eYbTXmK0hEFIl5rFtrD4lIByY0s2MWahm0LedxZbSDmwCPtX_ilad3Q3CKcYUmoFi3O83MTOT3Dyuu4h9MymZj_TtDLLKa5cmokT4iUBhJhRbLLOWfY87cd6ZXVHdSWtPzKq4n83Ky3ccLHucM96Z5oX3ZHqUrPgryY"/>
        </div>
      </div>
    </header>
  );
};

export default Topbar;