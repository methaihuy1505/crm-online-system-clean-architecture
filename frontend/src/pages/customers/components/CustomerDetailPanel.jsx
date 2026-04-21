import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../../components/ui/Button";

const CustomerDetailPanel = ({ isOpen, onClose, customer, onEdit }) => {
  const [primaryContact, setPrimaryContact] = useState(null);
  const [prevCustomerId, setPrevCustomerId] = useState(null);

  if (customer?.id !== prevCustomerId) {
    setPrevCustomerId(customer?.id);
    setPrimaryContact(null);
  }

  // Mỗi khi mở panel và có customer, tự động đi tìm Người liên hệ chính
  useEffect(() => {
    if (isOpen && customer?.id) {
      axios
        .get(`http://localhost:8080/api/v1/contacts/customer/${customer.id}`)
        .then((res) => {
          const contacts = res.data;
          // Tìm người có isPrimary = true
          const main = contacts.find((c) => c.isPrimary);
          setPrimaryContact(main || null);
        })
        .catch((err) => console.error("Lỗi tải thông tin người liên hệ:", err));
    }
  }, [isOpen, customer]);

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
        className={`fixed right-0 top-0 h-full w-[400px] bg-surface-container-highest shadow-2xl transition-transform duration-500 ease-in-out border-l border-white/20 backdrop-blur-3xl z-[60] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-50">
              Chi tiết đối tác
            </span>
            <Button
              variant="iconOnly"
              icon="close"
              onClick={onClose}
              className="text-slate-400 hover:text-primary transition-colors"
            />
          </div>

          <div className="mb-8">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black mb-4 ${customer.isOrganization ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-700"}`}
            >
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
              {customer.name}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {customer.addressCompany ||
                customer.addressBilling ||
                "Chưa cập nhật địa chỉ"}
            </p>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <section>
              <h3 className="text-[11px] font-black uppercase tracking-tighter text-slate-400 mb-3">
                Thôngובה cơ bản
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    Mã khách hàng
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    {customer.customerCode}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    {customer.isOrganization ? "Mã số thuế" : "Số CCCD/CMND"}
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    {customer.taxCode || customer.citizenId || "---"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    Ngày thành lập / Ngày sinh
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    {customer.foundedDate || "---"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    Email & Website
                  </div>
                  <div className="text-sm font-medium text-primary cursor-pointer hover:underline">
                    {customer.emailOfficial || "---"}
                  </div>
                  <div className="text-sm font-medium text-primary cursor-pointer hover:underline">
                    {customer.website || "---"}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-3 bg-surface-container-lowest rounded-lg border border-slate-100">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">
                      Nguồn khách
                    </div>
                    <div className="text-sm font-semibold text-slate-800">
                      {customer.sourceId
                        ? `Nguồn ID: ${customer.sourceId}`
                        : "Tự nhiên"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">
                      Chiến dịch
                    </div>
                    <div className="text-sm font-semibold text-slate-800">
                      {customer.campaignId
                        ? `Chiến dịch ID: ${customer.campaignId}`
                        : "Không có"}
                    </div>
                  </div>
                </div>
            </section>

            <section>
              <h3 className="text-[11px] font-black uppercase tracking-tighter text-slate-400 mb-3">
                Liên hệ chính
              </h3>
              {primaryContact ? (
                <div className="bg-white/50 p-4 rounded-xl border border-white/50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold">
                    {primaryContact.firstName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {primaryContact.fullName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {primaryContact.jobTitle || "Liên hệ cá nhân"}
                    </div>
                    <div className="text-[10px] text-primary font-bold mt-1">
                      {primaryContact.personalPhone}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">
                  Chưa có người liên hệ chính.
                </div>
              )}
            </section>

            <section>
              <h3 className="text-[11px] font-black uppercase tracking-tighter text-slate-400 mb-3">
                Lịch sử giao dịch
              </h3>
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                <span className="material-symbols-outlined text-slate-300 text-3xl mb-2">
                  history
                </span>
                <div className="text-xs text-slate-400">
                  Không có giao dịch gần đây
                </div>
              </div>
            </section>
            
          </div>

          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-4">
            <Button
              variant="cancel"
              className="border border-slate-200 bg-white"
              onClick={() => onEdit(customer)}
            >
              Chỉnh sửa
            </Button>

            <Button variant="primary">Gửi tin nhắn</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDetailPanel;
