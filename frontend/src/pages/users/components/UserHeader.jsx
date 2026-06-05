import React from "react";
import { Plus, Users } from "lucide-react";

const UserHeader = ({ onOpenAdd, canCreate }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">
            Quản lý người dùng
          </h2>
          <p className="text-on-surface-variant mt-1">
            Quản lý tài khoản nội bộ, vai trò và phạm vi truy cập trong hệ thống.
          </p>
        </div>
        
        {/* CHỈ HIỂN THỊ NÚT NẾU CÓ QUYỀN */}
        {canCreate && (
          <button
            className="bg-gradient-to-br from-[#000666] to-[#1A237E] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-primary/20 transition-all active:scale-95 outline-none"
            onClick={onOpenAdd}
            type="button"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Thêm người dùng (Alt+N)</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default UserHeader;