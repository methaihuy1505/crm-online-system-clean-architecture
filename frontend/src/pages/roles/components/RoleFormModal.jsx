import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const RoleFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const isEdit = Boolean(initialData);
  const [formData, setFormData] = useState({
    roleName: "",
    code: "",
    description: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          roleName: initialData.roleName || "",
          code: initialData.code || "",
          description: initialData.description || "",
        });
      } else {
        setFormData({ roleName: "", code: "", description: "" });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Tự động viết hoa Mã vai trò và loại bỏ khoảng trắng
    if (name === "code") {
      setFormData((prev) => ({ ...prev, [name]: value.toUpperCase().replace(/\s/g, '_') }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.roleName.trim() || !formData.code.trim()) return;
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col animate-slide-up overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-base font-bold text-slate-800">
            {isEdit ? "Cập nhật thông tin Vai trò" : "Tạo Vai trò mới"}
          </h2>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors outline-none">
            <X size={18} />
          </button>
        </div>

        <form id="roleForm" onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600">Tên vai trò <span className="text-red-500">*</span></label>
            <input
              required
              name="roleName"
              value={formData.roleName}
              onChange={handleChange}
              placeholder="VD: Quản lý chi nhánh..."
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600">Mã vai trò (Code) <span className="text-red-500">*</span></label>
            <input
              required
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="VD: BRANCH_MANAGER"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all uppercase"
            />
            <p className="text-[10px] text-slate-400 mt-1">Mã dùng để phân quyền dưới hệ thống (viết hoa, không dấu).</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600">Mô tả chi tiết</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Quyền hạn và nhiệm vụ của vai trò này..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            />
          </div>
        </form>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors outline-none">
            Hủy
          </button>
          <button type="submit" form="roleForm" className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all outline-none">
            {isEdit ? "Lưu thay đổi" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleFormModal;