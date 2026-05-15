import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Import dữ liệu Mock đã bóc tách độc lập
import {
  MOCK_CUSTOMERS,
  MOCK_USERS,
  MOCK_CAMPAIGNS,
} from "./OpportunityMockData";

const api = axios.create({ baseURL: "http://localhost:8080/api/v1" });

// ─── OPTIMIZED COMPACT UI STYLES ─────────────────────────────────────────────
// Giảm padding đầu vào (py-1.5) và font chữ text-xs giúp tiết kiệm không gian
const inputCls =
  "w-full bg-surface-container-low border border-slate-200/60 rounded-md px-2.5 py-1.5 text-xs " +
  "focus:ring-1 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none " +
  "placeholder:text-slate-300 transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed";

const inputCls2 = (hasError) =>
  `w-full bg-surface-container-low border-none rounded-lg px-3 py-2 text-sm transition-all outline-none focus:bg-white focus:ring-1 ${
    hasError
      ? "ring-1 ring-error/60 bg-red-50 focus:ring-error"
      : "focus:ring-primary/20"
  }`;

const selectCls =
  "w-full bg-surface-container-low border border-slate-200/60 rounded-md px-2.5 py-1.5 text-xs " +
  "focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer transition-all";

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase flex items-center gap-0.5">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── CUSTOM AJAX SEARCH COMBOBOX ─────────────────────────────────────────────
function AsyncSearchSelect({
  label,
  placeholder,
  endpoint,
  mockData,
  value,
  onChange,
  required,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [_loading, setLoading] = useState(false);

  const containerRef = useRef(null);

  const selectedOption =
    options.find((opt) => opt.id === Number(value)) ||
    mockData.find((opt) => opt.id === Number(value));
  const displayValue = selectedOption ? selectedOption.name : "";

  useEffect(() => {
    if (!isOpen) setSearch("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        // ─── [API ENDPOINT]: AJAX SEARCH QUERY ───
        const response = await api.get(
          `${endpoint}?search=${encodeURIComponent(search)}`,
        );
        if (response.data && Array.isArray(response.data))
          setOptions(response.data);
        else if (response.data?.content && Array.isArray(response.data.content))
          setOptions(response.data.content);
        else filterFallback();
      } catch (err) {
        console.error(err);
        filterFallback();
      } finally {
        setLoading(false);
      }
    };
    const filterFallback = () => {
      setOptions(
        mockData.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    };
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 200);
    return () => clearTimeout(delayDebounce);
  }, [search, isOpen, endpoint, mockData]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target))
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Field label={label} required={required}>
      <div ref={containerRef} className="relative w-full">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`${inputCls} flex items-center justify-between cursor-pointer select-none ${isOpen ? "ring-1 ring-primary border-primary bg-white" : ""}`}
        >
          <span
            className={`truncate ${displayValue ? "text-slate-800" : "text-slate-400"}`}
          >
            {displayValue || placeholder}
          </span>
          <span className="material-symbols-outlined text-slate-400 text-[16px]">
            {isOpen ? "arrow_drop_up" : "arrow_drop_down"}
          </span>
        </div>
        {isOpen && (
          <div className="absolute z-50 w-full mt-0.5 bg-white border border-slate-200 rounded-md shadow-xl overflow-hidden flex flex-col">
            <div className="p-1.5 border-b border-slate-100 bg-slate-50 flex items-center gap-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm nhanh..."
                className="w-full bg-transparent border-none text-xs outline-none p-0.5"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto max-h-36 text-xs">
              {options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                  className={`px-2.5 py-1.5 cursor-pointer hover:bg-slate-50 flex items-center justify-between ${Number(value) === opt.id ? "bg-blue-50 font-bold text-primary" : "text-slate-700"}`}
                >
                  <span className="truncate">{opt.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Field>
  );
}

// ─── MAIN MODAL COMPONENT (NO-SCROLL LAYOUT) ─────────────────────────────────
export default function OpportunityFormModal({
  isOpen,
  onClose,
  opportunityId,
  onSaved,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stages, setStages] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    opportunityCode: "",
    name: "",
    customerId: "",
    campaignId: "",
    stageId: "",
    statusId: "",
    probability: "",
    expectedCloseDate: "",
    description: "",
    assignedTo: "",
    currencyCode: "VND",
  });

  useEffect(() => {
    if (!isOpen) return;
    const loadMetadataAndDetails = async () => {
      try {
        // ─── [API ENDPOINT]: LẤY DANH MỤC CẤU HÌNH ───
        const [stageRes, statusRes] = await Promise.all([
          api.get("/opportunity-stages"),
          api.get("/opportunity-statuses"),
        ]);
        setStages(stageRes.data || []);
        setStatuses(statusRes.data || []);
      } catch (err) {
        console.error(err);
      }

      if (opportunityId) {
        setLoading(true);
        try {
          // ─── [API ENDPOINT]: LẤY CHI TIẾT CƠ HỘI ĐỂ EDIT ───
          const res = await api.get(`/opportunities/${opportunityId}`);
          if (res.data) setForm(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setForm({
          opportunityCode: `OPP-${Date.now().toString().slice(-6)}`,
          name: "",
          customerId: "",
          campaignId: "",
          stageId: "",
          statusId: "",
          probability: "",
          expectedCloseDate: "",
          description: "",
          assignedTo: "",
          currencyCode: "VND",
        });
      }
    };
    loadMetadataAndDetails();
  }, [isOpen, opportunityId]);

  const handleStageChange = (e) => {
    const selectedStageId = e.target.value;
    const stageObj = stages.find((s) => s.id === Number(selectedStageId));

    setForm((prev) => {
      // Bây giờ 'prev' đã được định nghĩa hợp lệ bên trong scope này
      let nextProbability = stageObj?.probabilityDefault
        ? stageObj.probabilityDefault
        : prev.probability;

      // Ép giá trị không vượt quá 100
      if (nextProbability && Number(nextProbability) > 100) {
        nextProbability = 100;
      }

      return {
        ...prev,
        stageId: selectedStageId,
        probability: nextProbability,
      };
    });
  };

  const handleSave = async () => {
    if (
      !form.name.trim() ||
      !form.customerId ||
      !form.stageId ||
      !form.statusId
    ) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }
    if (!validate()) {
      return; // Dừng lại nếu dữ liệu không hợp lệ, lỗi sẽ hiển thị trên giao diện
    }
    setLoading(true);
    const payload = {
      ...form,
      // Nếu có giá trị ngày, nối thêm giờ mặc định 'T00:00:00' để khớp với LocalDateTime của Java
      expectedCloseDate: form.expectedCloseDate
        ? form.expectedCloseDate.includes("T")
          ? form.expectedCloseDate
          : `${form.expectedCloseDate}T00:00:00`
        : null,

      nextFollowUpDate: form.nextFollowUpDate
        ? form.nextFollowUpDate.includes("T")
          ? form.nextFollowUpDate
          : `${form.nextFollowUpDate}T00:00:00`
        : null,
    };
    try {
      if (opportunityId) {
        // ─── [API ENDPOINT]: CẬP NHẬT BẢN GHI (PUT) ───
        await api.put(`/opportunities/${opportunityId}`, payload);
      } else {
        // ─── [API ENDPOINT]: TẠO MỚI BẢN GHI (POST) ───
        await api.post("/opportunities", payload);
      }
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      alert("Xảy ra lỗi kết nối hệ thống.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const validate = () => {
    let errs = {};

    // Kiểm tra tỷ lệ cơ hội
    if (form.probability !== "" && form.probability !== null) {
      const probNum = Number(form.probability);
      if (isNaN(probNum) || probNum < 0 || probNum > 100) {
        errs.probability = "Tỷ lệ phải nằm trong khoảng từ 0 đến 100";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0; // Trả về true nếu không có lỗi
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
      {/* max-h-fit đảm bảo form co giãn vừa vặn theo nội dung, không lạm dụng chiều cao màn hình */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-100 flex flex-col max-h-[95vh] overflow-hidden">
        {/* HEADER (Thu nhỏ padding py-3) */}
        <div className="px-5 py-3 border-b flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">
              {opportunityId ? "edit_square" : "add_business"}
            </span>
            <h3 className="text-sm font-bold text-slate-800">
              {opportunityId
                ? "Cập nhật Cơ hội Kinh doanh"
                : "Tạo mới Cơ hội Kinh doanh"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60"
          >
            <span className="material-symbols-outlined text-[18px] block">
              close
            </span>
          </button>
        </div>

        {/* NỘI DUNG MÀN HÌNH CHÍNH: Dàn trang theo Grid phẳng 3 Cột phối hợp */}
        <div className="p-5 bg-white space-y-4 text-xs overflow-hidden">
          {/* HÀNG 1: THÔNG TIN TÊN & MÃ ĐỊNH DANH */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Field label="Tên cơ hội kinh doanh" required>
                <input
                  type="text"
                  placeholder="Hợp đồng mua bán vật tư thiết bị..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>
            <div>
              <Field label="Mã định danh cơ hội">
                <input
                  type="text"
                  placeholder="Hệ thống tự sinh..."
                  value={form.opportunityCode}
                  onChange={(e) =>
                    setForm({ ...form, opportunityCode: e.target.value })
                  }
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* HÀNG 2: BỘ BA TÌM KIẾM LIÊN KẾT (CUSTOMER, USER, CAMPAIGN) */}
          <div className="grid grid-cols-3 gap-4">
            <AsyncSearchSelect
              label="Khách hàng liên kết"
              placeholder="Chọn khách hàng..."
              endpoint="/customers"
              mockData={MOCK_CUSTOMERS}
              value={form.customerId}
              onChange={(id) => setForm({ ...form, customerId: id })}
              required
            />
            <AsyncSearchSelect
              label="Nhân viên phụ trách"
              placeholder="Chỉ định nhân viên..."
              endpoint="/users"
              mockData={MOCK_USERS}
              value={form.assignedTo}
              onChange={(id) => setForm({ ...form, assignedTo: id })}
            />
            <AsyncSearchSelect
              label="Chiến dịch Marketing"
              placeholder="Chọn chiến dịch..."
              endpoint="/campaigns"
              mockData={MOCK_CAMPAIGNS}
              value={form.campaignId}
              onChange={(id) => setForm({ ...form, campaignId: id })}
            />
          </div>

          {/* HÀNG 3: TRẠNG THÁI TIẾN ĐỘ & DỰ BÁO TÀI CHÍNH */}
          <div className="grid grid-cols-3 gap-4">
            <Field label="Giai đoạn bán hàng" required>
              <div className="relative">
                <select
                  value={form.stageId}
                  onChange={handleStageChange}
                  className={selectCls}
                >
                  <option value="">-- Chọn giai đoạn --</option>
                  {stages.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2 text-slate-400 text-[16px] pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </Field>

            <Field label="Trạng thái xử lý" required>
              <div className="relative">
                <select
                  value={form.statusId}
                  onChange={(e) =>
                    setForm({ ...form, statusId: e.target.value })
                  }
                  className={selectCls}
                >
                  <option value="">-- Chọn trạng thái --</option>
                  {statuses.map((su) => (
                    <option key={su.id} value={su.id}>
                      {su.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2 text-slate-400 text-[16px] pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </Field>

            <Field label="Tỷ lệ thành công (%)">
              <input
                type="number"
                className={inputCls2(errors.probability)}
                placeholder="Ví dụ: 70"
                value={form.probability}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({
                    ...form,
                    probability: val === "" ? "" : Number(val),
                  });

                  // Xóa lỗi ngay khi người dùng đang gõ lại giá trị mới (Tùy chọn giúp UX mượt hơn)
                  if (errors.probability) {
                    setErrors((prev) => ({ ...prev, probability: null }));
                  }
                }}
              />
            </Field>
          </div>

          {/* HÀNG 4: THỜI GIAN & ĐƠN VỊ TIỀN TỆ */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Field label="Ngày chốt giao dịch dự kiến">
                <input
                  type="date"
                  value={
                    form.expectedCloseDate
                      ? form.expectedCloseDate.substring(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setForm({ ...form, expectedCloseDate: e.target.value })
                  }
                  className={inputCls}
                />
              </Field>
            </div>
            <div>
              <Field label="Tiền tệ giao dịch">
                <input
                  type="text"
                  value={form.currencyCode}
                  disabled
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* HÀNG 5: MÔ TẢ CHI TIẾT (Bóp gọn chiều cao text-area chỉ còn 2 rows) */}
          <div className="grid grid-cols-1">
            <Field label="Mô tả chi tiết bối cảnh cơ hội">
              <textarea
                rows={2}
                placeholder="Ghi nhận các yêu cầu cụ thể, tiến trình thảo luận sơ bộ..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className={`${inputCls} resize-none`}
              />
            </Field>
          </div>
        </div>

        {/* FOOTER ACTIONS (Thu nhỏ padding py-2.5) */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <div>
            {opportunityId ? (
              <button
                type="button"
                onClick={() =>
                  navigate(`/opportunities/${opportunityId}/items`)
                }
                className="text-[11px] font-bold text-[#1a237e] hover:text-blue-900 flex items-center gap-1 py-1 px-2.5 rounded border border-blue-200 hover:bg-blue-50 transition-all"
              >
                <span className="material-symbols-outlined text-sm">
                  edit_note
                </span>
                Sản phẩm báo giá
              </button>
            ) : (
              <p className="text-[10px] text-slate-400 italic">
                Kiểm tra thông tin trước khi lưu.
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded"
            >
              HỦY BỎ
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-1.5 text-xs font-bold text-white rounded bg-[#1A237E] hover:bg-blue-900 flex items-center gap-1.5 shadow disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? (
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : opportunityId ? (
                "CẬP NHẬT"
              ) : (
                "LƯU DỮ LIỆU"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
