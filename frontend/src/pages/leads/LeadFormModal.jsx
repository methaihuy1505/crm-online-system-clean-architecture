import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../components/ui/Button";

const LeadFormModal = ({ isOpen, onClose, onSave, currentLead }) => {
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
  const [statuses, setStatuses] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      const loadCategories = async () => {
        try {
          const [srcRes, camRes, statusesRes] = await Promise.all([
            axios.get("http://localhost:8080/api/v1/sources"),
            axios.get("http://localhost:8080/api/v1/campaigns"),
            axios.get("http://localhost:8080/api/v1/lead-statuses"),
          ]);
          setSources(srcRes.data);
          setCampaigns(camRes.data);
          setStatuses(statusesRes.data);
        } catch (error) {
          console.error("Lỗi khi tải danh mục:", error);
        }
      };
      loadCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    setErrors({});
    if (currentLead) {
      setFormData({ ...currentLead });
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

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName || formData.fullName.trim() === "") {
      newErrors.fullName = "Họ và tên không được để trống";
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải đúng 10 chữ số";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (
      formData.taxCode &&
      !/^(\d{10}|\d{12}|\d{13})$/.test(formData.taxCode)
    ) {
      newErrors.taxCode =
        "Mã số thuế chỉ được chứa số và có độ dài 10, 12 hoặc 13 ký tự";
    }

    if (formData.citizenId && !/^\d{12}$/.test(formData.citizenId)) {
      newErrors.citizenId = "CCCD phải bao gồm đúng 12 chữ số";
    }

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
      alert("Lỗi: " + (error.response?.data?.message || error.message));
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
          <Button
            variant="iconOnly"
            icon="close"
            onClick={onClose}
            className="text-on-surface-variant"
          />
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
                />
                {errors.fullName && (
                  <p className="text-error text-[10px] italic">
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                  Tên công ty
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                  Mã số thuế
                </label>
                <input
                  type="text"
                  name="taxCode"
                  value={formData.taxCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.taxCode ? "border-error" : ""}`}
                />
                {errors.taxCode && (
                  <p className="text-error text-[10px] italic">
                    {errors.taxCode}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                  CMND / CCCD
                </label>
                <input
                  type="text"
                  name="citizenId"
                  value={formData.citizenId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.citizenId ? "border-error" : ""}`}
                />
                {errors.citizenId && (
                  <p className="text-error text-[10px] italic">
                    {errors.citizenId}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                  Trạng thái <span className="text-error">*</span>
                </label>
                <select
                  name="statusId"
                  value={formData.statusId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none"
                >
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
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
                  className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.phone ? "border-error" : ""}`}
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
                  className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.email ? "border-error" : ""}`}
                />
                {errors.email && (
                  <p className="text-error text-[10px] italic">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none"
                  placeholder="https://"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                  Địa chỉ
                </label>
                <textarea
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none"
                ></textarea>
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
                  className="w-full px-4 py-2 border rounded-lg outline-none"
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
                  className="w-full px-4 py-2 border rounded-lg outline-none"
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
                  className="w-full px-4 py-2 border rounded-lg outline-none"
                  placeholder="VNĐ"
                />
              </div>
              <div className="space-y-1.5 md:col-span-3">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                  Ghi chú / Mô tả
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none"
                  placeholder="Nhập ghi chú..."
                ></textarea>
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-surface-variant bg-surface-container-lowest flex justify-end gap-3 sticky bottom-0 z-10">
          <Button type="button" variant="cancel" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="leadForm"
            disabled={isSaving}
            variant="primary"
          >
            {isSaving ? "Đang lưu..." : "Lưu Khách Hàng"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeadFormModal;
