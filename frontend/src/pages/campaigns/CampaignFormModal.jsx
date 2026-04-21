import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../components/ui/Button";

const CampaignFormModal = ({ isOpen, onClose, onSave, currentCampaign }) => {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
    if (currentCampaign) {
      setFormData({
        name: currentCampaign.name || "",
        startDate: currentCampaign.startDate || "",
        endDate: currentCampaign.endDate || "",
      });
    } else {
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [currentCampaign, isOpen]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Tên chiến dịch không được để trống";
    } else if (formData.name.length > 255) {
      newErrors.name = "Tên chiến dịch không được vượt quá 255 ký tự";
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.date = "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.date) {
      setErrors((prev) => ({ ...prev, [name]: null, date: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };

      if (currentCampaign && currentCampaign.id) {
        await axios.put(
          `http://localhost:8080/api/v1/campaigns/${currentCampaign.id}`,
          payload,
        );
      } else {
        await axios.post("http://localhost:8080/api/v1/campaigns", payload);
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
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-variant flex justify-between items-center bg-surface-container-lowest">
          <h3 className="text-xl font-headline font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">
              {currentCampaign ? "edit_square" : "campaign"}
            </span>
            {currentCampaign ? "Cập nhật Chiến dịch" : "Thêm Chiến dịch mới"}
          </h3>
          <Button
            variant="iconOnly"
            icon="close"
            onClick={onClose}
            className="text-on-surface-variant"
          />
        </div>

        {/* Form Body */}
        <form
          id="campaignForm"
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
        >
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
              Tên chiến dịch <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên chiến dịch..."
              className={`w-full px-4 py-2 bg-surface-container-lowest border rounded-lg focus:ring-2 focus:ring-primary outline-none ${errors.name ? "border-error" : "border-outline-variant"}`}
            />
            {errors.name && (
              <p className="text-error text-[10px] italic">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase">
                Ngày kết thúc
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg outline-none"
              />
            </div>
          </div>
          {errors.date && (
            <p className="text-error text-[10px] italic">{errors.date}</p>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-variant bg-surface-container-lowest flex justify-end gap-3">
          <Button type="button" variant="cancel" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="campaignForm"
            disabled={isSaving}
            variant="primary"
          >
            {isSaving ? "Đang lưu..." : "Lưu Chiến dịch"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignFormModal;
