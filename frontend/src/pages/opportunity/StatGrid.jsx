import React, { useEffect, useState } from "react";
import axios from "axios";

// Cấu hình URL cơ sở của backend (Nếu bạn dùng Proxy trong vite.config.js thì có thể bỏ qua dòng này)
const api = axios.create({
  baseURL: "http://localhost:8080",
});

function StatsGrid() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Với Axios, dữ liệu trả về nằm trong thuộc tính .data
        const response = await api.get("/api/dashboard/dashboard-stats");
        setStatsData(response.data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu dashboard:", err);
        // Bạn có thể set một state error ở đây nếu muốn hiển thị thông báo lỗi cho user
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Nếu đang loading mà chưa có data, hiện skeleton hoặc loading
  if (loading && !statsData)
    return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  const STATS = [
    {
      label: "Total Pipeline",
      value: statsData?.totalPipeline ?? "$0",
      trend: statsData?.pipelineTrend ?? "0% vs last month",
      trendIcon: statsData?.pipelineTrendIcon ?? "trending_flat",
      accent: "border-primary", // Dùng làm màu cho border-l-4
      containerStyle:
        "bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4",
      dark: false, // Thường container-lowest là màu sáng, nên để dark = false
      trendStyle: "text-slate-500",
    },
    {
      label: "Active Leads",
      value: statsData?.activeLeads ?? "0",
      trend: "Lead đang hoạt động",
      trendIcon: "person",
      trendStyle: "text-emerald-600",
    },
    {
      label: "Avg Deal Size",
      value: statsData?.avgDealSize ?? "$0",
      trend: "Trung bình mỗi đơn",
      trendIcon: "payments",
      trendStyle: "text-slate-500",
    },
    {
      label: "Conversion Rate",
      value: statsData?.conversionRate ?? "0%",
      trend: "Won / (Won + Lost)",
      trendIcon: "bolt",
      accent: "border-primary",
      trendStyle: "text-orange-500",
    },
  ];

  const iconStyle = {
    fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {STATS.map((s, index) => {
        const isFirst = index === 0;
        const isLast = index === STATS.length - 1;

        return (
          <div
            key={s.label}
            className={`p-6 rounded-xl shadow-sm transition-all hover:shadow-md ${
              isFirst
                ? "bg-surface-container-lowest border-l-4 border-[#000666]" // Cái đầu: Trắng, vạch trái
                : isLast
                  ? "bg-gradient-to-br from-[#000666] to-[#1a237e] border-none" // Cái cuối: Xanh đậm
                  : "bg-white border border-slate-100" // Các cái ở giữa: Trắng đơn giản
            }`}
          >
            <p
              className={`text-[10px] uppercase tracking-widest mb-1 font-medium ${
                isLast ? "text-blue-200" : "text-slate-500"
              }`}
            >
              {s.label}
            </p>

            <p
              className={`text-3xl font-bold ${
                isLast ? "text-white" : "text-[#191c1d]"
              }`}
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {s.value}
            </p>

            <div
              className={`mt-4 flex items-center text-xs font-medium ${
                isLast ? "text-blue-100" : s.trendStyle
              }`}
            >
              {s.trendIcon && (
                <span
                  className="material-symbols-outlined text-sm mr-1"
                  style={iconStyle}
                >
                  {s.trendIcon}
                </span>
              )}
              {s.trend}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsGrid;
