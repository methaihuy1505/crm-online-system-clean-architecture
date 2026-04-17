import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      <Sidebar />
      <main className="ml-64 min-h-screen flex flex-col">
        <Topbar />
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
