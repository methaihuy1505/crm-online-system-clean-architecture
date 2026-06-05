import React, { useState, useEffect } from "react";
import api from "../../../lib/api";
import Button from "../../../components/ui/Button";
import toast from "react-hot-toast";

const ContactFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  customer,
}) => {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    personalPhone: "",
    workPhone: "",
    birthday: "",
    isPrimary: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        jobTitle: initialData.jobTitle || "",
        email: initialData.personalEmail || initialData.email || "",
        personalPhone: initialData.personalPhone || "",
        workPhone: initialData.workPhone || "",
        birthday: initialData.birthday || "",
        isPrimary: initialData.isPrimary || false,
      });
      setErrors({});
    } else if (isOpen && !initialData) {
      setFormData({
        firstName: "",
        lastName: "",
        jobTitle: "",
        email: "",
        personalPhone: "",
        workPhone: "",
        birthday: "",
        isPrimary: false,
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

  // === HÀM BẮT PHÍM ENTER ===
  const handleEnterToNext = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const elements = Array.from(form.elements).filter(
        (el) =>
          el.tagName === "INPUT" ||
          el.tagName === "SELECT" ||
          el.tagName === "TEXTAREA",
      );
      const index = elements.indexOf(e.target);
      if (index > -1 && index < elements.length - 1) {
        elements[index + 1].focus();
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.lastName.trim())
      newErrors.lastName = "Họ đệm không được trống";
    if (!formData.firstName.trim())
      newErrors.firstName = "Tên không được trống";

    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Email sai định dạng";
    }
    if (formData.personalPhone && !phoneRegex.test(formData.personalPhone)) {
      newErrors.personalPhone = "SĐT không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Vui lòng sửa các lỗi trong form trước khi lưu.");
      return};
    

    // Tự động gán customerId từ Prop truyền vào
    const payload = {
      ...formData,
      customerId: customer.id,
      personalEmail: formData.email,
      birthday: formData.birthday || null,
    };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await api.put(
          `/contacts/${initialData.id}`,
          payload,
        );
      } else {
        await api.post("/contacts", payload);
      }
      onSuccess(); // Sẽ kích hoạt refreshTrigger ở CustomerPage
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi lưu liên hệ!";
      toast.error(errorMessage);
      console.error(error);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[101]"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-fade-in-up z-[102]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditMode ? "Sửa Liên hệ" : "Thêm Liên hệ mới"}
          </h2>
          <Button
            variant="iconOnly"
            icon="close"
            onClick={onClose}
            className="text-slate-400 hover:text-red-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form
            id="contactWizardForm"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl mb-4">
              <span className="material-symbols-outlined text-indigo-500">
                domain
              </span>
              <div>
                <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                  Trực thuộc Khách hàng
                </div>
                <div className="text-sm font-black text-indigo-900">
                  {customer.name}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Họ và đệm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onKeyDown={handleEnterToNext}
                  className={`w-full px-4 py-2 bg-slate-50 border ${errors.lastName ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 focus:ring-primary outline-none`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-[10px] mt-1 italic">
                    {errors.lastName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onKeyDown={handleEnterToNext}
                  className={`w-full px-4 py-2 bg-slate-50 border ${errors.firstName ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 focus:ring-primary outline-none`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-[10px] mt-1 italic">
                    {errors.firstName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Chức danh
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                onKeyDown={handleEnterToNext}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="flex items-center gap-2 mt-2 p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <input
                type="checkbox"
                id="isPrimary"
                name="isPrimary"
                checked={formData.isPrimary}
                onChange={handleChange}
                onKeyDown={handleEnterToNext}
                className="w-4 h-4 text-primary rounded cursor-pointer"
              />
              <label
                htmlFor="isPrimary"
                className="text-sm font-bold text-slate-700 cursor-pointer"
              >
                Đánh dấu làm <b>Người liên hệ chính</b>
              </label>
            </div>

            <hr className="border-slate-100" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  SĐT cá nhân
                </label>
                <input
                  type="text"
                  name="personalPhone"
                  value={formData.personalPhone}
                  onChange={handleChange}
                  onKeyDown={handleEnterToNext}
                  className={`w-full px-4 py-2 bg-slate-50 border ${errors.personalPhone ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 focus:ring-primary outline-none`}
                />
                {errors.personalPhone && (
                  <p className="text-red-500 text-[10px] mt-1 italic">
                    {errors.personalPhone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  SĐT cơ quan
                </label>
                <input
                  type="text"
                  name="workPhone"
                  value={formData.workPhone}
                  onChange={handleChange}
                  onKeyDown={handleEnterToNext}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyDown={handleEnterToNext}
                  className={`w-full px-4 py-2 bg-slate-50 border ${errors.email ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 focus:ring-primary outline-none`}
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] mt-1 italic">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  onKeyDown={handleEnterToNext}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <Button
            variant="cancel"
            type="button"
            onClick={onClose}
            className="border bg-white"
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="contactWizardForm"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Lưu Liên hệ"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactFormModal;
