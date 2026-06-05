import React from "react";
import { ChevronRight, UserRoundCog, Edit, Trash2 } from "lucide-react";

const RoleSidebar = ({ roles, selectedRoleId, onSelectRole, onEditRole, onDeleteRole }) => {
  return (
    <aside className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
        Danh sách vai trò
      </p>

      <div className="space-y-3">
        {roles.length === 0 && (
          <p className="text-sm text-slate-400">Không tìm thấy vai trò nào.</p>
        )}

        {roles.map((role) => {
          const active = selectedRoleId === role.id;

          return (
            <div
              key={role.id}
              onClick={() => onSelectRole(role)}
              className={`group w-full rounded-[20px] border px-4 py-4 text-left transition cursor-pointer relative ${
                active
                  ? "border-[#1A237E] bg-[#eef1ff] shadow-[0_0_0_1px_rgba(26,35,126,0.12)]"
                  : "border-slate-100 bg-slate-50/80 hover:border-slate-200 hover:bg-white"
              }`}
            >
              {/* CÁC NÚT THAO TÁC (Chỉ hiện khi rê chuột) */}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEditRole(role); }} 
                  className="p-1.5 bg-white border border-slate-200 shadow-sm rounded-lg text-slate-400 hover:text-blue-600 outline-none"
                  title="Sửa thông tin cơ bản"
                >
                  <Edit size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteRole(role); }} 
                  className="p-1.5 bg-white border border-slate-200 shadow-sm rounded-lg text-slate-400 hover:text-red-600 outline-none"
                  title="Xóa vai trò"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="flex items-start justify-between gap-2 pr-12">
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-slate-950">
                    {role.roleName}
                  </div>
                  <div className="mt-0.5 text-xs leading-4 text-slate-500">
                    {role.description || <span className="italic opacity-50">Không có mô tả</span>}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold text-[#1A237E] ring-1 ring-[#1A237E]/15">
                  <UserRoundCog size={10} />
                  {role.code}
                </div>
                {active && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1A237E] text-white">
                    <ChevronRight size={12} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default RoleSidebar;