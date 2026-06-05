import React, { useEffect } from "react";
import { X } from "lucide-react";

const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingUser,
  form,
  setForm,
  roleOptions,
  branchOptions,
  teamOptions,
  currentUserId,
}) => {
  // Flag kiểm tra xem có phải đang sửa chính mình không
  const isSelfEdit = editingUser && editingUser.id === currentUserId;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-slate-800">
            {editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors" type="button">
            <X size={20} strokeWidth={2.5} className="text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4">Thông tin tài khoản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-600 font-semibold mb-1.5">Username <span className="text-red-500">*</span></label>
                <input
                  type="text" value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  disabled={!!editingUser}
                  placeholder="Nhập username"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 font-semibold mb-1.5">Password {editingUser ? "" : <span className="text-red-500">*</span>}</label>
                <input
                  type="password" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={editingUser ? "Để trống nếu không đổi" : "Nhập mật khẩu"}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4">Thông tin hồ sơ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-600 font-semibold mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                <input
                  type="text" value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Nhập họ và tên"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 font-semibold mb-1.5">Email <span className="text-red-500">*</span></label>
                <input
                  type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Nhập email"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 font-semibold mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                <input
                  type="tel" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 font-semibold mb-1.5">Trạng thái</label>
                <select
                  disabled={isSelfEdit} // KHÓA ĐỔI TRẠNG THÁI CHÍNH MÌNH
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="ACTIVE">Đang hoạt động</option>
                  <option value="INACTIVE">Ngưng hoạt động</option>
                </select>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4">Phân quyền và đơn vị</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-600 font-semibold mb-1.5">Vai trò <span className="text-red-500">*</span></label>
                <select
                  required
                  disabled={isSelfEdit} // KHÓA ĐỔI ROLE CHÍNH MÌNH
                  value={form.roleId}
                  onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Chọn vai trò</option>
                  {roleOptions.map((role) => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 font-semibold mb-1.5">Chi nhánh</label>
                <select
                  value={form.branchId}
                  onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">Không gán chi nhánh</option>
                  {branchOptions.map((branch) => (
                    <option key={branch.id} value={branch.id}>{branch.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 font-semibold mb-1.5">Nhóm</label>
                <select
                  value={form.teamId}
                  onChange={(e) => setForm({ ...form, teamId: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">Không gán nhóm</option>
                  {teamOptions.map((team) => (
                    <option key={team.id} value={team.id}>{team.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {isSelfEdit ? (
              <p className="mt-4 text-xs font-medium text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                * Bạn đang chỉnh sửa tài khoản của chính mình. Vì lý do bảo mật, bạn không thể tự thay đổi <b>Vai trò</b> và <b>Trạng thái</b> của bản thân để tránh mất quyền truy cập.
              </p>
            ) : (
              <p className="mt-3 text-xs text-slate-500 italic">
                Chi nhánh và Nhóm có thể bỏ trống, hệ thống sẽ gửi giá trị NULL.
              </p>
            )}
          </section>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 sticky bottom-0 bg-white rounded-b-2xl">
          <button className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors" onClick={onClose} type="button">Hủy</button>
          <button className="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors" onClick={onSubmit} type="button">
            {editingUser ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;