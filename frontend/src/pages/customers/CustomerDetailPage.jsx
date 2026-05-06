import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/ui/Button";
import CustomerFormModal from "./components/CustomerFormModal";
import ContactFormModal from "../contacts/components/ContactFormModal";

const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);

  const [statuses, setStatuses] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [sources, setSources] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  // === LẮNG NGHE PHÍM TẮT TRONG TRANG DETAIL ===
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isCustomerModalOpen && !isContactModalOpen) {
        e.preventDefault();
        navigate(-1);
      }
      if (
        e.altKey &&
        (e.code === "KeyE" || e.key.toLowerCase() === "e") &&
        !isCustomerModalOpen &&
        !isContactModalOpen
      ) {
        e.preventDefault();
        setIsCustomerModalOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCustomerModalOpen, isContactModalOpen, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [cusRes, contactRes, statRes, rankRes, srcRes, campRes] =
        await Promise.all([
          axios.get(`http://localhost:8080/api/v1/customers/${id}`),
          axios.get(`http://localhost:8080/api/v1/contacts/customer/${id}`),
          axios.get("http://localhost:8080/api/v1/customer-statuses"),
          axios.get("http://localhost:8080/api/v1/customer-ranks"),
          axios.get("http://localhost:8080/api/v1/sources"),
          axios.get("http://localhost:8080/api/v1/campaigns/options"),
        ]);

      setCustomer(cusRes.data);
      setContacts(
        contactRes.data.sort(
          (a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0),
        ),
      );
      setStatuses(statRes.data);
      setRanks(rankRes.data);
      setSources(srcRes.data);
      setCampaigns(campRes.data);
    } catch (err) {
      console.error("Lỗi tải chi tiết:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDeleteContact = async (contactId, name) => {
    if (window.confirm(`Xóa liên hệ "${name}"?`)) {
      try {
        await axios.delete(
          `http://localhost:8080/api/v1/contacts/${contactId}`,
        );
        setContacts((prev) => prev.filter((c) => c.id !== contactId));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleOpenAddContact = () => {
    setContactToEdit(null);
    setIsContactModalOpen(true);
  };
  const handleOpenEditContact = (contact) => {
    setContactToEdit(contact);
    setIsContactModalOpen(true);
  };

  if (isLoading)
    return (
      <div className="p-8 font-medium text-slate-500">Đang tải dữ liệu...</div>
    );
  if (!customer)
    return (
      <div className="p-8 font-medium text-red-500">
        Không tìm thấy khách hàng.
      </div>
    );

  return (
    <div className="space-y-6 flex-1">
      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-outline-variant/10">
        <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
          <div className="flex gap-4 items-center">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black ${customer.isOrganization ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-700"}`}
            >
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">
                {customer.name}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 font-medium">
                  {customer.isOrganization ? "Tổ chức (B2B)" : "Cá nhân (B2C)"}{" "}
                  • {customer.customerCode}
                </span>
                <span className="px-3 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-100 uppercase tracking-widest">
                  {customer.statusName || "Đang chăm sóc"}
                </span>
                {customer.rankName && (
                  <span className="px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100 uppercase tracking-widest">
                    {customer.rankName}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="cancel"
              icon="arrow_back"
              onClick={() => navigate(-1)}
              className="bg-white border"
            >
              Quay lại (Esc)
            </Button>
            <Button
              variant="primary"
              icon="edit"
              onClick={() => setIsCustomerModalOpen(true)}
            >
              Sửa thông tin (Alt+E)
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="px-6 py-4 border-b font-bold text-slate-800 bg-slate-50 uppercase tracking-wider text-xs">
              Thông tin chi tiết
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <InfoItem
                icon="call"
                label="Điện thoại chính"
                value={customer.mainPhone || "---"}
              />
              <InfoItem
                icon="mail"
                label="Email chính"
                value={customer.emailOfficial || "---"}
              />
              <InfoItem
                icon={customer.isOrganization ? "domain" : "fingerprint"}
                label={customer.isOrganization ? "Mã số thuế" : "CCCD/CMND"}
                value={customer.taxCode || customer.citizenId || "---"}
              />
              <InfoItem
                icon="public"
                label="Website"
                value={customer.website || "---"}
              />
              <InfoItem
                icon="location_on"
                label="Địa chỉ"
                value={
                  customer.addressCompany || customer.addressBilling || "---"
                }
              />
              <InfoItem
                icon="share"
                label="Nguồn khách"
                value={customer.sourceName || "Tự nhiên"}
              />
              <InfoItem
                icon="campaign"
                label="Chiến dịch"
                value={customer.campaignName || "Không có"}
              />
              <InfoItem
                icon="event"
                label="Ngày tạo"
                value={new Date(customer.createdAt).toLocaleDateString("vi-VN")}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 p-6">
            <h4 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-xs">
              Mô tả / Ghi chú
            </h4>
            <p className="text-slate-600 text-sm whitespace-pre-wrap">
              {customer.description || (
                <span className="italic opacity-50">Không có ghi chú nào.</span>
              )}
            </p>
          </div>
        </div>

        {/* CỘT PHẢI: QUẢN LÝ DANH BẠ LIÊN HỆ */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs">
                Danh bạ Liên hệ ({contacts.length})
              </h4>
              <button
                onClick={handleOpenAddContact}
                className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded hover:bg-primary/20 flex items-center transition-colors"
              >
                <span className="material-symbols-outlined text-[14px] mr-1">
                  add
                </span>{" "}
                Thêm
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {contacts.length === 0 ? (
                <div className="text-xs text-slate-400 italic text-center py-6 border border-dashed rounded-lg bg-slate-50">
                  Chưa có người liên hệ.
                </div>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-4 rounded-xl border ${contact.isPrimary ? "bg-indigo-50/50 border-indigo-200" : "bg-white border-slate-100"} relative group transition-colors`}
                  >
                    {/* Nút Action ẩn hiện */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEditContact(contact)}
                        className="w-7 h-7 flex items-center justify-center bg-white border shadow-sm rounded text-slate-400 hover:text-blue-600"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteContact(contact.id, contact.fullName)
                        }
                        className="w-7 h-7 flex items-center justify-center bg-white border shadow-sm rounded text-slate-400 hover:text-red-600"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          delete
                        </span>
                      </button>
                    </div>

                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${contact.isPrimary ? "bg-indigo-500" : "bg-slate-400"}`}
                      >
                        {contact.firstName?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1 min-w-0 pr-8">
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="text-sm font-bold text-slate-900 truncate">
                            {contact.fullName}
                          </div>
                          {contact.isPrimary && (
                            <span className="text-[8px] bg-indigo-500 text-white px-1.5 py-0.5 rounded uppercase font-black tracking-widest shrink-0">
                              Chính
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          {contact.jobTitle || "Nhân viên"}
                        </div>
                        <div className="text-xs text-slate-700 font-medium mt-2 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px] text-slate-400">
                            call
                          </span>{" "}
                          {contact.personalPhone || "Chưa có SĐT"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <CustomerFormModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        initialData={customer}
        onSuccess={fetchData}
        statuses={statuses}
        ranks={ranks}
        sources={sources}
        campaigns={campaigns}
      />

      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        initialData={contactToEdit}
        customer={customer}
        onSuccess={fetchData}
      />
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex gap-3">
    <span className="material-symbols-outlined text-slate-300 text-xl">
      {icon}
    </span>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  </div>
);

export default CustomerDetailPage;
