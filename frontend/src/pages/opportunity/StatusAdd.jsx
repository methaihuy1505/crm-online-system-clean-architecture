import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // Đảm bảo đã cài đặt axios

// ... (iconStyle, iconFill, SIDEBAR_ITEMS giữ nguyên)

export default function EditOpportunityStatus({ statusId }) {
  // Giả sử nhận statusId từ props nếu là update
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL nếu có (ví dụ: /status/edit/1)

  const API_BASE_URL = "http://localhost:8080/api/v1/opportunity-statuses";

  const [form, setForm] = useState({
    name: "",
    code: "",
    isFinal: false,
  });
  const [loading, setLoading] = useState(false);

  // ─── Logic Fetch Dữ liệu (Nếu có ID) ───────────────────────────────────────
  useEffect(() => {
    if (id) {
      const fetchStatus = async () => {
        try {
          const res = await axios.get(
            `http://localhost:8080/api/v1/opportunity-statuses/${id}`,
          );
          setForm(res.data);
        } catch (err) {
          console.error("Lỗi khi tải dữ liệu:", err);
        }
      };
      fetchStatus();
    }
  }, [statusId]);

  // ─── Logic Lưu Dữ liệu (Tích hợp API) ──────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        // UPDATE: URL có ID (/api/v1/opportunity-statuses/{id})
        await axios.put(`${API_BASE_URL}/${id}`, form);
      } else {
        // CREATE: URL không ID (/api/v1/opportunity-statuses)
        await axios.post(API_BASE_URL, form);
      }
      // Sau khi lưu thành công, về trang quản lý
      navigate("/metadatamanagement");
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      alert("Xử lý thất bại, vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };

  // ─── 3. Xử lý Hủy bỏ ──────────────────────────────────────────────────────
  const handleDiscard = () => {
    navigate("/metadatamanagement");
  };
  const inputClass =
    "w-full bg-[#f3f4f5] border-none rounded-lg py-4 px-5 text-[#191c1d] font-medium placeholder:text-slate-300 focus:ring-1 focus:ring-[#000666]/20 focus:bg-white transition-all outline-none text-sm";

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen flex flex-col">
      {/* ... (Các thẻ link font giữ nguyên) */}

      <div className="flex h-screen overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto bg-[#f3f4f5] p-8">
            <div className="max-w-4xl mx-auto">
              <section className="bg-white rounded-xl p-8 shadow-sm relative overflow-hidden">
                <form onSubmit={handleSave} className="space-y-8 relative z-10">
                  {/* Status Name */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Tên trạng thái
                    </label>
                    <input
                      type="text"
                      required
                      className={inputClass}
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>

                  {/* Status Code */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Mã code
                    </label>
                    <input
                      type="text"
                      required
                      className={`${inputClass} font-mono`}
                      value={form.code}
                      disabled={!!id}
                      onChange={(e) =>
                        setForm({ ...form, code: e.target.value })
                      }
                    />
                  </div>

                  {/* Is Final Toggle */}
                  <div className="flex items-center justify-between p-6 bg-[#f3f4f5]/60 rounded-xl">
                    <div>
                      <h4 className="font-bold text-sm text-[#000666]">
                        Trạng thái kết thúc?
                      </h4>
                      <p className="text-xs text-slate-500">
                        Đánh dấu nếu là terminal stage.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, isFinal: !form.isFinal })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isFinal ? "bg-[#0061a4]" : "bg-slate-300"}`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${form.isFinal ? "translate-x-5" : "translate-x-0.5"}`}
                      />
                    </button>
                  </div>

                  {/* Nút hành động (Phần bạn yêu cầu sửa) */}
                  <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#f3f4f5]">
                    <button
                      type="button"
                      onClick={handleDiscard} // Điều hướng về /metadatamanagement
                      className="px-6 py-3 text-sm font-semibold text-slate-500 hover:bg-[#f3f4f5] rounded-lg transition-colors"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-br from-[#000666] to-[#1a237e] text-white rounded-lg font-bold text-sm shadow-lg active:scale-95 transition-all disabled:opacity-50"
                    >
                      {loading
                        ? "Đang lưu..."
                        : id
                          ? "Cập nhật trạng thái"
                          : "Tạo trạng thái"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
