import React from "react";
import StatCard from "../../../components/ui/StatCard";
import { getCampaignStatus } from "../../../utils/formatters";

const CampaignStatGrid = ({ campaigns, leadsFromCampaigns }) => {
  // 1. DỰ THU: Lead Mới (1) + Đang liên hệ (2)
  const totalExpectedRevenue = leadsFromCampaigns
    .filter((l) => l.statusId === 1 || l.statusId === 2)
    .reduce((sum, l) => sum + (Number(l.expectedRevenue) || 0), 0);

  // 2. THỰC THU: Lead Chuyển đổi (3) + Phát sinh giao dịch (4)
  const totalActualRevenue = leadsFromCampaigns
    .filter((l) => l.statusId === 3 || l.statusId === 4)
    .reduce((sum, l) => sum + (Number(l.expectedRevenue) || 0), 0);

  const ongoingCount = campaigns.filter(
    (c) => getCampaignStatus(c.startDate, c.endDate).label === "Đang diễn ra",
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Tổng chiến dịch"
        value={campaigns.length}
        icon="campaign"
        color="border-primary"
      />
      <StatCard
        title="Đang diễn ra"
        value={ongoingCount}
        icon="bolt"
        color="border-secondary"
      />
      <StatCard
        title="Tổng Leads từ các chiến dịch"
        value={leadsFromCampaigns.length}
        icon="leaderboard"
        color="border-indigo-500"
      />

      <StatCard
        title="Dự thu"
        value={new Intl.NumberFormat("vi-VN").format(totalExpectedRevenue)}
        sub="VND (Pipeline)"
        icon="hourglass_top"
        color="border-amber-500"
      />
      <StatCard
        title="Thực thu"
        value={new Intl.NumberFormat("vi-VN").format(totalActualRevenue)}
        sub="VND (Won)"
        icon="payments"
        color="border-emerald-500"
      />
    </div>
  );
};

export default CampaignStatGrid;
