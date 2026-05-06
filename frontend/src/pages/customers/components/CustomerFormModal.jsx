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

  // SỬA: Loại bỏ provinceId: 1 mặc định, để rỗng hết
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
    statusId: 1,
    rankId: "",
    sourceId: "",
    campaignId: "",
    provinceId: "",
    branchId: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setErrors({});
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
        provinceId: initialData.provinceId || "",
        branchId: initialData.branchId || "",
      });
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
        statusId: 1,
        rankId: "",
        sourceId: "",
        campaignId: "",
        provinceId: "",
        branchId: "",
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleEnterToNext = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const elements = Array.from(form.elements).filter((el) =>
        ["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName),
      );
      const index = elements.indexOf(e.target);
      if (index > -1 && index < elements.length - 1)
        elements[index + 1].focus();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Bắt buộc";
    if (
      formData.emailOfficial &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailOfficial)
    )
      newErrors.emailOfficial = "Lỗi định dạng";
    if (
      formData.mainPhone &&
      !/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(formData.mainPhone)
    )
      newErrors.mainPhone = "SĐT sai";
    if (
      formData.isOrganization &&
      formData.taxCode &&
      !/^[0-9-]{10,14}$/.test(formData.taxCode)
    )
      newErrors.taxCode = "Lỗi MST";
    if (
      !formData.isOrganization &&
      formData.citizenId &&
      !/^[0-9]{12}$/.test(formData.citizenId)
    )
      newErrors.citizenId = "Đúng 12 số";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // GIẢI PHÁP CHỐNG LỖI: Ép toàn bộ chuỗi rỗng thành null trước khi nén payload
      const payload = {
        ...formData,
        statusId: formData.statusId ? parseInt(formData.statusId) : null,
        rankId: formData.rankId ? parseInt(formData.rankId) : null,
        sourceId: formData.sourceId ? parseInt(formData.sourceId) : null,
        campaignId: formData.campaignId ? parseInt(formData.campaignId) : null,
        provinceId: formData.provinceId ? parseInt(formData.provinceId) : null,
        branchId: formData.branchId ? parseInt(formData.branchId) : null,
      };

      if (isEditMode)
        await axios.put(
          `http://localhost:8080/api/v1/customers/${initialData.id}`,
          payload,
        );
      else await axios.post("http://localhost:8080/api/v1/customers", payload);

      onSuccess();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi lưu dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl flex flex-col overflow-hidden animate-fade-in-up">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditMode ? "Sửa Khách hàng" : "Thêm Khách hàng mới"}
          </h2>
          <Button
            variant="iconOnly"
            icon="close"
            onClick={onClose}
            className="text-slate-400 hover:text-red-500"
          />
        </div>

        <form id="customerForm" onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="col-span-1 space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">
                  Loại hình
                </label>
                <div className="flex flex-col gap-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                    <input
                      type="radio"
                      name="isOrganization"
                      checked={formData.isOrganization}
                      onChange={() => {
                        setFormData({ ...formData, isOrganization: true });
                        setErrors({});
                      }}
                      onKeyDown={handleEnterToNext}
                      className="w-4 h-4 text-primary"
                    />{" "}
                    Tổ chức (B2B)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                    <input
                      type="radio"
                      name="isOrganization"
                      checked={!formData.isOrganization}
                      onChange={() => {
                        setFormData({ ...formData, isOrganization: false });
                        setErrors({});
                      }}
                      onKeyDown={handleEnterToNext}
                      className="w-4 h-4 text-primary"
                    />{" "}
                    Cá nhân (B2C)
                  </label>
                </div>
              </div>
              <div className="col-span-2 relative">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Tên khách hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onKeyDown={handleEnterToNext}
                  className={`w-full px-4 py-2 bg-white border ${errors.name ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 outline-none`}
                />
                {errors.name && (
                  <p className="text-red-500 text-[10px] absolute mt-0.5">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="col-span-1 relative">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
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
                  onKeyDown={handleEnterToNext}
                  className={`w-full px-4 py-2 bg-white border ${errors.taxCode || errors.citizenId ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 outline-none`}
                />
                {(errors.taxCode || errors.citizenId) && (
                  <p className="text-red-500 text-[10px] absolute mt-0.5">
                    {formData.isOrganization
                      ? errors.taxCode
                      : errors.citizenId}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1 relative">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Điện thoại
                </label>
                <input
                  type="text"
                  name="mainPhone"
                  value={formData.mainPhone}
                  onChange={handleChange}
                  onKeyDown={handleEnterToNext}
                  className={`w-full px-4 py-2 bg-slate-50 border ${errors.mainPhone ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 outline-none`}
                />
                {errors.mainPhone && (
                  <p className="text-red-500 text-[10px] absolute mt-0.5">
                    {errors.mainPhone}
                  </p>
                )}
              </div>
              <div className="col-span-1 relative">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Email chính
                </label>
                <input
                  type="text"
                  name="emailOfficial"
                  value={formData.emailOfficial}
                  onChange={handleChange}
                  onKeyDown={handleEnterToNext}
                  className={`w-full px-4 py-2 bg-slate-50 border ${errors.emailOfficial ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 outline-none`}
                />
                {errors.emailOfficial && (
                  <p className="text-red-500 text-[10px] absolute mt-0.5">
                    {errors.emailOfficial}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Địa chỉ (Trụ sở/Thường trú)
                </label>
                <input
                  type="text"
                  name="addressCompany"
                  value={formData.addressCompany}
                  onChange={handleChange}
                  onKeyDown={handleEnterToNext}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Trạng thái
                </label>
                <select
                  name="statusId"
                  value={formData.statusId}
                  onChange={handleChange}
                  onKeyDown={handleEnterToNext}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer"
                >
                  {statuses?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Phân hạng
                </label>
                <select
                  name="rankId"
                  value={formData.rankId}
                  onChange={handleChange}
                  onKeyDown={handleEnterToNext}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer"
                >
                  <option value="">Chưa phân hạng</option>
                  {ranks?.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Nguồn{" "}
                  {isEditMode && (
                    <span className="material-symbols-outlined text-[10px] text-orange-400">
                      lock
                    </span>
                  )}
                </label>
                <select
                  name="sourceId"
                  value={formData.sourceId}
                  onChange={handleChange}
                  disabled={isEditMode}
                  onKeyDown={handleEnterToNext}
                  className={`w-full px-4 py-2 border rounded-lg outline-none cursor-pointer ${isEditMode ? "bg-slate-100 text-slate-400" : "bg-slate-50"}`}
                >
                  <option value="">Tự nhiên</option>
                  {sources?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Chiến dịch{" "}
                  {isEditMode && (
                    <span className="material-symbols-outlined text-[10px] text-orange-400">
                      lock
                    </span>
                  )}
                </label>
                <select
                  name="campaignId"
                  value={formData.campaignId}
                  onChange={handleChange}
                  disabled={isEditMode}
                  onKeyDown={handleEnterToNext}
                  className={`w-full px-4 py-2 border rounded-lg outline-none cursor-pointer ${isEditMode ? "bg-slate-100 text-slate-400" : "bg-slate-50"}`}
                >
                  <option value="">Không có</option>
                  {campaigns?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-span-4 mt-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Mô tả / Ghi chú
              </label>
              <textarea
                name="description"
                rows="2"
                value={formData.description}
                onChange={handleChange}
                onKeyDown={handleEnterToNext}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50 resize-none"
                placeholder="Nhập ghi chú..."
              ></textarea>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Button
              variant="cancel"
              type="button"
              onClick={onClose}
              className="bg-white border"
            >
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
