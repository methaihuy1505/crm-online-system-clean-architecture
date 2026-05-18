import React from "react";

const STATUS_STYLE = {
  ACTIVE: "bg-blue-100 text-blue-700",
  INACTIVE: "bg-slate-200 text-slate-600",
};

const STATUS_LABEL = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngưng hoạt động",
};

export default function UserTable({
  users,
  filteredUsers,
  onEdit,
  onDelete,
  formatUserCode,
  formatJoinedDate,
  getInitials,
}) {
  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden border border-surface-variant/30">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[920px] text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-surface-variant/60">
              <th className="px-4 py-3 text-left">Mã</th>
              <th className="px-4 py-3 text-left">Thông tin người dùng</th>
              <th className="px-4 py-3 text-left">Vai trò</th>
              <th className="px-4 py-3 text-left">Đơn vị</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-left">Ngày tham gia</th>
              <th className="px-4 py-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-b border-surface-variant/40 last:border-none">
                <td className="px-4 py-4 text-on-surface-variant font-medium">{formatUserCode(u.id)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold grid place-items-center">
                      {getInitials(u.full_name)}
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">{u.full_name || "-"}</p>
                      <p className="text-xs text-on-surface-variant">{u.email || u.username || "-"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center rounded-md bg-surface-container-high px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
                    {u.role?.role_name || "N/A"}
                  </span>
                </td>
                <td className="px-4 py-4 text-on-surface font-medium">-</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${
                      STATUS_STYLE[u.status] || "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {STATUS_LABEL[u.status] || u.status || "Không xác định"}
                  </span>
                </td>
                <td className="px-4 py-4 text-on-surface">{formatJoinedDate(u.created_at)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(u.id)}
                      className="w-8 h-8 rounded-md hover:bg-surface-container-high text-on-surface-variant"
                      title="Sửa người dùng"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(u.id)}
                      className="w-8 h-8 rounded-md hover:bg-red-100 text-on-surface-variant hover:text-error"
                      title="Xóa người dùng"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-on-surface-variant">
                  Không có người dùng phù hợp với bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-surface-variant/50">
        <span className="text-sm text-on-surface-variant">
          Hiển thị {filteredUsers.length === 0 ? 0 : 1}-{filteredUsers.length} trên tổng {users.length} người dùng
        </span>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-md border border-surface-variant/80 bg-surface-container-lowest text-on-surface-variant" type="button">
            &lt;
          </button>
          <button className="w-8 h-8 rounded-md bg-primary text-white font-semibold" type="button">
            1
          </button>
          <button className="w-8 h-8 rounded-md border border-surface-variant/80 bg-surface-container-lowest text-on-surface" type="button">
            2
          </button>
          <button className="w-8 h-8 rounded-md border border-surface-variant/80 bg-surface-container-lowest text-on-surface" type="button">
            3
          </button>
          <span className="px-1 text-on-surface-variant">...</span>
          <button className="px-2 h-8 rounded-md border border-surface-variant/80 bg-surface-container-lowest text-on-surface" type="button">
            128
          </button>
          <button className="w-8 h-8 rounded-md border border-surface-variant/80 bg-surface-container-lowest text-on-surface-variant" type="button">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
