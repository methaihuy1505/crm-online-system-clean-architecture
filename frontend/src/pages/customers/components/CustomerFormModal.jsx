import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../../components/ui/Button";

const CustomerFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  statuses,
  ranks,
  sources,
  campaigns,
}) => {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    isOrganization: true,
    taxCode: "",
    citizenId: "",
    mainPhone: "",
    emailOfficial: "",
    addressCompany: "",
    description: "",
    provinceId: 1,
    statusId: 1,
    rankId: "",
    sourceId: "",
    campaignId: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        ...initialData,
        taxCode: initialData.taxCode || "",
        citizenId: initialData.citizenId || "",
        mainPhone: initialData.mainPhone || "",
        emailOfficial: initialData.emailOfficial || "",
        statusId: initialData.statusId || 1,
        rankId: initialData.rankId || "",
        sourceId: initialData.sourceId || "",
        campaignId: initialData.campaignId || "",
      });
      setErrors({});
    } else if (isOpen && !initialData) {
      setFormData({
        name: "",
        shortName: "",
        isOrganization: true,
        taxCode: "",
        citizenId: "",
        mainPhone: "",
        emailOfficial: "",
        addressCompany: "",
        description: "",
        provinceId: 1,
        statusId: 1,
        rankId: "",
        sourceId: "",
        campaignId: "",
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mstRegex = /^[0-9-]{10,14}$/;
    const cccdRegex = /^[0-9]{12}$/; // Đúng 12 số

    if (!formData.name.trim())
      newErrors.name = "Tên khách hàng không được để trống";

    if (formData.emailOfficial && !emailRegex.test(formData.emailOfficial)) {
      newErrors.emailOfficial = "Email không đúng định dạng";
    }
    if (formData.mainPhone && !phoneRegex.test(formData.mainPhone)) {
      newErrors.mainPhone = "Số điện thoại không hợp lệ";
    }

    // Rẽ nhánh logic validate dựa vào việc là Doanh nghiệp hay Cá nhân
    if (
      formData.isOrganization &&
      formData.taxCode &&
      !mstRegex.test(formData.taxCode)
    ) {
      newErrors.taxCode = "Mã số thuế chưa hợp lệ (Thường gồm 10-14 ký tự số)";
    }
    if (
      !formData.isOrganization &&
      formData.citizenId &&
      !cccdRegex.test(formData.citizenId)
    ) {
      newErrors.citizenId = "CCCD bắt buộc phải là 12 chữ số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:8080/api/v1/customers/${initialData.id}`,
          formData,
        );
        alert("Cập nhật Khách hàng thành công!");
      } else {
        await axios.post("http://localhost:8080/api/v1/customers", formData);
        alert("Thêm mới Khách hàng thành công!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Lỗi lưu dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditMode ? "Chỉnh sửa Khách hàng" : "Thêm Khách hàng mới"}
          </h2>
          <Button
            variant="iconOnly"
            icon="close"
            onClick={onClose}
            className="text-slate-400 hover:text-red-500"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 custom-scrollbar"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h3 className="text-sm font-black text-primary uppercase tracking-widest border-b pb-2">
                Thông tin định danh
              </h3>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isOrganization"
                    checked={formData.isOrganization === true}
                    onChange={() => {
                      setFormData({ ...formData, isOrganization: true });
                      setErrors({ ...errors, citizenId: "", taxCode: "" });
                    }}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm font-medium">Tổ chức (B2B)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isOrganization"
                    checked={formData.isOrganization === false}
                    onChange={() => {
                      setFormData({ ...formData, isOrganization: false });
                      setErrors({ ...errors, citizenId: "", taxCode: "" });
                    }}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm font-medium">Cá nhân (B2C)</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Tên khách hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-slate-50 border ${errors.name ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-primary"} rounded-lg focus:ring-2 outline-none`}
                />
                {errors.name && (
                  <p className="text-red-500 text-[10px] mt-1 italic">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {formData.isOrganization ? "Mã số thuế" : "CCCD"}
                  </label>
                  <input
                    type="text"
                    name={formData.isOrganization ? "taxCode" : "citizenId"}
                    value={
                      formData.isOrganization
                        ? formData.taxCode
                        : formData.citizenId
                    }
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border ${errors.taxCode || errors.citizenId ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-primary"} rounded-lg focus:ring-2 outline-none`}
                  />
                  {(errors.taxCode || errors.citizenId) && (
                    <p className="text-red-500 text-[10px] mt-1 italic">
                      {formData.isOrganization
                        ? errors.taxCode
                        : errors.citizenId}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Điện thoại
                  </label>
                  <input
                    type="text"
                    name="mainPhone"
                    value={formData.mainPhone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border ${errors.mainPhone ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-primary"} rounded-lg focus:ring-2 outline-none`}
                  />
                  {errors.mainPhone && (
                    <p className="text-red-500 text-[10px] mt-1 italic">
                      {errors.mainPhone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Email chính
                </label>
                <input
                  type="text"
                  name="emailOfficial"
                  value={formData.emailOfficial}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-slate-50 border ${errors.emailOfficial ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-primary"} rounded-lg focus:ring-2 outline-none`}
                />
                {errors.emailOfficial && (
                  <p className="text-red-500 text-[10px] mt-1 italic">
                    {errors.emailOfficial}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-sm font-black text-primary uppercase tracking-widest border-b pb-2">
                Phân loại & Hệ thống
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="statusId"
                    value={formData.statusId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  >
                    {statuses.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Phân hạng
                  </label>
                  <select
                    name="rankId"
                    value={formData.rankId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  >
                    <option value="">Chưa phân hạng</option>
                    {ranks.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex justify-between">
                    Nguồn{" "}
                    {isEditMode && (
                      <span
                        className="material-symbols-outlined text-[14px] text-orange-400"
                        title="Đã khóa"
                      >
                        lock
                      </span>
                    )}
                  </label>
                  <select
                    name="sourceId"
                    value={formData.sourceId}
                    onChange={handleChange}
                    disabled={isEditMode}
                    className={`w-full px-4 py-2 border border-slate-200 rounded-lg outline-none ${isEditMode ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-50 focus:ring-2 focus:ring-primary"}`}
                  >
                    <option value="">Tự nhiên (Không rõ)</option>
                    {sources.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex justify-between">
                    Chiến dịch{" "}
                    {isEditMode && (
                      <span
                        className="material-symbols-outlined text-[14px] text-orange-400"
                        title="Đã khóa"
                      >
                        lock
                      </span>
                    )}
                  </label>
                  <select
                    name="campaignId"
                    value={formData.campaignId}
                    onChange={handleChange}
                    disabled={isEditMode}
                    className={`w-full px-4 py-2 border border-slate-200 rounded-lg outline-none ${isEditMode ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-50 focus:ring-2 focus:ring-primary"}`}
                  >
                    <option value="">Không có</option>
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Địa chỉ
                </label>
                <textarea
                  rows="2"
                  name="addressCompany"
                  value={formData.addressCompany}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="cancel" type="button" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Lưu thông tin"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerFormModal;
