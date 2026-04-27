import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import thêm
import axios from "axios"; // Import axios

const API_BASE_URL = "http://localhost:8080/api/v1/lost-reasons";

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

export default function LostReasons() {
  const { id } = useParams(); // Lấy ID từ URL (ví dụ: /lost-reasons/edit/1)
  const navigate = useNavigate();

  const [reasonCode, setReasonCode] = useState("");
  const [reasonName, setReasonName] = useState("");
  const [description, setDescription] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Xử lý lấy dữ liệu từ BE nếu có ID (Chế độ Edit)
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/${id}`);
          const data = response.data;
          setReasonCode(data.code || ""); // Giả định field BE là 'code'
          setReasonName(data.name || ""); // Giả định field BE là 'name'
          setDescription(data.description || "");
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu:", error);
          alert("Không tìm thấy thông tin lý do thất bại này!");
        }
      };
      fetchData();
    }
  }, [id]);

  // 2. Xử lý Lưu (Thêm mới hoặc Cập nhật)
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      code: reasonCode,
      name: reasonName,
      description: description,
    };

    try {
      if (id) {
        // Thực hiện PUT nếu có ID
        await axios.put(`${API_BASE_URL}/${id}`, payload);
      } else {
        // Thực hiện POST nếu không có ID
        await axios.post(API_BASE_URL, payload);
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        navigate("/metadatamanagement"); // Chuyển hướng sau khi lưu thành công
      }, 1500);
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Lỗi hệ thống: Không thể lưu dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/metadatamanagement");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-[#191c1d] font-['Inter',sans-serif]">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8 lg:p-10 bg-[#f8f9fa]">
          <div className="mb-8">
            <h1
              className="text-3xl font-extrabold text-[#191c1d] tracking-tight leading-none mb-3"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {id ? "Edit Lost Reason" : "Create Lost Reason"}
            </h1>
            <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
              Define and categorize why opportunities are being lost to improve
              architectural pipeline intelligence and refine conversion
              strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <section className="lg:col-span-7 bg-[#f3f4f5] rounded-xl p-7">
              <form className="space-y-6" onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                      Reason Code
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!id} // Nếu có id (tức là đang edit), input sẽ bị vô hiệu hóa
                      value={reasonCode}
                      onChange={(e) => setReasonCode(e.target.value)}
                      placeholder="e.g. LR-COMP-001"
                      className={`w-full border border-gray-100 rounded-lg px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#000666]/20 transition-all ${
                        id
                          ? "bg-gray-50 cursor-not-allowed text-gray-500"
                          : "bg-white"
                      }`}
                    />
                    <p className="text-[11px] text-gray-400 italic">
                      Must be a unique identifier for reporting.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                      Reason Name
                    </label>
                    <input
                      type="text"
                      required
                      value={reasonName}
                      onChange={(e) => setReasonName(e.target.value)}
                      placeholder="e.g. Budget Constraint"
                      className="w-full bg-white border border-gray-100 rounded-lg px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#000666]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                    Description
                  </label>
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the typical scenario for this lost reason..."
                    className="w-full bg-white border border-gray-100 rounded-lg px-3.5 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#000666]/20 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-7 py-2.5 rounded-lg text-sm font-bold text-white transition-all active:scale-[0.99] ${
                      saved
                        ? "bg-green-600"
                        : loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#000666] hover:opacity-90"
                    }`}
                  >
                    {loading
                      ? "Processing..."
                      : saved
                        ? "✓ Saved!"
                        : id
                          ? "Update Changes"
                          : "Create Reason"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-7 py-2.5 bg-[#e1e3e4] text-[#00355c] rounded-lg text-sm font-bold hover:bg-[#d9dadb] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>

      <div className="fixed bottom-6 right-6 flex items-center gap-2.5 bg-white shadow-xl rounded-full px-4 py-2.5 border border-gray-100">
        <div className="w-2 h-2 rounded-full bg-[#0061a4] ring-4 ring-[#33a0fd]/20" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#0061a4]">
          {loading ? "Syncing..." : "System Sync Active"}
        </span>
      </div>
    </div>
  );
}
