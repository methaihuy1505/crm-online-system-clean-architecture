import React from "react";
import StatCard from "../../../components/ui/StatCard";

const CampaignStatGrid = ({ stats }) => {
  // Nếu stats chưa load xong thì gán mặc định bằng 0
  const data = stats || {
    totalCampaigns: 0,
    ongoingCampaigns: 0,
    totalLeads: 0,
    expectedRevenue: 0,
    actualRevenue: 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Tổng chiến dịch"
        value={data.totalCampaigns}
        icon="campaign"
        color="border-primary"
      />
      <StatCard
        title="Đang diễn ra"
        value={data.ongoingCampaigns}
        icon="bolt"
        color="border-secondary"
      />
      <StatCard
        title="Tổng Leads"
        value={data.totalLeads}
        icon="leaderboard"
        color="border-indigo-500"
      />
      <StatCard
        title="Dự thu"
        value={new Intl.NumberFormat("vi-VN").format(data.expectedRevenue)}
        sub="VND"
        icon="hourglass_top"
        color="border-amber-500"
      />
      <StatCard
        title="Thực thu"
        value={new Intl.NumberFormat("vi-VN").format(data.actualRevenue)}
        sub="VND"
        icon="payments"
        color="border-emerald-500"
      />
    </div>
  );
};

export default CampaignStatGrid;
