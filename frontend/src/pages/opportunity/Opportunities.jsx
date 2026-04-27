import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import StatsGrid from "./StatGrid";
import PageHeader from "./PageHeader";

const iconStyle = {
  fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
};

// --- Helper: Map style dựa trên tên Stage/Status từ Backend ---
const mapStyles = (stage, status) => {
  const stageStyleMap = {
    Qualification: "bg-purple-100/50 text-purple-700",
    Discovery: "bg-amber-100/50 text-amber-700",
    Proposal: "bg-indigo-100/50 text-indigo-700",
    Negotiation: "bg-blue-100/50 text-blue-700",
    Closing: "bg-emerald-100/50 text-emerald-700",
    "Closed Won": "bg-green-100 text-green-700",
  };

  const statusMap = {
    Active: {
      style: "bg-blue-50 border-blue-100",
      dot: "bg-[#0061a4]",
      text: "text-[#0061a4]",
    },
    "At Risk": {
      style: "bg-red-50 border-red-100",
      dot: "bg-[#ba1a1a]",
      text: "text-[#ba1a1a]",
    },
    "On Hold": {
      style: "bg-slate-50 border-slate-200",
      dot: "bg-slate-400",
      text: "text-slate-500",
    },
    Closed: {
      style: "bg-green-50 border-green-100",
      dot: "bg-green-600",
      text: "text-green-700",
    },
  };

  const st = statusMap[status] || statusMap["Active"];
  return {
    stageStyle: stageStyleMap[stage] || "bg-slate-100 text-slate-600",
    statusStyle: st.style,
    statusDot: st.dot,
    statusTextStyle: st.text,
  };
};

const NAV_ITEMS = [
  { icon: "dashboard", label: "Bảng điều khiển" },
  { icon: "group", label: "Khách hàng tiềm năng" },
  { icon: "account_tree", label: "Cơ hội bán hàng", active: true },
  { icon: "analytics", label: "Báo cáo" },
];

// ─── Sub-Components (Giữ nguyên style của bạn) ───────────────────────────────

function DeleteModal({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
        onClick={onCancel}
      />
      <div className="relative bg-white w-full max-w-sm rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-center w-14 h-14 bg-[#ffdad6] rounded-full mb-5 mx-auto">
          <span
            className="material-symbols-outlined text-[#ba1a1a] text-2xl"
            style={iconStyle}
          >
            delete_forever
          </span>
        </div>
        <h2
          className="text-xl font-extrabold text-center mb-2"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Xóa cơ hội bán hàng?
        </h2>
        <p className="text-center text-slate-500 text-sm mb-6">
          Hành động này sẽ xóa vĩnh viễn{" "}
          <span className="font-bold text-[#191c1d]">{name}</span> khỏi quy
          trình bán hàng.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-[#e7e8e9] text-[#191c1d] font-semibold rounded-lg text-sm hover:bg-[#d9dadb]"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-[#ba1a1a] text-white font-bold rounded-lg text-sm"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

//
// ─── Main Component ──────────────────────────────────────────────────────────

export default function SalesOpportunities() {
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/v1/opportunities");
      const mappedData = res.data.map((item) => ({
        id: item.opportunityCode || `OPP-${item.id}`,
        dbId: item.id,
        name: item.name,
        customer: item.customerName || "N/A",
        stage: item.stage?.name || "Qualification",
        status: item.status?.name || "Active",
        amount: new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(item.totalAmount || 0),
        closeDate: item.expectedCloseDate || "N/A",
        assignee: item.assigneeName || "Chưa phân công",
        assigneeImg: `https://ui-avatars.com/api/?name=${item.assigneeName || "U"}&background=random`,
        ...mapStyles(item.stage?.name, item.status?.name),
      }));
      setOpps(mappedData);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAndSorted = opps
    .filter(
      (o) =>
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const getVal = (str) => parseFloat(str.replace(/[^0-9.-]+/g, "")) || 0;

      switch (sortConfig) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "high_amount":
          return getVal(b.amount) - getVal(a.amount);
        case "low_amount":
          return getVal(a.amount) - getVal(b.amount);
        case "status_priority": {
          const priority = {
            Active: 1,
            "Closed Won": 2,
            "At Risk": 3,
            "On Hold": 4,
            Closed: 5,
          };
          const weightA = priority[a.status] || 99;
          const weightB = priority[b.status] || 99;
          return weightA - weightB;
        }
        case "latest":
          return new Date(b.closeDate) - new Date(a.closeDate);
        case "oldest":
          return new Date(a.closeDate) - new Date(b.closeDate);
        default:
          return 0;
      }
    });

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/opportunities/${deleteTarget.dbId}`,
      );
      setOpps((prev) => prev.filter((o) => o.dbId !== deleteTarget.dbId));
      setDeleteTarget(null);
      console.log("Xóa thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert(
        `Không thể xóa bản ghi này. Lỗi: ${err.response?.status || err.message}`,
      );
    }
  };

  const handleSort = (sortValue) => {
    setSortConfig(sortValue);
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-100 flex flex-col py-6 gap-4 z-40 border-r border-slate-200">
        <div className="px-6 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#000666] to-[#1a237e] flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <p className="text-blue-900 font-bold text-sm leading-none">
              Quy trình Toàn cầu
            </p>
            <p className="text-[10px] text-slate-500 tracking-widest uppercase mt-1">
              CRM Doanh nghiệp
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center px-6 py-3 mx-2 rounded-lg text-sm font-medium ${item.active ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:bg-white/50"}`}
            >
              <span
                className="material-symbols-outlined mr-3"
                style={iconStyle}
              >
                {item.icon}
              </span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="px-4">
          <button
            onClick={() => navigate("/opportunities/create")}
            className="w-full bg-gradient-to-br from-[#000666] to-[#1a237e] text-white py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 font-medium text-sm transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <span
              className="material-symbols-outlined text-lg"
              style={iconStyle}
            >
              add
            </span>
            Thêm cơ hội mới
          </button>
        </div>
      </aside>

      <main className="p-8 max-w-7xl mx-auto ">
        <PageHeader
          breadcrumbCurrent="Quy trình"
          title="Cơ hội bán hàng"
          addBtnText="Thêm cơ hội"
          navigateTo="/opportunities/create"
          onSortChange={handleSort}
        />
        <div className="mb-6 relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc khách hàng..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <StatsGrid />
        <div className="bg-[#f3f4f5] rounded-2xl overflow-hidden p-1 mt-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f3f4f5]/50">
                    {[
                      "Mã số",
                      "Tên cơ hội",
                      "Khách hàng",
                      "Giai đoạn",
                      "Trạng thái",
                      "Giá trị",
                      "Ngày dự kiến",
                      "Người phụ trách",
                      "Thao tác",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500 font-medium"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f5]">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-10 text-center text-slate-400"
                      >
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : filteredAndSorted.length > 0 ? (
                    filteredAndSorted.map((opp) => (
                      <tr
                        key={opp.dbId}
                        className="hover:bg-[#f3f4f5] transition-colors group"
                      >
                        <td className="px-6 py-4 text-xs font-mono text-slate-400">
                          {opp.id}
                        </td>
                        <td
                          className="px-6 py-4 text-sm font-semibold"
                          style={{ fontFamily: "Manrope, sans-serif" }}
                        >
                          {opp.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {opp.customer}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${opp.stageStyle}`}
                          >
                            {opp.stage}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`flex items-center gap-2 px-3 py-1 rounded-full border w-fit ${opp.statusStyle}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${opp.statusDot}`}
                            ></span>
                            <span
                              className={`text-[10px] font-bold uppercase ${opp.statusTextStyle}`}
                            >
                              {opp.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold">
                          {opp.amount}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {opp.closeDate}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={opp.assigneeImg}
                              className="w-6 h-6 rounded-full"
                              alt="avatar"
                            />
                            <span className="text-xs font-medium">
                              {opp.assignee}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() =>
                                navigate(`/opportunities/create/${opp.dbId}`)
                              }
                              className="p-2 text-slate-400 hover:text-[#000666] hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <span
                                className="material-symbols-outlined text-lg"
                                style={iconStyle}
                              >
                                edit
                              </span>
                            </button>
                            <button
                              onClick={() => setDeleteTarget(opp)}
                              className="p-2 text-slate-400 hover:text-red-600"
                            >
                              <span className="material-symbols-outlined text-lg">
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-20 text-center text-slate-400"
                      >
                        Không tìm thấy cơ hội nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination UI */}
            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="text-xs text-slate-500 font-medium">
                Số hàng mỗi trang:
                <select
                  className="ml-2 bg-transparent outline-none"
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page)}
                  className="w-8 h-8 flex items-center justify-center rounded bg-white border border-slate-200 text-blue-700 font-bold"
                >
                  {page}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
