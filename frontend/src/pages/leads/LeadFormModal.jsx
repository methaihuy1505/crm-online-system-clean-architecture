import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../components/ui/Button";

const LeadFormModal = ({
  isOpen,
  onClose,
  onSave,
  currentLead,
  statuses,
  sources,
  campaigns,
}) => {
  const isEditMode = !!currentLead;

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
    sourceId: "",
    campaignId: "",
    statusId: 1,
    provinceId: "",
    branchId: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setErrors({});
    if (isOpen && currentLead) {
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
        sourceId: currentLead.sourceId || "",
        campaignId: currentLead.campaignId || "",
        statusId: currentLead.statusId || 1,
        provinceId: currentLead.provinceId || "",
        branchId: currentLead.branchId || "",
      });
    } else if (isOpen && !currentLead) {
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
        sourceId: "",
        campaignId: "",
        statusId: 1,
        provinceId: "",
        branchId: "",
      });
    }
  }, [currentLead, isOpen]);

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
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Bắt buộc";
    if (
      formData.phone &&
      !/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(formData.phone)
    )
      newErrors.phone = "SĐT sai";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        expectedRevenue: formData.expectedRevenue
          ? parseFloat(formData.expectedRevenue)
          : null,
        statusId: formData.statusId ? parseInt(formData.statusId) : null,
        sourceId: formData.sourceId ? parseInt(formData.sourceId) : null,
        campaignId: formData.campaignId ? parseInt(formData.campaignId) : null,
        provinceId: formData.provinceId ? parseInt(formData.provinceId) : null,
        branchId: formData.branchId ? parseInt(formData.branchId) : null,
      };

      if (isEditMode)
        await axios.put(
          `http://localhost:8080/api/v1/leads/${currentLead.id}`,
          payload,
        );
      else await axios.post("http://localhost:8080/api/v1/leads", payload);
      onSave();
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
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditMode ? "Sửa Tiềm năng" : "Thêm Lead mới"}
          </h2>
          <Button
            variant="iconOnly"
            icon="close"
            onClick={onClose}
            className="text-slate-400 hover:text-red-500"
          />
        </div>

        <form
          id="leadForm"
          onSubmit={handleSubmit}
          className="p-6 grid grid-cols-4 gap-4"
        >
          <div className="col-span-2 relative">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Họ và Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onKeyDown={handleEnterToNext}
              className={`w-full px-4 py-2 bg-slate-50 border ${errors.fullName ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 outline-none`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-[10px] absolute mt-0.5">
                {errors.fullName}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Tên công ty (B2B)
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              onKeyDown={handleEnterToNext}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 outline-none"
            />
          </div>

          <div className="col-span-1 mt-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Mã số thuế
            </label>
            <input
              type="text"
              name="taxCode"
              value={formData.taxCode}
              onChange={handleChange}
              onKeyDown={handleEnterToNext}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 outline-none"
            />
          </div>
          <div className="col-span-1 mt-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              CCCD/CMND
            </label>
            <input
              type="text"
              name="citizenId"
              value={formData.citizenId}
              onChange={handleChange}
              onKeyDown={handleEnterToNext}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 outline-none"
            />
          </div>
          <div className="col-span-1 mt-2 relative">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onKeyDown={handleEnterToNext}
              className={`w-full px-4 py-2 bg-slate-50 border ${errors.phone ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 outline-none`}
            />
            {errors.phone && (
              <p className="text-red-500 text-[10px] absolute mt-0.5">
                {errors.phone}
              </p>
            )}
          </div>
          <div className="col-span-1 mt-2 relative">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleEnterToNext}
              className={`w-full px-4 py-2 bg-slate-50 border ${errors.email ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 outline-none`}
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] absolute mt-0.5">
                {errors.email}
              </p>
            )}
          </div>

          <div className="col-span-2 mt-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Website
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              onKeyDown={handleEnterToNext}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 outline-none"
            />
          </div>
          <div className="col-span-2 mt-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onKeyDown={handleEnterToNext}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 outline-none"
            />
          </div>

          <div className="col-span-1 mt-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Trạng thái
            </label>
            <select
              name="statusId"
              value={formData.statusId}
              onChange={handleChange}
              onKeyDown={handleEnterToNext}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none bg-white cursor-pointer"
            >
              {statuses?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-1 mt-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Doanh thu dự kiến
            </label>
            <input
              type="number"
              name="expectedRevenue"
              value={formData.expectedRevenue}
              onChange={handleChange}
              onKeyDown={handleEnterToNext}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 outline-none bg-white"
            />
          </div>

          {/* ĐÃ GỠ BỎ KHÓA CỦA NGUỒN VÀ CHIẾN DỊCH */}
          <div className="col-span-1 mt-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Nguồn
            </label>
            <select
              name="sourceId"
              value={formData.sourceId}
              onChange={handleChange}
              onKeyDown={handleEnterToNext}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none bg-white cursor-pointer"
            >
              <option value="">Tự nhiên</option>
              {sources?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-1 mt-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Chiến dịch
            </label>
            <select
              name="campaignId"
              value={formData.campaignId}
              onChange={handleChange}
              onKeyDown={handleEnterToNext}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none bg-white cursor-pointer"
            >
              <option value="">Không có</option>
              {campaigns?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-4 mt-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Mô tả / Ghi chú
            </label>
            <textarea
              name="description"
              rows="1"
              value={formData.description}
              onChange={handleChange}
              onKeyDown={handleEnterToNext}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50 resize-none"
              placeholder="Nhập ghi chú..."
            ></textarea>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
          <Button
            type="button"
            variant="cancel"
            onClick={onClose}
            className="bg-slate-50 border"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="leadForm"
            disabled={isSubmitting}
            variant="primary"
          >
            {isSubmitting ? "Đang xử lý..." : "Lưu Tiềm năng"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeadFormModal;
