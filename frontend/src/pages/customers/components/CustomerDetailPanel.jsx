import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../../components/ui/Button";

const CustomerDetailPanel = ({
  isOpen,
  onClose,
  customer,
  onEdit,
  onOpenAddContact,
  onOpenEditContact,
  refreshTrigger,
}) => {
  const [contacts, setContacts] = useState([]);

  // Fetch TOÀN BỘ Liên hệ của Customer này thay vì chỉ lấy người Primary
  useEffect(() => {
    if (isOpen && customer?.id) {
      axios
        .get(`http://localhost:8080/api/v1/contacts/customer/${customer.id}`)
        .then((res) => {
          // Sắp xếp người liên hệ chính (isPrimary) lên đầu tiên
          const sortedContacts = res.data.sort(
            (a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0),
          );
          setContacts(sortedContacts);
        })
        .catch((err) => console.error("Lỗi tải thông tin người liên hệ:", err));
    }
  }, [isOpen, customer, refreshTrigger]);

  const handleDeleteContact = async (id, name) => {
    if (window.confirm(`Xóa liên hệ "${name}"?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/contacts/${id}`);
        setContacts((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!customer) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[55] transition-opacity backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed right-0 top-0 h-full w-[450px] bg-surface-container-highest shadow-2xl transition-transform duration-500 ease-in-out border-l border-white/20 backdrop-blur-3xl z-[60] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-50">
              Chi tiết đối tác
            </span>
            <Button
              variant="iconOnly"
              icon="close"
              onClick={onClose}
              className="text-slate-400 hover:text-primary"
            />
          </div>

          <div className="mb-6">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black mb-4 ${customer.isOrganization ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-700"}`}
            >
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-1">
              {customer.name}
            </h2>
            <p className="text-slate-500 font-medium text-xs">
              {customer.addressCompany ||
                customer.addressBilling ||
                "Chưa cập nhật địa chỉ"}
            </p>
          </div>

          <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10">
            <section>
              <h3 className="text-[11px] font-black uppercase tracking-tighter text-slate-400 mb-3 border-b pb-1">
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    Mã khách hàng
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    {customer.customerCode}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    {customer.isOrganization ? "Mã số thuế" : "Số CCCD/CMND"}
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    {customer.taxCode || customer.citizenId || "---"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    Điện thoại
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    {customer.mainPhone || "---"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    Email
                  </div>
                  <div className="text-xs font-medium text-primary cursor-pointer hover:underline truncate">
                    {customer.emailOfficial || "---"}
                  </div>
                </div>
              </div>
            </section>

            {/* KHU VỰC QUẢN LÝ CONTACT WIZARD TRỰC TIẾP */}
            <section>
              <div className="flex justify-between items-center mb-3 border-b pb-1">
                <h3 className="text-[11px] font-black uppercase tracking-tighter text-slate-400">
                  Danh sách Liên hệ ({contacts.length})
                </h3>
                <button
                  onClick={onOpenAddContact}
                  className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-1 rounded hover:bg-primary/20 transition-colors flex items-center"
                >
                  <span className="material-symbols-outlined text-[12px] mr-1">
                    add
                  </span>{" "}
                  Thêm mới
                </button>
              </div>

              <div className="space-y-3">
                {contacts.length === 0 ? (
                  <div className="text-xs text-slate-400 italic text-center p-4 bg-slate-50 border border-dashed rounded-lg">
                    Chưa có người liên hệ. Hãy thêm mới.
                  </div>
                ) : (
                  contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-3 rounded-xl border ${contact.isPrimary ? "bg-indigo-50/30 border-indigo-200" : "bg-white border-slate-100 shadow-sm"} relative group`}
                    >
                      {/* Nút thao tác ẩn hiện khi hover */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onOpenEditContact(contact)}
                          className="w-6 h-6 flex items-center justify-center bg-white border shadow-sm rounded text-slate-400 hover:text-blue-600"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteContact(contact.id, contact.fullName)
                          }
                          className="w-6 h-6 flex items-center justify-center bg-white border shadow-sm rounded text-slate-400 hover:text-red-600"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            delete
                          </span>
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${contact.isPrimary ? "bg-indigo-500" : "bg-slate-400"}`}
                        >
                          {contact.firstName?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-bold text-slate-900 truncate">
                              {contact.fullName}
                            </div>
                            {contact.isPrimary && (
                              <span className="text-[8px] bg-indigo-500 text-white px-1.5 py-0.5 rounded uppercase font-black tracking-widest shrink-0">
                                Chính
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {contact.jobTitle || "Nhân viên"} •{" "}
                            {contact.personalPhone || "Chưa có SĐT"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 bg-surface-container-highest">
            <Button
              variant="cancel"
              className="border border-slate-200 bg-white"
              onClick={() => onEdit(customer)}
            >
              Sửa khách hàng
            </Button>
            <Button variant="primary">Tạo cơ hội (Deal)</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDetailPanel;
