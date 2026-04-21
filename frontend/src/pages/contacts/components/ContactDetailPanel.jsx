import React from "react";
import Button from "../../../components/ui/Button";

const ContactDetailPanel = ({ isOpen, onClose, contact, onEdit, onDelete }) => {
  if (!contact) return null;
  const fullName =
    contact.fullName ||
    `${contact.lastName || ""} ${contact.firstName || ""}`.trim();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[55] transition-opacity backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 w-[450px] h-full bg-surface-container-highest/95 backdrop-blur-2xl shadow-2xl z-[60] transition-transform duration-500 ease-in-out border-l border-white/20 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 h-full flex flex-col overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="iconOnly"
              icon="close"
              onClick={onClose}
              className="text-slate-400 hover:text-red-500"
            />
            <div className="flex space-x-2">
              <Button
                variant="cancel"
                className="bg-white text-primary text-xs !py-2 !px-4"
                onClick={() => {
                  onClose();
                  onEdit(contact);
                }}
              >
                Sửa hồ sơ
              </Button>
              <Button
                variant="danger"
                className="text-xs !py-2 !px-4"
                onClick={() => {
                  onClose();
                  onDelete(contact.id, fullName);
                }}
              >
                Xóa
              </Button>
            </div>
          </div>

          <div className="text-center mb-10">
            <div className="w-24 h-24 mx-auto mb-4 rounded-3xl shadow-lg border-4 border-white flex items-center justify-center text-4xl font-black bg-indigo-50 text-indigo-600 uppercase">
              {contact.firstName ? contact.firstName.charAt(0) : "U"}
            </div>
            <h2 className="text-2xl font-headline font-extrabold text-primary">
              {fullName}
            </h2>
            <p className="text-on-surface-variant font-medium mt-1">
              {contact.jobTitle || "Chưa có chức danh"}
            </p>
            {contact.isPrimary && (
              <div className="mt-4 flex justify-center">
                <span className="px-3 py-1 bg-secondary text-white text-[10px] font-bold rounded-full">
                  Người liên hệ chính
                </span>
              </div>
            )}
          </div>

          <div className="space-y-8 flex-1">
            <section>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
                Thông tin Công ty
              </h4>
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                <div className="w-10 h-10 bg-surface-container-low rounded-lg flex items-center justify-center mr-4">
                  <span className="material-symbols-outlined text-primary">
                    corporate_fare
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-primary leading-tight mb-1">
                    {contact.customerName || "Chưa gắn công ty"}
                  </p>
                  <p className="text-[10px] text-on-surface-variant leading-none">
                    Khách hàng Đối tác
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
                Liên hệ chi tiết
              </h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="material-symbols-outlined text-slate-400 mt-0.5 mr-4">
                    alternate_email
                  </span>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                      Email
                    </p>
                    <p className="text-sm font-medium text-primary break-all">
                      {contact.email || "---"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="material-symbols-outlined text-slate-400 mt-0.5 mr-4">
                    smartphone
                  </span>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                      Điện thoại cá nhân
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {contact.personalPhone || "---"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="material-symbols-outlined text-slate-400 mt-0.5 mr-4">
                    call
                  </span>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                      Điện thoại cơ quan
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {contact.workPhone || "---"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="material-symbols-outlined text-slate-400 mt-0.5 mr-4">
                    cake
                  </span>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                      Ngày sinh
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {contact.birthday || "---"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactDetailPanel;
