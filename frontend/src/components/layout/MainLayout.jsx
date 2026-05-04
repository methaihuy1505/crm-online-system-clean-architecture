import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      {/* ml co giãn theo sidebar: 68px khi thu, 256px (w-64) khi phóng */}
      <main
        className={`min-h-screen flex flex-col transition-all duration-300 ${
          collapsed ? "ml-[68px]" : "ml-64"
        }`}
      >
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
