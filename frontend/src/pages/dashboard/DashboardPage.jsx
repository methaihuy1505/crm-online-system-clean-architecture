import React, { useState } from "react"; // Xóa useEffect nếu chưa dùng
import { Users, Megaphone, Target, CircleDollarSign, TrendingUp } from "lucide-react";
import { formatCompactNumber } from "../../utils/formatters";
import StatCard from "../../components/ui/StatCard";

const DashboardPage = () => {
  // BỎ setStats đi cho đến khi bạn viết xong API
  const [stats] = useState({
    totalCustomers: 1250, 
    totalLeads: 4500,
    ongoingCampaigns: 12,
    expectedRevenue: 15000000000,
    actualRevenue: 8500000000,
  });

  return (
    <div className="space-y-8 flex-1 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Bảng điều khiển</h1>
        <p className="text-slate-500 font-medium mt-1">Tổng quan hiệu suất kinh doanh và Marketing toàn hệ thống.</p>
      </div>

      {/* DÙNG LẠI COMPONENT STATCARD ĐỂ ĐỒNG BỘ UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard 
          title="Tổng Khách hàng" 
          value={formatCompactNumber(stats.totalCustomers)} 
          icon="groups" 
          color="border-blue-600" 
          iconBg="bg-blue-50" 
          iconColor="text-blue-600" 
        />
        <StatCard 
          title="Lead Tiềm năng" 
          value={formatCompactNumber(stats.totalLeads)} 
          icon="my_location" 
          color="border-indigo-600" 
          iconBg="bg-indigo-50" 
          iconColor="text-indigo-600" 
        />
        <StatCard 
          title="Chiến dịch Active" 
          value={formatCompactNumber(stats.ongoingCampaigns)} 
          icon="campaign" 
          color="border-orange-500" 
          iconBg="bg-orange-50" 
          iconColor="text-orange-500" 
        />
        <StatCard 
          title="Dự thu (VNĐ)" 
          value={formatCompactNumber(stats.expectedRevenue)} 
          icon="monitoring" 
          color="border-amber-500" 
          iconBg="bg-amber-50" 
          iconColor="text-amber-600" 
        />
        <StatCard 
          title="Thực thu (VNĐ)" 
          value={formatCompactNumber(stats.actualRevenue)} 
          icon="monetization_on" 
          color="border-emerald-500" 
          iconBg="bg-emerald-50" 
          iconColor="text-emerald-600" 
        />
      </div>

      {/* KHÔNG GIAN DÀNH CHO BIỂU ĐỒ TRONG TƯƠNG LAI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
         <div className="h-[400px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-400">
            <TrendingUp size={48} className="mb-4 opacity-20" />
            [Khu vực gắn biểu đồ Doanh thu]
         </div>
         <div className="h-[400px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-400">
            <Target size={48} className="mb-4 opacity-20" />
            [Khu vực gắn biểu đồ Nguồn khách]
         </div>
      </div>
    </div>
  );
};

export default DashboardPage;