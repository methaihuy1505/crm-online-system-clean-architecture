import React from "react";
// Import Component dùng chung
import StatCard from "../../../components/ui/StatCard";

const CustomerStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-12 gap-6 mb-8">
      <div className="col-span-12 md:col-span-3">
        <StatCard
          title="Tổng B2B"
          value={stats?.totalB2B || 0}
          icon="apartment"
          color="border-indigo-500"
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          sub="Doanh nghiệp"
        />
      </div>

      <div className="col-span-12 md:col-span-3">
        <StatCard
          title="Tổng B2C"
          value={stats?.totalB2C || 0}
          icon="person"
          color="border-sky-500"
          iconBg="bg-sky-50"
          iconColor="text-sky-600"
          sub="Cá nhân"
        />
      </div>

      <div className="col-span-12 md:col-span-6 p-6 bg-primary-container text-white rounded-xl shadow-xl flex items-center justify-between relative overflow-hidden h-full">
        <div className="relative z-10">
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">
            Hạng Kim Cương
          </div>
          <div className="text-3xl font-extrabold mb-2">
            {stats?.totalDiamond || 0} Đối tác
          </div>
          <p className="text-sm opacity-80 max-w-xs">
            Nhóm khách hàng chiến lược đóng góp phần lớn doanh thu hệ thống.
          </p>
        </div>
        <div className="relative z-10">
          <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-xs font-bold backdrop-blur-md transition-all">
            Xem chi tiết
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default CustomerStats;
