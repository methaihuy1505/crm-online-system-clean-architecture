import React from "react";

const CampaignChart = ({ leads, customers }) => {
  const getMonthlyTrend = () => {
    const months = [
      "Th. 01",
      "Th. 02",
      "Th. 03",
      "Th. 04",
      "Th. 05",
      "Th. 06",
      "Th. 07",
      "Th. 08",
      "Th. 09",
      "Th. 10",
      "Th. 11",
      "Th. 12",
    ];
    const currentMonth = new Date().getMonth();
    const last5Months = [];

    for (let i = 4; i >= 0; i--) {
      const monthIdx = (currentMonth - i + 12) % 12;

      // Tính Leads của tháng
      const leadCount = leads.filter(
        (lead) =>
          lead.campaignId !== null &&
          new Date(lead.createdAt).getMonth() === monthIdx,
      ).length;

      // Tính Customers của tháng
      const customerCount = customers.filter(
        (cus) =>
          cus.campaignId !== null &&
          new Date(cus.createdAt).getMonth() === monthIdx,
      ).length;

      last5Months.push({
        name: months[monthIdx],
        leadCount,
        customerCount,
        total: leadCount + customerCount,
      });
    }

    const maxTotal = Math.max(...last5Months.map((m) => m.total), 1);
    return last5Months.map((m) => ({
      ...m,
      leadPercent: (m.leadCount / maxTotal) * 100,
      customerPercent: (m.customerCount / maxTotal) * 100,
    }));
  };

  return (
    <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col h-full">
      <h2 className="text-lg font-bold mb-8 text-on-surface flex justify-between items-center">
        <span>Xu hướng Chuyển đổi</span>
        {/* Chú thích màu sắc */}
        <div className="flex gap-3 text-[10px] font-normal">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary/40 rounded-sm"></div> Leads
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-sm"></div> Khách hàng
          </span>
        </div>
      </h2>

      <div className="flex-1 flex items-end justify-between gap-2 h-64">
        {getMonthlyTrend().map((m, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-3 group h-full justify-end"
          >
            <div className="relative w-full flex flex-col items-center h-full justify-end">
              {/* Hiển thị tổng số khi hover */}
              <span className="absolute -top-6 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                {m.total}
              </span>

              {/* Biểu đồ dạng cột chồng (Stacked Bar) */}
              <div className="w-full max-w-[30px] flex flex-col justify-end h-full">
                {/* Phần ngọn: Customers */}
                <div
                  className={`w-full transition-all bg-primary ${m.leadPercent === 0 ? "rounded-t-lg" : "rounded-t-sm"} ${i === 4 ? "shadow-lg" : ""}`}
                  style={{
                    height: `${m.customerPercent}%`,
                    minHeight: m.customerCount > 0 ? "4px" : "0",
                  }}
                  title={`${m.customerCount} Khách hàng`}
                ></div>

                {/* Phần gốc: Leads */}
                <div
                  className={`w-full transition-all bg-primary/30 ${m.customerPercent === 0 ? "rounded-t-lg" : "rounded-b-sm"}`}
                  style={{
                    height: `${m.leadPercent}%`,
                    minHeight: m.leadCount > 0 ? "4px" : "0",
                  }}
                  title={`${m.leadCount} Leads`}
                ></div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">
              {m.name}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-center text-on-surface-variant mt-4 italic">
        * Dữ liệu kết hợp số lượng Leads và Khách hàng mới từ các Chiến dịch
      </p>
    </div>
  );
};

export default CampaignChart;
