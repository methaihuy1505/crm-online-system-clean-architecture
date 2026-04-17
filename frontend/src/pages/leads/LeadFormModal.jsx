import React, { useState, useEffect } from "react";
import axios from "axios";

const LeadFormModal = ({ isOpen, onClose, onSave, currentLead }) => {
  // 1. State chứa FULL các trường (Giữ nguyên cấu trúc của bạn)
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    phone: "",
    email: "",
    website: "",
    taxCode: "",
    citizenId: "",
    address: "",
    expectedRevenue: "",
    description: "",
    provinceId: "",
    branchId: "",
    sourceId: "",
    campaignId: "",
    statusId: 1,
    assignedTo: "",
    productInterestIds: [],
  });

  const [sources, setSources] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // === BỔ SUNG STATE QUẢN LÝ LỖI ===
  const [errors, setErrors] = useState({});

  // 2. Load danh mục (Giữ nguyên cấu trúc của bạn)
  useEffect(() => {
    if (isOpen) {
      const loadCategories = async () => {
        try {
          const [srcRes, camRes] = await Promise.all([
            axios.get("http://localhost:8080/api/v1/sources"),
            axios.get("http://localhost:8080/api/v1/campaigns"),
          ]);
          setSources(srcRes.data);
          setCampaigns(camRes.data);
        } catch (error) {
          console.error("Lỗi khi tải danh mục:", error);
        }
      };
      loadCategories();
    }
  }, [isOpen]);

  // 3. Load dữ liệu khi Sửa/Thêm (Giữ nguyên cấu trúc của bạn)
  useEffect(() => {
    setErrors({}); // Reset lỗi mỗi khi đóng/mở modal
    if (currentLead) {
      setFormData({
        fullName: currentLead.fullName || "",
        companyName: currentLead.companyName || "",
        phone: currentLead.phone || "",
        email: currentLead.email || "",
        website: currentLead.website || "",
        taxCode: currentLead.taxCode || "",
        citizenId: currentLead.citizenId || "",
        address: currentLead.address || "",
        expectedRevenue: currentLead.expectedRevenue || "",
        description: currentLead.description || "",
        provinceId: currentLead.provinceId || "",
        branchId: currentLead.branchId || "",
        sourceId: currentLead.sourceId || "",
        campaignId: currentLead.campaignId || "",
        statusId: currentLead.statusId || 1,
        assignedTo: currentLead.assignedTo || "",
        productInterestIds: currentLead.productInterestIds || [],
      });
    } else {
      setFormData({
        fullName: "",
        companyName: "",
        phone: "",
        email: "",
        website: "",
        taxCode: "",
        citizenId: "",
        address: "",
        expectedRevenue: "",
        description: "",
        provinceId: "",
        branchId: "",
        sourceId: "",
        campaignId: "",
        statusId: 1,
        assignedTo: "",
        productInterestIds: [],
      });
    }
  }, [currentLead, isOpen]);

  // === HÀM KIỂM TRA VALIDATION ===
  const validateForm = () => {
    let newErrors = {};

    // Bắt buộc nhập Họ tên
    if (!formData.fullName || formData.fullName.trim() === "") {
      newErrors.fullName = "Họ và tên không được để trống";
    }

    // Kiểm tra định dạng Phone (nếu có nhập)
    if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải có từ 10-11 chữ số";
    }

    // Kiểm tra định dạng Email (nếu có nhập)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng (VD: example@mail.com)";
    }

    // Bắt buộc có trạng thái
    if (!formData.statusId) {
      newErrors.statusId = "Vui lòng chọn trạng thái";
    }

    setErrors(newErrors);
    // Nếu object newErrors không có key nào => Valid
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa thông báo lỗi của trường đang nhập
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gọi hàm validate trước khi xử lý
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        expectedRevenue: formData.expectedRevenue
          ? parseFloat(formData.expectedRevenue)
          : null,
        provinceId: formData.provinceId ? parseInt(formData.provinceId) : null,
        branchId: formData.branchId ? parseInt(formData.branchId) : null,
        sourceId: formData.sourceId ? parseInt(formData.sourceId) : null,
        campaignId: formData.campaignId ? parseInt(formData.campaignId) : null,
        assignedTo: formData.assignedTo ? parseInt(formData.assignedTo) : null,
      };

      if (currentLead && currentLead.id) {
        await axios.put(
          `http://localhost:8080/api/v1/leads/${currentLead.id}`,
          payload,
        );
      } else {
        await axios.post("http://localhost:8080/api/v1/leads", payload);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu Lead:", error);
      alert(
        "Có lỗi xảy ra: " + (error.response?.data?.message || error.message),
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="px-6 py-4 border-b border-surface-variant flex justify-between items-center bg-surface-container-lowest sticky top-0 z-10">
          <h3 className="text-xl font-headline font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">
              {currentLead ? "edit_document" : "person_add"}
            </span>
            {currentLead ? "Cập nhật Khách hàng" : "Thêm Khách hàng mới"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form
          id="leadForm"
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto custom-scrollbar space-y-8"
        >
          <div>
            <h4 className="text-sm font-bold text-primary mb-4 border-b border-surface-variant/50 pb-2 uppercase tracking-wider">
              Thông tin chung
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                  Họ và Tên <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-surface-container-lowest border rounded-lg focus:ring-2 focus:ring-primary outline-none ${errors.fullName ? "border-error" : "border-outline-variant"}`}
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
                {errors.fullName && (
                  <p className="text-error text-[10px] italic">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                  Tên công ty / Tổ chức
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Để trống nếu là khách cá nhân"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                  Trạng thái Lead <span className="text-error">*</span>
                </label>
                <select
                  name="statusId"
                  value={formData.statusId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-surface-container-lowest border rounded-lg focus:ring-2 focus:ring-primary outline-none ${errors.statusId ? "border-error" : "border-outline-variant"}`}
                >
                  <option value={1}>Mới</option>
                  <option value={2}>Đang liên hệ</option>
                  <option value={3}>Tiềm năng</option>
                  <option value={4}>Đã chuyển đổi</option>
                  <option value={5}>Mất/Hủy</option>
                </select>
                {errors.statusId && (
                  <p className="text-error text-[10px] italic">
                    {errors.statusId}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-secondary mb-4 border-b border-surface-variant/50 pb-2 uppercase tracking-wider">
              Thông tin liên lạc
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-surface-container-lowest border rounded-lg outline-none ${errors.phone ? "border-error" : "border-outline-variant"}`}
                />
                {errors.phone && (
                  <p className="text-error text-[10px] italic">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-surface-container-lowest border rounded-lg outline-none ${errors.email ? "border-error" : "border-outline-variant"}`}
                />
                {errors.email && (
                  <p className="text-error text-[10px] italic">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-primary-container mb-4 border-b border-surface-variant/50 pb-2 uppercase tracking-wider">
              Tiếp thị & Quản lý
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                  Nguồn khách
                </label>
                <select
                  name="sourceId"
                  value={formData.sourceId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="">-- Chọn nguồn --</option>
                  {sources.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                  Chiến dịch
                </label>
                <select
                  name="campaignId"
                  value={formData.campaignId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="">-- Chọn chiến dịch --</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                  Doanh thu dự kiến
                </label>
                <input
                  type="number"
                  name="expectedRevenue"
                  value={formData.expectedRevenue}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="VNĐ"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-surface-variant bg-surface-container-lowest flex justify-end gap-3 sticky bottom-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="leadForm"
            disabled={isSaving}
            className="px-8 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-[#1A237E] shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <span
                  className="material-symbols-outlined animate-spin"
                  style={{ fontSize: "18px" }}
                >
                  progress_activity
                </span>{" "}
                Đang lưu...
              </>
            ) : (
              <>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  save
                </span>{" "}
                Lưu Khách Hàng
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadFormModal;
