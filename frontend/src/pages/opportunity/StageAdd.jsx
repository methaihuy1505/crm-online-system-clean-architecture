import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const icons = {
  bell: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  settings:
    "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0",
  tree: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1z M17 11V4a1 1 0 00-1-1h-2 M21 21H3",
  step: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  rule: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  cancel: "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  group:
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0",
  plus: "M12 4v16m8-8H4",
  bulb: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  chevron: "M9 5l7 7-7 7",
};
const API_BASE_URL = "http://localhost:8080/api/v1/opportunity-stages";
function Icon({ d, size = 18, color = "currentColor", strokeWidth = 1.5 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

// const navLinks = ["Opportunities", "Stages", "Lost Reasons", "Analytics"];

export default function EditStage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID từ Route path="/editopportunitystatus/:id?"

  const [stageName, setStageName] = useState("");
  const [probability, setProbability] = useState(0);
  const [sortOrder, setSortOrder] = useState(0);
  const [isClosed, setIsClosed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchStageData = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/${id}`);
          const data = response.data;
          // Map dữ liệu từ API vào state
          setStageName(data.name || "");
          setProbability(data.probabilityDefault || 0);
          setSortOrder(data.sortOrder || 0);
          setIsClosed(data.isClosed || false);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin stage:", error);
          alert("Không thể tải dữ liệu stage!");
        }
      };
      fetchStageData();
    } else {
      // Nếu không có ID (Thêm mới), reset về giá trị mặc định
      setStageName("");
      setProbability(0);
      setSortOrder(0);
      setIsClosed(false);
    }
  }, [id]);
  const handleSave = async () => {
    setLoading(true);
    const payload = {
      name: stageName,
      probabilityDefault: probability,
      sortOrder: sortOrder,
      isClosed: isClosed,
    };

    try {
      if (id) {
        // Cập nhật (Sửa)
        await axios.put(`${API_BASE_URL}/${id}`, payload);
      } else {
        // Tạo mới
        await axios.post(API_BASE_URL, payload);
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        navigate("/metadatamanagement"); // Quay về trang quản lý sau khi lưu
      }, 1000);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      alert("Lỗi hệ thống: Không thể lưu thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    navigate("/metadatamanagement");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-[#191c1d] font-['Inter',sans-serif]">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 mb-6">
            {["CRM", "Metadata"].map((crumb) => (
              <span key={crumb} className="flex items-center gap-1.5">
                <span className="text-[11px] uppercase tracking-widest text-gray-400">
                  {crumb}
                </span>
                <Icon d={icons.chevron} size={11} color="#aaa" />
              </span>
            ))}
            <span className="text-[11px] uppercase tracking-widest text-[#000666] font-bold">
              Opportunity Stages
            </span>
          </nav>

          {/* Page Title */}
          <div className="flex justify-between items-end mb-7">
            <div>
              <h1
                className="text-3xl font-extrabold text-[#000666] tracking-tight mb-1"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                {id ? "Edit Stage" : "Create Stage"}
              </h1>
              <p className="text-sm text-gray-400">
                Modify structural parameters for the sales pipeline lifecycle.
              </p>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={handleDiscard}
                className="px-4 py-2 rounded-lg text-sm text-gray-500 font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`px-5 py-2 rounded-lg text-sm text-white font-semibold transition-all active:scale-95 ${
                  saved ? "bg-green-600" : "bg-[#000666] hover:opacity-90"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading
                  ? "Processing..."
                  : saved
                    ? "✓ Saved!"
                    : id
                      ? "Update Changes"
                      : "Create Stage"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 flex flex-col gap-5">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-5">
                  Core Identification
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-600 mb-1.5">
                      Stage Name
                    </label>
                    <input
                      type="text"
                      value={stageName}
                      onChange={(e) => setStageName(e.target.value)}
                      placeholder="e.g. Negotiation"
                      className="w-full bg-[#f3f4f5] border-none rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000666]/20 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-600 mb-1.5">
                        Probability Default (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={probability}
                        onChange={(e) => setProbability(Number(e.target.value))}
                        className="w-full bg-[#f3f4f5] border-none rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000666]/20 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-600 mb-1.5">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(Number(e.target.value))}
                        className="w-full bg-[#f3f4f5] border-none rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000666]/20 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-5">
                  Terminal Logic
                </div>
                <div className="flex items-center justify-between p-3.5 bg-[#f3f4f5] rounded-lg">
                  <div>
                    <div className="text-sm font-semibold mb-0.5">
                      Is Closed
                    </div>
                    <div className="text-xs text-gray-400">
                      Marking this stage as closed ends tracking.
                    </div>
                  </div>
                  <button
                    onClick={() => setIsClosed(!isClosed)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${isClosed ? "bg-[#000666]" : "bg-gray-300"}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${isClosed ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-[#000666] text-white rounded-xl p-5 relative overflow-hidden">
                <Icon d={icons.bulb} size={22} color="rgba(255,255,255,0.4)" />
                <div className="text-sm font-bold mt-3 mb-1.5">
                  Best Practice
                </div>
                <p className="text-xs leading-relaxed opacity-85">
                  Keep pipeline between 5-7 stages to avoid fragmentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
