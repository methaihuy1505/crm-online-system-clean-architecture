import React from "react";
import StatCard from "../../../components/ui/StatCard";
import { formatCurrency } from "../../../utils/formatters";

const LeadStatGrid = ({ filteredLeads }) => {
  const totalCalls = filteredLeads.reduce(
    (sum, lead) => sum + (lead.totalCalls || 0),
    0,
  );
  const totalMeetings = filteredLeads.reduce(
    (sum, lead) => sum + (lead.totalMeetings || 0),
    0,
  );
  const totalEmails = filteredLeads.reduce(
    (sum, lead) => sum + (lead.totalEmails || 0),
    0,
  );
  const totalExpectedRevenue = filteredLeads.reduce(
    (sum, lead) => sum + (Number(lead.expectedRevenue) || 0),
    0,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Doanh thu dự kiến"
        value={formatCurrency(totalExpectedRevenue)}
        icon="monetization_on"
        color="border-emerald-500"
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        sub="Tổng giá trị tiềm năng"
        subIcon="payments"
        subColor="text-emerald-600"
      />

      <StatCard
        title="Tổng số cuộc gọi"
        value={totalCalls}
        icon="call"
        color="border-primary"
        iconBg="bg-primary/5"
        iconColor="text-primary"
        sub="Dựa trên kết quả lọc"
        subIcon="trending_up"
        subColor="text-green-600"
      />

      <StatCard
        title="Gặp mặt trực tiếp"
        value={totalMeetings}
        icon="groups"
        color="border-secondary-container"
        iconBg="bg-secondary-container/10"
        iconColor="text-secondary"
        sub="Lịch hẹn đã hoàn tất"
        subIcon="schedule"
        subColor="text-on-surface-variant"
      />

      <StatCard
        title="Tổng Email gửi"
        value={totalEmails}
        icon="mail"
        color="border-on-primary-container"
        iconBg="bg-on-primary-container/10"
        iconColor="text-on-primary-container"
        sub="Chiến dịch tiếp thị"
        subIcon="bolt"
        subColor="text-green-600"
      />
    </div>
  );
};

export default LeadStatGrid;
