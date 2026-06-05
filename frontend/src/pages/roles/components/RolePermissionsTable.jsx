import React from "react";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  CheckSquare,
  Activity,
  Megaphone,
  Package,
  Briefcase,
  Building2,
  ShieldCheck,
  Database,
  Save,
  Loader2,
} from "lucide-react";

// Map module code → icon
const MODULE_ICONS = {
  dashboard: LayoutDashboard,
  customers: Users,
  leads: TrendingUp,
  tasks: CheckSquare,
  activities: Activity,
  campaigns: Megaphone,
  products: Package,
  opportunities: Briefcase,
  organization: Building2,
  roles: ShieldCheck,
  metadata: Database,
};

// Human-friendly action labels (action value from DB)
const ACTION_LABELS = {
  view: "Xem",
  create: "Tạo",
  update: "Sửa",
  delete: "Xóa",
  manage: "Quản lý",
  convert: "Chuyển đổi",
  advanced_search: "Tìm nâng cao",
  statistics: "Thống kê",
  options: "Tuỳ chọn",
  search: "Tìm kiếm",
  upload_image: "Upload ảnh",
  replace_image: "Thay ảnh",
  delete_image: "Xóa ảnh",
  change_password: "Đổi MK",
  view_contact: "Xem liên hệ",
  create_contact: "Tạo liên hệ",
  update_contact: "Sửa liên hệ",
  delete_contact: "Xóa liên hệ",
  view_note: "Xem ghi chú",
  create_note: "Tạo ghi chú",
  update_note: "Sửa ghi chú",
  delete_note: "Xóa ghi chú",
  view_item: "Xem item",
  create_item: "Tạo item",
  update_item: "Sửa item",
  delete_item: "Xóa item",
  view_user: "Xem user",
  create_user: "Tạo user",
  update_user: "Sửa user",
  delete_user: "Xóa user",
  view_team: "Xem team",
  create_team: "Tạo team",
  update_team: "Sửa team",
  delete_team: "Xóa team",
  view_branch: "Xem chi nhánh",
  create_branch: "Tạo chi nhánh",
  update_branch: "Sửa chi nhánh",
  delete_branch: "Xóa chi nhánh",
};

const actionLabel = (action) => ACTION_LABELS[action] ?? action;

/**
 * Props:
 *  modules       – [{ id, code, name, permissions: [{ id, action, code, name }] }]
 *  checkedIds    – Set<number>  (permission IDs that are enabled)
 *  onTogglePermission(permissionId)
 *  onToggleModule(modulePermissions, nextValue)
 *  onSave()
 *  saving        – boolean
 */
const RolePermissionsTable = ({
  modules,
  checkedIds,
  onTogglePermission,
  onToggleModule,
  onSave,
  saving,
}) => {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-slate-200/70 bg-slate-50 px-6 py-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
          Mô đun & Quyền hạn
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#1A237E] px-4 text-xs font-semibold text-white shadow shadow-[#1A237E]/20 transition hover:bg-[#121a63] disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>

      {/* ── Rows ── */}
      <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-100">
        {modules.map((module) => {
          const Icon = MODULE_ICONS[module.code] ?? ShieldCheck;
          const perms = module.permissions ?? [];
          const checkedCount = perms.filter((p) => checkedIds.has(p.id)).length;
          const allChecked = perms.length > 0 && checkedCount === perms.length;
          const someChecked = checkedCount > 0 && !allChecked;

          return (
            <div key={module.id} className="px-6 py-5 transition hover:bg-slate-50/60">
              {/* Module title row */}
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef1ff] text-[#1A237E]">
                  <Icon size={18} />
                </div>

                <button
                  type="button"
                  onClick={() => onToggleModule(perms, !allChecked)}
                  className="group flex min-w-0 items-center gap-2 text-left"
                  title={allChecked ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                >
                  {/* Master checkbox visual */}
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition
                      ${allChecked
                        ? "border-[#1A237E] bg-[#1A237E] text-white"
                        : someChecked
                        ? "border-[#1A237E] bg-[#eef1ff] text-[#1A237E]"
                        : "border-slate-300 bg-white"
                      }`}
                  >
                    {allChecked && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {someChecked && !allChecked && (
                      <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
                        <path d="M1 1H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </span>

                  <span className="text-sm font-semibold text-slate-900">{module.name}</span>
                  <span className="text-xs text-slate-400">
                    {checkedCount}/{perms.length}
                  </span>
                </button>
              </div>

              {/* Permission chips */}
              {perms.length > 0 && (
                <div className="ml-12 flex flex-wrap gap-2">
                  {perms.map((perm) => {
                    const checked = checkedIds.has(perm.id);
                    return (
                      <button
                        key={perm.id}
                        type="button"
                        onClick={() => onTogglePermission(perm.id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition
                          ${checked
                            ? "border-[#1A237E] bg-[#1A237E] text-white shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white hover:text-slate-700"
                          }`}
                      >
                        {checked && (
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                            <path d="M1 3.5L3 5.5L8 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {actionLabel(perm.action)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {modules.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-400">
            Không có module nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default RolePermissionsTable;