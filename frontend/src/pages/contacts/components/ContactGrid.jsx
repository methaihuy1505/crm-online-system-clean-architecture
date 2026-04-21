import React from "react";
import Button from "../../../components/ui/Button";

const ContactGrid = ({ contacts, onOpenDetail, onEdit, onDelete }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {contacts.map((contact) => {
          const fullName =
            contact.fullName ||
            `${contact.lastName || ""} ${contact.firstName || ""}`.trim();
          return (
            <div
              key={contact.id}
              className="bg-surface-container-lowest rounded-xl p-6 group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden"
            >
              {/* ĐÃ ĐỒNG BỘ NÚT BUTTON VÀ GẮN SỰ KIỆN */}
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <Button
                  variant="iconOnly"
                  icon="edit"
                  title="Chỉnh sửa"
                  className="hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(contact);
                  }}
                />
                <Button
                  variant="iconOnly"
                  icon="delete"
                  title="Xóa"
                  className="hover:bg-red-50 text-slate-400 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(contact.id, fullName);
                  }}
                />
              </div>

              <div
                className="flex items-start mb-6 cursor-pointer"
                onClick={() => onOpenDetail(contact)}
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold bg-indigo-50 text-indigo-600 uppercase">
                    {contact.firstName ? contact.firstName.charAt(0) : "U"}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <h3 className="text-lg font-headline font-extrabold text-primary leading-tight break-all">
                      {fullName}
                    </h3>
                    {contact.isPrimary && (
                      <span className="px-2 py-0.5 bg-secondary/15 text-on-secondary-container text-[10px] font-bold rounded-full flex items-center shrink-0">
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-1"></span>{" "}
                        CHÍNH
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium mt-0.5">
                    {contact.jobTitle || "Chưa cập nhật chức danh"}
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-2 line-clamp-1">
                    {contact.customerName || "Chưa gắn công ty"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex items-center text-sm text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-slate-400 mr-3 text-lg">
                    mail
                  </span>
                  <span className="truncate">
                    {contact.personalEmail || contact.email || "---"}
                  </span>
                </div>
                <div className="flex items-center text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-slate-400 mr-3 text-lg">
                    call
                  </span>
                  <span>
                    {contact.personalPhone || contact.workPhone || "---"}
                  </span>
                </div>
                <div className="flex items-center text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-slate-400 mr-3 text-lg">
                    cake
                  </span>
                  <span>{contact.birthday || "---"}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end">
                <button
                  onClick={() => onOpenDetail(contact)}
                  className="text-[11px] font-bold text-primary uppercase tracking-widest hover:underline cursor-pointer"
                >
                  Chi tiết
                </button>
              </div>
            </div>
          );
        })}

        {/* Nút Thêm Liên hệ mới (Card trống) */}
        <div
          onClick={() => onEdit(null)} // Click vào đây cũng sẽ mở modal thêm mới
          className="bg-surface-container-low border-2 border-dashed border-outline-variant/30 rounded-xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/40 transition-all min-h-[250px]"
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary mb-4 shadow-sm group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">add_circle</span>
          </div>
          <h4 className="text-sm font-bold text-primary">Thêm Liên hệ mới</h4>
        </div>
      </div>
    </>
  );
};

export default ContactGrid;
