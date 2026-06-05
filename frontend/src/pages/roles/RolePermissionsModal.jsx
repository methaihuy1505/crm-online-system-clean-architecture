import React from "react";
import { X, ChevronDown, ChevronRight } from "lucide-react";

const Section = ({ title, items, permissions, onToggle }) => {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="mb-4">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between bg-blue-600 text-white px-3 py-2 rounded-md">
        <div className="font-medium">{title}</div>
        <div>{open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</div>
      </button>

      {open && (
        <div className="mt-2 bg-white dark:bg-slate-900 border rounded-md">
          {items.map((it, idx) => (
            <div key={it.key} className={`grid grid-cols-[1fr_auto_auto:auto:auto] items-center gap-3 px-4 py-3 ${idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800' : ''}`}>
              <div className="text-sm">{it.label}</div>
              {['view','create','update','delete'].map((p) => (
                <div key={p} className="text-center">
                  <input
                    type="checkbox"
                    checked={!!(permissions[it.key] && permissions[it.key][p])}
                    onChange={() => onToggle(it.key, p)}
                    className="w-4 h-4"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RolePermissionsModal = ({ open, onClose, role }) => {
  const [permissions, setPermissions] = React.useState({});

  React.useEffect(() => {
    if (open) {
      setPermissions({
        dashboard: { view: true },
        leads: { view: true },
        customers_list: { view: true, create: true, update: true, delete: false },
        campaigns: { view: false }
      });
    }
  }, [open]);

  const sections = [
    {
      title: 'Dashboard',
      items: [ { key: 'dashboard', label: 'Dashboard' } ]
    },
    {
      title: 'Khách hàng tiềm năng',
      items: [ { key: 'leads', label: 'Danh sách KHTN' }, { key: 'lead_status', label: 'Trạng thái KHTN' } ]
    },
    {
      title: 'Khách hàng',
      items: [ { key: 'customers_list', label: 'Danh sách khách hàng' }, { key: 'customers_b2b', label: 'Khách hàng B2B' } ]
    }
  ];

  const onToggle = (key, perm) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [perm]: !((prev[key] || {})[perm]) }
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 rounded-lg w-[900px] max-w-[98%] p-6 shadow-lg z-10">
        <div className="flex justify-between items-start mb-4 gap-4">
          <div>
            <h2 className="text-2xl font-bold">Phân quyền: {role?.name || 'UNKNOWN'}</h2>
            <p className="text-sm text-slate-500">Chỉnh sửa quyền truy cập cho các module. Tích chọn View/Create/Update/Delete theo hàng.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[64vh] pr-2">
          <div className="grid grid-cols-[1fr_auto_auto:auto:auto] gap-4 items-center mb-2 px-2 text-sm font-medium text-slate-600">
            <div>Menu</div>
            <div className="text-center">View</div>
            <div className="text-center">Create</div>
            <div className="text-center">Update</div>
            <div className="text-center">Delete</div>
          </div>

          {sections.map((s) => (
            <Section key={s.title} title={s.title} items={s.items} permissions={permissions} onToggle={onToggle} />
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button className="px-4 py-2 rounded border" onClick={onClose}>Đóng</button>
          <button className="px-4 py-2 bg-primary text-white rounded">Lưu thay đổi</button>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionsModal;
