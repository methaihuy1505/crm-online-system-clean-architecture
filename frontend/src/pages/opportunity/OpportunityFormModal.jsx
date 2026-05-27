import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "axios";

const api = axiosInstance.create({ baseURL: "http://localhost:8080/api/v1" });

// Cấu hình ID trạng thái Thất bại & Người dùng giả định để khớp khóa ngoại hệ thống
const LOST_STATUS_ID = 6;
const CURRENT_LOGGED_IN_USER_ID = 1;

// ─── OPTIMIZED COMPACT UI STYLES ─────────────────────────────────────────────
const inputCls =
  "w-full bg-surface-container-low border border-slate-200/60 rounded-md px-2.5 py-1.5 text-xs " +
  "focus:ring-1 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none " +
  "placeholder:text-slate-300 transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed";

const inputCls2 = (hasError) =>
  `w-full bg-surface-container-low border border-slate-200/60 rounded-md px-2.5 py-1.5 text-xs transition-all outline-none focus:bg-white focus:ring-1 ${
    hasError
      ? "ring-1 ring-error/60 border-red-400 bg-red-50 focus:ring-error"
      : "focus:ring-primary/20 focus:border-primary"
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
  value,
  onChange,
  required,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [_loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const getLabel = (opt) => opt?.fullName || opt?.name || "";
  const selectedOption =
    options.find((opt) => Number(opt.id) === Number(value)) || null;
  const displayValue = selectedOption ? getLabel(selectedOption) : "";

  useEffect(() => {
    if (!isOpen) setSearch("");
  }, [isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `${endpoint}?search=${encodeURIComponent(search)}`,
        );
        let rawData = [];
        if (response.data && Array.isArray(response.data)) {
          rawData = response.data;
        } else if (
          response.data?.content &&
          Array.isArray(response.data.content)
        ) {
          rawData = response.data.content;
        }
        setOptions(rawData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [search, endpoint]);

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
              {options.length === 0 ? (
                <div className="px-2.5 py-1.5 text-slate-400 italic">
                  Không có dữ liệu
                </div>
              ) : (
                options.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => {
                      onChange(opt.id);
                      setIsOpen(false);
                    }}
                    className={`px-2.5 py-1.5 cursor-pointer hover:bg-slate-50 flex items-center justify-between ${Number(value) === opt.id ? "bg-blue-50 font-bold text-primary" : "text-slate-700"}`}
                  >
                    <span className="truncate">{getLabel(opt)}</span>
                  </div>
                ))
              )}
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
  const [lostReasons, setLostReasons] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    opportunityCode: "",
    name: "",
    customerId: "",
    campaignId: "",
    stageId: "",
    statusId: "",
    lostReasonId: "",
    depositAmount: 0,
    probability: "",
    description: "",
    nextFollowUpDate: "",
    expectedCloseDate: "",
    actualCloseDate: "",
    assignedTo: "",
    currencyCode: "VND",
    createdBy: CURRENT_LOGGED_IN_USER_ID,
    updatedBy: CURRENT_LOGGED_IN_USER_ID,
  });

  useEffect(() => {
    if (!isOpen) return;
    const loadMetadataAndDetails = async () => {
      try {
        const [stageRes, statusRes, lostReasonRes] = await Promise.all([
          api.get("/opportunity-stages"),
          api.get("/opportunity-statuses"),
          api.get("/lost-reasons").catch(() => ({ data: [] })),
        ]);
        setStages(stageRes.data || []);
        setStatuses(statusRes.data || []);
        setLostReasons(lostReasonRes.data || []);
      } catch (err) {
        console.error(err);
      }

      if (opportunityId) {
        setLoading(true);
        try {
          const res = await api.get(`/opportunities/${opportunityId}`);
          if (res.data) {
            const data = res.data;
            setForm({
              ...data,
              expectedCloseDate: data.expectedCloseDate
                ? data.expectedCloseDate.substring(0, 10)
                : "",
              nextFollowUpDate: data.nextFollowUpDate
                ? data.nextFollowUpDate.substring(0, 10)
                : "",
              actualCloseDate: data.actualCloseDate
                ? data.actualCloseDate.substring(0, 10)
                : "",
              updatedBy: CURRENT_LOGGED_IN_USER_ID,
            });
          }
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
          lostReasonId: "",
          depositAmount: 0,
          probability: "",
          description: "",
          nextFollowUpDate: "",
          expectedCloseDate: "",
          actualCloseDate: "",
          assignedTo: "",
          currencyCode: "VND",
          createdBy: CURRENT_LOGGED_IN_USER_ID,
          updatedBy: CURRENT_LOGGED_IN_USER_ID,
        });
      }
    };
    loadMetadataAndDetails();
  }, [isOpen, opportunityId]);

  const handleStageChange = (e) => {
    const selectedStageId = e.target.value;
    const stageObj = stages.find(
      (s) => Number(s.id) === Number(selectedStageId),
    );

    setForm((prev) => {
      let nextProbability = stageObj?.probabilityDefault
        ? stageObj.probabilityDefault
        : prev.probability;
      if (nextProbability && Number(nextProbability) > 100)
        nextProbability = 100;

      // Tự động đồng bộ trạng thái xử lý khi chọn stage đóng thất bại
      let nextStatusId = prev.statusId;
      if (Number(selectedStageId) === 6) {
        // 6 là id của 'Closed Lost'
        nextStatusId = LOST_STATUS_ID; // Tự chuyển trạng thái sang LOST_STATUS_ID
      }

      return {
        ...prev,
        stageId: selectedStageId,
        probability: nextProbability,
        statusId: nextStatusId, // Cập nhật trạng thái xử lý
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
    const currentStage = stages.find(
      (st) => Number(st.id) === Number(form.stageId),
    );
    const isStageClosed =
      currentStage?.isClosed === true ||
      currentStage?.isClosed === "true" ||
      Number(currentStage?.isClosed) === 1;

    if (
      isStageClosed &&
      Number(form.statusId) === LOST_STATUS_ID &&
      !form.lostReasonId
    ) {
      alert("Vui lòng chọn Lý do thất bại khi giai đoạn đã đóng thầu!");
      return;
    }
    if (!validate()) return;

    setLoading(true);
    const payload = {
      ...form,
      customerId: form.customerId ? Number(form.customerId) : null,
      campaignId: form.campaignId ? Number(form.campaignId) : null,
      stageId: form.stageId ? Number(form.stageId) : null,
      statusId: form.statusId ? Number(form.statusId) : null,
      lostReasonId:
        Number(form.stageId) === 6 && form.lostReasonId
          ? Number(form.lostReasonId)
          : null,
      depositAmount: form.depositAmount ? Number(form.depositAmount) : 0,
      assignedTo: form.assignedTo ? Number(form.assignedTo) : null,

      expectedCloseDate: form.expectedCloseDate
        ? form.expectedCloseDate.includes("T")
          ? form.expectedCloseDate
          : `${form.expectedCloseDate}T00:00:00`
        : null,
      actualCloseDate: form.actualCloseDate
        ? form.actualCloseDate.includes("T")
          ? form.actualCloseDate
          : `${form.actualCloseDate}T00:00:00`
        : null,
      nextFollowUpDate: form.nextFollowUpDate
        ? form.nextFollowUpDate.includes("T")
          ? form.nextFollowUpDate
          : `${form.nextFollowUpDate}T00:00:00`
        : null,
    };

    try {
      if (opportunityId) {
        await api.put(`/opportunities/${opportunityId}`, payload);
      } else {
        await api.post("/opportunities", payload);
      }
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      alert("Xảy ra lỗi kết nối hoặc xử lý nghiệp vụ hệ thống.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    let errs = {};
    if (form.probability !== "" && form.probability !== null) {
      const probNum = Number(form.probability);
      if (isNaN(probNum) || probNum < 0 || probNum > 100) {
        errs.probability = "Tỷ lệ phải từ 0 đến 100";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  if (!isOpen) return null;

  // 🛠️ TÍNH TOÁN LOGIC HIỂN THỊ LÝ DO THẤT BẠI DÙNG CHUNG CHO KHẮP FORM
  const currentStageObj = stages.find(
    (st) => Number(st.id) === Number(form.stageId),
  );
  const isCurrentStageClosed =
    currentStageObj?.isClosed === true ||
    currentStageObj?.isClosed === "true" ||
    Number(currentStageObj?.isClosed) === 1;
  const isCurrentLostStage = Number(form.stageId) === 6; // 6 là id của 'Closed Lost'

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-100 flex flex-col max-h-[95vh] overflow-hidden">
        {/* HEADER */}
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

        {/* NỘI DUNG FORM CHÍNH */}
        <div className="p-5 bg-white space-y-4 text-xs overflow-y-auto">
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
                  disabled={!!opportunityId}
                />
              </Field>
            </div>
          </div>

          {/* HÀNG 2: BỘ BA TÌM KIẾM LIÊN KẾT */}
          <div className="grid grid-cols-3 gap-4">
            <AsyncSearchSelect
              label="Khách hàng liên kết"
              placeholder="Chọn khách hàng..."
              endpoint="/customers"
              value={form.customerId}
              onChange={(id) => setForm({ ...form, customerId: id })}
              required
            />
            <AsyncSearchSelect
              label="Nhân viên phụ trách"
              placeholder="Chỉ định nhân viên..."
              endpoint="/users"
              value={form.assignedTo}
              onChange={(id) => setForm({ ...form, assignedTo: id })}
            />
            <AsyncSearchSelect
              label="Chiến dịch Marketing"
              placeholder="Chọn chiến dịch..."
              endpoint="/campaigns"
              value={form.campaignId}
              onChange={(id) => setForm({ ...form, campaignId: id })}
            />
          </div>

          {/* HÀNG 3: TRẠNG THÁI TIẾN ĐỘ & TỶ LỆ TRÚNG THẦU */}
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
                onChange={(e) =>
                  setForm({
                    ...form,
                    probability:
                      e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
              />
              {errors.probability && (
                <p className="text-[10px] text-red-500 mt-0.5">
                  {errors.probability}
                </p>
              )}
            </Field>
          </div>

          {/* CÁC TRƯỜNG BIẾN ĐỘNG THEO CHẾ ĐỘ VÀ ĐIỀU KIỆN ĐẶC BIỆT */}
          <div className="grid grid-cols-3 gap-4 p-3 bg-blue-50/40 rounded-lg border border-blue-100/60 transition-all">
            {/* Tiền cọc và Ngày chốt thực tế ẩn hiện tùy thuộc vào chế độ sửa/tạo mới */}
            <div>
              <Field label="Số tiền đặt cọc (Deposit)">
                <input
                  type="number"
                  placeholder="Nhập số tiền cọc..."
                  value={form.depositAmount}
                  onChange={(e) =>
                    setForm({ ...form, depositAmount: e.target.value })
                  }
                  className={inputCls}
                  disabled={!opportunityId} // Chỉ cho nhập cọc khi Edit Mode
                />
              </Field>
            </div>

            <div>
              <Field label="Ngày đóng thực tế (Actual Close)">
                <input
                  type="date"
                  value={
                    form.actualCloseDate
                      ? form.actualCloseDate.substring(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setForm({ ...form, actualCloseDate: e.target.value })
                  }
                  className={inputCls}
                  disabled={!opportunityId}
                />
              </Field>
            </div>

            {/* 🛠️ DI CHUYỂN RA KHỎI LÒNG KHỐI EDIT MODE ĐỂ CHẠY ĐƯỢC CHO CẢ TẠO MỚI VÀ SỬA */}
            <div>
              {isCurrentLostStage && isCurrentStageClosed ? (
                <Field label="Lý do thất bại (*)" required>
                  <div className="relative">
                    <select
                      value={form.lostReasonId || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          lostReasonId: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                      className={selectCls}
                    >
                      <option value="">-- Chọn lý do --</option>
                      {lostReasons.map((lr) => (
                        <option key={lr.id} value={lr.id}>
                          {lr.name}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-2 text-slate-400 text-[16px] pointer-events-none">
                      arrow_drop_down
                    </span>
                  </div>
                </Field>
              ) : (
                <div className="flex items-center text-slate-400 italic text-[11px] pt-4 pl-2 h-full">
                  Giao dịch đang tiến triển.
                </div>
              )}
            </div>
          </div>

          {/* HÀNG 4: THỜI GIAN THEO DÕI */}
          <div className="grid grid-cols-3 gap-4">
            <div>
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
              <Field label="Ngày liên hệ tiếp theo">
                <input
                  type="date"
                  value={
                    form.nextFollowUpDate
                      ? form.nextFollowUpDate.substring(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setForm({ ...form, nextFollowUpDate: e.target.value })
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

          {/* HÀNG 5: MÔ TẢ CHI TIẾT */}
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

        {/* FOOTER ACTIONS */}
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
