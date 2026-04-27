import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const iconStyle = {
  fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
};
const iconFill = {
  fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24",
};

const inputClass =
  "w-full bg-white border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-[#000666]/20 focus:bg-white outline-none placeholder:text-slate-300 transition-all";
const selectClass =
  "w-full bg-white border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-[#000666]/20 outline-none appearance-none transition-all cursor-pointer";

const NAV_ITEMS = [
  { icon: "dashboard", label: "Bảng điều khiển" },
  { icon: "group", label: "Tiềm năng" },
  { icon: "account_tree", label: "Cơ hội", active: true },
  { icon: "analytics", label: "Báo cáo" },
];

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// ─── Thành phần Nhãn (Label Component) ───────────────────────────────────────

function FieldLabel({ children }) {
  return (
    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
      {children}
    </label>
  );
}

// ─── Tiêu đề Mục (Section Header) ───────────────────────────────────────────

function SectionHeader({ icon, label, iconBg, iconText }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div
        className={`h-10 w-10 rounded-lg ${iconBg} flex items-center justify-center ${iconText}`}
      >
        <span className="material-symbols-outlined" style={iconStyle}>
          {icon}
        </span>
      </div>
      <h3
        className="text-lg font-bold text-[#191c1d]"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        {label}
      </h3>
    </div>
  );
}

// ─── Điều hướng di động (Mobile Bottom Nav) ──────────────────────────────────

function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-t border-slate-200/50 px-6 py-3 flex justify-between items-center z-50">
      {[
        { icon: "dashboard", label: "Trang chủ" },
        { icon: "account_tree", label: "Quy trình", active: true },
      ].map((item) => (
        <button
          key={item.label}
          className={`flex flex-col items-center gap-1 ${item.active ? "text-[#000666]" : "text-slate-500"}`}
        >
          <span
            className="material-symbols-outlined"
            style={item.active ? iconFill : iconStyle}
          >
            {item.icon}
          </span>
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
      <div className="h-12 w-12 bg-gradient-to-br from-[#000666] to-[#1a237e] rounded-full flex items-center justify-center -mt-8 shadow-lg">
        <span
          className="material-symbols-outlined text-white"
          style={iconStyle}
        >
          add
        </span>
      </div>
      {[
        { icon: "analytics", label: "Thống kê" },
        { icon: "person", label: "Tài khoản" },
      ].map((item) => (
        <button
          key={item.label}
          className="flex flex-col items-center gap-1 text-slate-500"
        >
          <span className="material-symbols-outlined" style={iconStyle}>
            {item.icon}
          </span>
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── Trang Chính ──────────────────────────────────────────────────────────────

export default function CreateOpportunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stages, setStages] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [lostReasons, setLostReasons] = useState([]);
  const [form, setForm] = useState({
    opportunityCode: "",
    name: "",
    customerId: 1,
    stageId: 1,
    statusId: 1,
    probability: 0,
    lostReasonId: "",
    totalAmount: 0,
    depositAmount: 0,
    expectedClose: "",
    actualClose: "",
    followUp: "",
    status: "Open",
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // 1. Gọi song song cả Stages, Statuses và LostReasons từ Backend
        const [stageRes, statusRes, lostReasonRes] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/opportunity-stages"),
          axios.get("http://localhost:8080/api/v1/opportunity-statuses"),
          axios.get("http://localhost:8080/api/v1/lost-reasons"), // Thêm API này
        ]);

        // Cập nhật state cho các danh sách (Đảm bảo bạn đã khai báo setLostReasons)
        setStages(stageRes.data);
        if (typeof setStatuses === "function") setStatuses(statusRes.data);
        if (typeof setLostReasons === "function")
          setLostReasons(lostReasonRes.data);

        if (id) {
          const response = await api.get(`/opportunities/${id}`);
          const data = response.data;

          setForm({
            opportunityCode: data.opportunityCode || "",
            name: data.name || "",
            customerId: data.customerId || 1,
            stageId: data.stage?.id || stageRes.data[0]?.id || 1,
            statusId: data.status?.id || statusRes.data[0]?.id || 1,
            status: data.status?.name || data.status || "Open",
            probability: data.probability || 0,

            // Cập nhật logic lấy lostReasonId từ DB
            lostReasonId: data.lostReason?.id || "",

            totalAmount: data.totalAmount || 0,
            depositAmount: data.depositAmount || 0,
            expectedClose: data.expectedClose
              ? data.expectedClose.split("T")[0]
              : "",
            actualClose: data.actualClose ? data.actualClose.split("T")[0] : "",
            followUp: data.followUp ? data.followUp.split("T")[0] : "",
          });
        } else {
          setForm((prev) => ({
            ...prev,
            statusId: statusRes.data[0]?.id || 1,
            stageId: stageRes.data[0]?.id || 1,
          }));
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        if (id) alert("Không thể tải thông tin cơ hội này!");
      }
    };
    loadInitialData();
  }, [id]);

  const handleStatusChange = (e) => {
    const selectedId = e.target.value;
    const selectedStatus = statuses.find(
      (s) => s.id.toString() === selectedId.toString(),
    );

    setForm((prev) => ({
      ...prev,
      statusId: selectedId,
      status: selectedStatus ? selectedStatus.code : "", // Lưu 'Lost' hoặc 'Open' vào đây
    }));
  };
  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (id) {
        await api.put(`/opportunities/${id}`, form);
      } else {
        await api.post("/opportunities", form);
      }
      navigate("/opportunities");
    } catch (error) {
      console.error("Lỗi lưu:", error);
      alert(error.response?.data?.message || "Lỗi khi lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const remaining =
    (parseFloat(form.totalAmount) || 0) - (parseFloat(form.depositAmount) || 0);

  const isLost =
    statuses.find((s) => s.id.toString() === form.statusId?.toString())
      ?.code === "Lost";
  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <div className="flex min-h-screen">
        <main className="flex-1 p-8 lg:p-12 pb-24 md:pb-12">
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <nav className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest mb-4">
                  <span>Cơ hội</span>
                  <span
                    className="material-symbols-outlined text-sm"
                    style={iconStyle}
                  >
                    chevron_right
                  </span>
                  <span className="text-[#000666] font-bold">
                    {id ? "Chỉnh sửa" : "Tạo mới"}
                  </span>
                </nav>
                <h1
                  className="text-4xl font-extrabold text-[#191c1d] leading-tight tracking-tight"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {id ? "Cập nhật cơ hội" : "Tạo cơ hội mới"}
                </h1>
                <p className="text-slate-500 mt-2 max-w-xl text-sm">
                  Cấu hình chi tiết cho dự án kinh doanh mới. Các trường bắt
                  buộc cần được hoàn thiện để đảm bảo tính toàn vẹn của dữ liệu
                  hệ thống.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                {/* Thông tin chung */}
                <section className="bg-[#f3f4f5] rounded-xl p-8 hover:bg-[#edeeef] transition-colors">
                  <SectionHeader
                    icon="info"
                    label="Thông tin chung"
                    iconBg="bg-[#1a237e]"
                    iconText="text-[#8690ee]"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <FieldLabel>Mã cơ hội</FieldLabel>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="VD: CH-2026-001"
                        value={form.opportunityCode}
                        onChange={set("opportunityCode")}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <FieldLabel>Tên cơ hội</FieldLabel>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="VD: Dự án phần mềm CRM"
                        value={form.name}
                        onChange={set("name")}
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <FieldLabel>Tài khoản khách hàng</FieldLabel>
                      <div className="relative">
                        <input
                          type="text"
                          className={inputClass + " pr-10"}
                          placeholder="Tìm kiếm khách hàng..."
                          value={form.customerId}
                          onChange={set("customerId")}
                        />
                        <span
                          className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400"
                          style={iconStyle}
                        >
                          search
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <FieldLabel>Chiến dịch liên quan</FieldLabel>
                      <select
                        className={selectClass}
                        value={form.campaign}
                        onChange={set("campaign")}
                      >
                        <option>Mở rộng doanh nghiệp quý 4</option>
                        <option>Hội nghị công nghệ toàn cầu 2026</option>
                        <option>Chương trình giới thiệu tự nhiên</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Quy trình bán hàng */}
                <section className="bg-white rounded-xl p-8 shadow-sm">
                  <SectionHeader
                    icon="analytics"
                    label="Quy trình bán hàng"
                    iconBg="bg-blue-50"
                    iconText="text-[#00497d]"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <FieldLabel>Giai đoạn</FieldLabel>
                      <select
                        className={selectClass.replace(
                          "bg-white",
                          "bg-[#f3f4f5]",
                        )}
                        value={form.stageId}
                        onChange={set("stageId")}
                      >
                        <option value="">-- Chọn giai đoạn --</option>
                        {stages.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <FieldLabel>Trạng thái</FieldLabel>
                      <select
                        className={selectClass.replace(
                          "bg-white",
                          "bg-[#f3f4f5]",
                        )}
                        // Ưu tiên dùng stageId hoặc statusId để đồng bộ với Database
                        value={form.statusId || form.status}
                        onChange={handleStatusChange}
                      >
                        <option value="">-- Chọn trạng thái --</option>
                        {statuses.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-4 md:col-span-2">
                      <div className="flex justify-between items-center">
                        <FieldLabel>Xác suất thắng (%)</FieldLabel>
                        <span className="text-sm font-bold text-[#000666] bg-[#e0e0ff] px-3 py-1 rounded-full">
                          {form.probability}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={form.probability}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            probability: Number(e.target.value),
                          }))
                        }
                        className="w-full h-1.5 bg-[#e7e8e9] rounded-full appearance-none cursor-pointer accent-[#000666]"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div
                      className={`flex flex-col gap-2 md:col-span-2 transition-opacity ${isLost ? "opacity-100 pointer-events-auto" : "opacity-40 pointer-events-none"}`}
                    >
                      <FieldLabel>
                        Lý do thất bại {!isLost && "(Điều kiện)"}
                      </FieldLabel>
                      <select
                        className={selectClass.replace(
                          "bg-white",
                          "bg-[#f3f4f5]",
                        )}
                        value={form.lostReasonId} // Sử dụng lostReasonId để đồng bộ với state form
                        onChange={set("lostReasonId")}
                        disabled={!isLost}
                      >
                        <option value="">-- Chọn lý do thất bại --</option>
                        {lostReasons.map((reason) => (
                          <option key={reason.id} value={reason.id}>
                            {reason.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                {/* Tài chính */}
                <section className="bg-[#f3f4f5] rounded-xl p-8 border border-slate-200/50">
                  <SectionHeader
                    icon="payments"
                    label="Tài chính"
                    iconBg="bg-[#e1e3e4]"
                    iconText="text-[#000666]"
                  />
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <FieldLabel>Loại tiền tệ</FieldLabel>
                      <select
                        className={selectClass}
                        value={form.currency}
                        onChange={set("currency")}
                      >
                        <option>VND - Việt Nam Đồng</option>
                        <option>USD - Đô la Mỹ</option>
                        <option>EUR - Euro</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <FieldLabel>Tổng giá trị</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">
                          đ
                        </span>
                        <input
                          type="number"
                          className={inputClass + " pl-8 font-bold"}
                          placeholder="0"
                          value={form.totalAmount}
                          onChange={set("totalAmount")}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <FieldLabel>Số tiền đặt cọc</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">
                          đ
                        </span>
                        <input
                          type="number"
                          className={inputClass + " pl-8"}
                          placeholder="0"
                          value={form.depositAmount}
                          onChange={set("depositAmount")}
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-[#1a237e]/10 rounded-lg border border-[#1a237e]/20 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-[#1a237e] font-medium">
                          Số dư còn lại
                        </span>
                        <span className="text-sm font-bold text-[#000666]">
                          {remaining.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="pl-17 rounded-xl text-white  relative">
                  {id && (
                    <button
                      className={`bg-[#000666] text-white w-fill px-8 py-3 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                        loading
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:scale-[1.02] active:scale-100 shadow-lg"
                      }`}
                      onClick={() => navigate(`/opportunitylineitems/${id}`)}
                      disabled={loading}
                    >
                      Cập nhật sản phẩm
                    </button>
                  )}
                </section>
                {/* Lộ trình thời gian */}
                <section className="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center text-blue-200">
                        <span
                          className="material-symbols-outlined"
                          style={iconStyle}
                        >
                          schedule
                        </span>
                      </div>
                      <h3
                        className="text-lg font-bold text-white"
                        style={{ fontFamily: "Manrope, sans-serif" }}
                      >
                        Thời hạn
                      </h3>
                    </div>
                    <div className="flex flex-col gap-6">
                      {[
                        { key: "expectedClose", label: "Ngày đóng dự kiến" },
                        { key: "actualClose", label: "Ngày đóng thực tế" },
                        { key: "followUp", label: "Ngày nhắc nhở tiếp theo" },
                      ].map((field) => (
                        <div className="flex flex-col gap-2" key={field.key}>
                          <label className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                            {field.label}
                          </label>
                          <input
                            type="date"
                            className="w-full bg-white/5 border-none rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-blue-400/50 outline-none [color-scheme:dark]"
                            value={form[field.key] || ""}
                            onChange={set(field.key)}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/10 flex items-start gap-3">
                      <span
                        className="material-symbols-outlined text-blue-400 text-sm shrink-0"
                        style={iconStyle}
                      >
                        notifications_active
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Nhắc nhở tự động sẽ được gửi cho quản lý 48 giờ trước
                        ngày dự kiến đóng cơ hội.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-12 flex items-center justify-end gap-4 pb-12">
              <button
                className="px-6 py-3 rounded-lg text-sm font-medium text-[#191c1d] hover:bg-[#e7e8e9] transition-colors"
                onClick={() => navigate("/opportunities")}
              >
                Hủy bỏ
              </button>
              <button
                className={`bg-[#000666] text-white px-8 py-3 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-100 shadow-lg"}`}
                onClick={handleSave}
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <span>{id ? "Cập nhật cơ hội" : "Lưu cơ hội"}</span>
                    <span
                      className="material-symbols-outlined text-lg"
                      style={iconStyle}
                    >
                      done_all
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
