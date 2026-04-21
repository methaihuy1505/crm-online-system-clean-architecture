import React from "react";
import Button from "../../../components/ui/Button";

const CustomerTable = ({
  customers,
  isLoading,
  onOpenDetail,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Đang tải dữ liệu khách hàng...
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                Khách hàng
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                Mã / Căn cước / MST
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                Liên hệ chính
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  Chưa có khách hàng nào trong hệ thống.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-surface-container-low transition-colors group cursor-pointer"
                  onClick={() => onOpenDetail(customer)}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg
                        ${customer.isOrganization ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-600"}`}
                      >
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {customer.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {customer.isOrganization
                            ? "Tổ chức (B2B)"
                            : "Cá nhân (B2C)"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-medium text-slate-700">
                      {customer.customerCode}
                    </div>
                    <div className="text-xs text-slate-400">
                      {customer.isOrganization
                        ? `MST: ${customer.taxCode || "---"}`
                        : `CCCD: ${customer.citizenId || "---"}`}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-slate-700">
                      {customer.emailOfficial || "Chưa có Email"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {customer.mainPhone || "Chưa có SĐT"}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{" "}
                        {customer.statusName || "Đang chăm sóc"}
                      </span>
                      {customer.rankName && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter bg-amber-100 text-amber-700">
                          <span
                            className="material-symbols-outlined text-[12px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            workspace_premium
                          </span>
                          {customer.rankName}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* THAY THẾ BẰNG COMPONENT BUTTON */}
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="iconOnly"
                        icon="visibility"
                        className="text-slate-500 hover:text-primary hover:bg-slate-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDetail(customer);
                        }}
                        title="Xem chi tiết"
                      />
                      <Button
                        variant="iconOnly"
                        icon="edit"
                        className="text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(customer);
                        }}
                        title="Chỉnh sửa"
                      />
                      <Button
                        variant="iconOnly"
                        icon="delete"
                        className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(customer.id, customer.name);
                        }}
                        title="Xóa"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
        <div className="text-xs font-medium text-slate-500">
          Hiển thị {customers.length} khách hàng
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
