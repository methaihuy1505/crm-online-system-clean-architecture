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
      setFormData({ name: "", startDate: "", endDate: "" });
    }
  }, [currentCampaign, isOpen]);

  const handleEnterToNext = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const elements = Array.from(form.elements).filter((el) =>
        ["INPUT", "SELECT"].includes(el.tagName),
      );
      const index = elements.indexOf(e.target);
      if (index > -1 && index < elements.length - 1)
        elements[index + 1].focus();
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Bắt buộc nhập";
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.date = "Ngày kết thúc phải sau ngày bắt đầu";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.date)
      setErrors((prev) => ({ ...prev, [name]: null, date: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };
      if (currentCampaign?.id)
        await axios.put(
          `http://localhost:8080/api/v1/campaigns/${currentCampaign.id}`,
          payload,
        );
      else await axios.post("http://localhost:8080/api/v1/campaigns", payload);
      onSave();
      onClose();
    } catch (error) {
      console.error("Lỗi lưu dữ liệu!",error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden animate-fade-in-up">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">
            {currentCampaign ? "Cập nhật Chiến dịch" : "Thêm Chiến dịch mới"}
          </h3>
          <Button
            variant="iconOnly"
            icon="close"
            onClick={onClose}
            className="text-slate-400 hover:text-red-500"
          />
        </div>

        <form
          id="campaignForm"
          onSubmit={handleSubmit}
          className="p-6 grid grid-cols-4 gap-4"
        >
          <div className="col-span-2 relative">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Tên chiến dịch <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onKeyDown={handleEnterToNext}
              placeholder="Ví dụ: Khuyến mãi mùa Hè 2026"
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
              Ngày bắt đầu
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              onKeyDown={handleEnterToNext}
              className={`w-full px-4 py-2 bg-slate-50 border ${errors.date ? "border-red-500" : "border-slate-200"} rounded-lg outline-none`}
            />
          </div>

          <div className="col-span-1 relative">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Ngày kết thúc
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              onKeyDown={handleEnterToNext}
              className={`w-full px-4 py-2 bg-slate-50 border ${errors.date ? "border-red-500" : "border-slate-200"} rounded-lg outline-none`}
            />
            {errors.date && (
              <p className="text-red-500 text-[10px] absolute mt-0.5 whitespace-nowrap -left-full">
                {errors.date}
              </p>
            )}
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
