import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../../components/ui/Button";

const ContactFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  customers,
}) => {
  const isEditMode = !!initialData;

  const [step, setStep] = useState(1);
  const [searchCustomer, setSearchCustomer] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    customerId: "",
    email: "",
    personalPhone: "",
    workPhone: "",
    birthday: "", // Đổi thành birthday
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
        customerId: initialData.customerId || "",
        email: initialData.personalEmail || initialData.email || "", // Dự phòng BE trả về personalEmail
        personalPhone: initialData.personalPhone || "",
        workPhone: initialData.workPhone || "",
        birthday: initialData.birthday || "", // Đổi thành birthday
        isPrimary: initialData.isPrimary || false,
      });
      setErrors({});
      setStep(2);
    } else if (isOpen && !initialData) {
      setFormData({
        firstName: "",
        lastName: "",
        jobTitle: "",
        customerId: "",
        email: "",
        personalPhone: "",
        workPhone: "",
        birthday: "",
        isPrimary: false,
      });
      setErrors({});
      setStep(1);
      setSearchCustomer("");
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

    if (!formData.lastName.trim())
      newErrors.lastName = "Họ và đệm không được để trống";
    if (!formData.firstName.trim())
      newErrors.firstName = "Tên không được để trống";
    if (!formData.customerId)
      newErrors.customerId = "Vui lòng chọn Công ty / Khách hàng";

    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng";
    }
    if (formData.personalPhone && !phoneRegex.test(formData.personalPhone)) {
      newErrors.personalPhone = "SĐT không hợp lệ";
    }
    if (formData.workPhone && !phoneRegex.test(formData.workPhone)) {
      newErrors.workPhone = "SĐT không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // TẠO BẢN SAO PAYLOAD: Ép chuỗi rỗng thành null
    // Đổi chữ personalEmail cho khớp với DTO Request Backend nếu cần
    const payload = {
      ...formData,
      personalEmail: formData.email, // Map từ ô input email sang personalEmail của BE
    };

    if (!payload.birthday) {
      payload.birthday = null; // Đổi thành birthday
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:8080/api/v1/contacts/${initialData.id}`,
          payload,
        );
        alert("Cập nhật Liên hệ thành công!");
      } else {
        await axios.post("http://localhost:8080/api/v1/contacts", payload);
        alert("Thêm mới Liên hệ thành công!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi lưu dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tính toán list KH
  const filteredCustomers = customers.filter((c) => {
    if (!searchCustomer) return true;
    return (
      c.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      (c.customerCode &&
        c.customerCode.toLowerCase().includes(searchCustomer.toLowerCase()))
    );
  });

  const selectedCustomerName =
    customers.find((c) => c.id.toString() === formData.customerId?.toString())
      ?.name || "";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[101]"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up z-[102]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditMode ? "Chỉnh sửa Liên hệ" : "Thêm Liên hệ mới"}
          </h2>
          <Button
            variant="iconOnly"
            icon="close"
            onClick={onClose}
            className="text-slate-400 hover:text-red-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-3xl">
                    domain
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-800">
                  Bước 1: Chọn Khách hàng trực thuộc
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Liên hệ này thuộc về công ty hoặc khách hàng cá nhân nào?
                </p>
              </div>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo Tên công ty hoặc Mã khách hàng..."
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="max-h-[300px] overflow-y-auto space-y-2 mt-4 custom-scrollbar pr-2">
                {filteredCustomers.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    Không tìm thấy khách hàng nào phù hợp.
                  </div>
                ) : (
                  filteredCustomers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, customerId: c.id }));
                        setErrors((prev) => ({ ...prev, customerId: "" }));
                        setStep(2);
                      }}
                      className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg bg-indigo-50 text-indigo-600">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                          {c.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {c.customerCode || "---"}
                        </div>
                      </div>
                      <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined">
                          arrow_forward
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <form
              id="contactForm"
              onSubmit={handleSubmit}
              className="space-y-6 animate-fade-in slide-in-from-right-4"
            >
              <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl shadow-lg mb-6">
                <div className="flex items-center gap-3 text-white">
                  <span className="material-symbols-outlined text-emerald-400">
                    check_circle
                  </span>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Khách hàng trực thuộc
                    </div>
                    <div className="text-sm font-black">
                      {selectedCustomerName}
                    </div>
                  </div>
                </div>
                {!isEditMode && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Thay đổi
                  </button>
                )}
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
                    className={`w-full px-4 py-2 bg-slate-50 border ${errors.lastName ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 focus:ring-primary outline-none`}
                    placeholder="VD: Nguyễn Văn"
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
                    className={`w-full px-4 py-2 bg-slate-50 border ${errors.firstName ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 focus:ring-primary outline-none`}
                    placeholder="VD: Hoàng"
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
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="VD: Giám đốc kinh doanh"
                />
              </div>

              <div className="flex items-center gap-2 mt-2 p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                <input
                  type="checkbox"
                  id="isPrimary"
                  name="isPrimary"
                  checked={formData.isPrimary}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                />
                <label
                  htmlFor="isPrimary"
                  className="text-sm font-bold text-indigo-900 cursor-pointer"
                >
                  Đánh dấu đây là <b>Người liên hệ chính</b> của tổ chức này
                </label>
              </div>

              <hr className="border-slate-100" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Điện thoại cá nhân
                  </label>
                  <input
                    type="text"
                    name="personalPhone"
                    value={formData.personalPhone}
                    onChange={handleChange}
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
                    Điện thoại cơ quan
                  </label>
                  <input
                    type="text"
                    name="workPhone"
                    value={formData.workPhone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-slate-50 border ${errors.workPhone ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 focus:ring-primary outline-none`}
                  />
                  {errors.workPhone && (
                    <p className="text-red-500 text-[10px] mt-1 italic">
                      {errors.workPhone}
                    </p>
                  )}
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
                  {/* Sử dụng field name="birthday" */}
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <Button
            variant="cancel"
            type="button"
            onClick={onClose}
            className="border bg-white"
          >
            Hủy bỏ
          </Button>

          {step === 2 && (
            <Button
              variant="primary"
              type="submit"
              form="contactForm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Lưu Liên hệ"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactFormModal;
