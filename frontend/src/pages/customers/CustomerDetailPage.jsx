import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { usePermission } from "../../hooks/usePermission";
import {
  ArrowLeft, Edit, Phone, Mail, FileText, Globe, MapPin, Network, Flag, Calendar, Plus, Trash2, History, PhoneCall, Users as MeetingIcon, StickyNote, Receipt, Clock, ChevronRight, Building2, User
} from "lucide-react";
import CustomerFormModal from "./components/CustomerFormModal";
import ContactFormModal from "../contacts/components/ContactFormModal";
import CustomerActivityModal from "./components/CustomerActivityModal";

import ActivityFormModal from "../activites/components/ActivityFormModal"; 
import toast from "react-hot-toast";

const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const canUpdate = hasPermission("customers.update");
  const canUpdateContact = hasPermission("contacts.update");
  const canDeleteContact = hasPermission("contacts.delete");
  const canCreateContact = hasPermission("contacts.create");
  
  // Quyền cho Activity
  const canUpdateActivity = hasPermission("activities.update");
  const canDeleteActivity = hasPermission("activities.delete");

  const [customer, setCustomer] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);

  // States cho Activity Modal
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false); // Modal tạo nhanh
  const [isFullActivityModalOpen, setIsFullActivityModalOpen] = useState(false); // Modal sửa
  const [activityToEdit, setActivityToEdit] = useState(null);

  const [statuses, setStatuses] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [sources, setSources] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isCustomerModalOpen && !isContactModalOpen && !isActivityModalOpen && !isFullActivityModalOpen) {
        e.preventDefault(); navigate(-1);
      }
      if (e.altKey && (e.code === "KeyE" || e.key.toLowerCase() === "e") && !isCustomerModalOpen && !isContactModalOpen && !isActivityModalOpen && !isFullActivityModalOpen && canUpdate) {
        e.preventDefault(); setIsCustomerModalOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCustomerModalOpen, isContactModalOpen, isActivityModalOpen, isFullActivityModalOpen, navigate, canUpdate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [cusRes, contactRes, statRes, rankRes, srcRes, campRes, actRes] =
        await Promise.all([
          api.get(`/customers/${id}`),
          api.get(`/contacts/customer/${id}`),
          api.get("/customer-statuses"),
          api.get("/customer-ranks"),
          api.get("/sources"),
          api.get("/campaigns/options"),
          api.get("/activities/advanced-search", { params: { parentId: id, parentTypes: "CUSTOMER", size: 50 } })
              .catch(() => ({ data: { data: [] } })),
        ]);

      setCustomer(cusRes.data);
      setContacts(contactRes.data.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0)));
      setStatuses(statRes.data); setRanks(rankRes.data); setSources(srcRes.data); setCampaigns(campRes.data);

      let activityData = actRes?.data?.data || actRes?.data?.content || [];
      activityData = activityData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setActivities(activityData);
    } catch (err) {
      console.error("Lỗi:", err);
      const errorMessage = err.response?.data?.message || "Không thể tải thông tin khách hàng!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleDeleteContact = async (contactId, name) => {
    if (window.confirm(`Xóa liên hệ "${name}"?`)) {
      try {
        await api.delete(`/contacts/${contactId}`);
        setContacts((prev) => prev.filter((c) => c.id !== contactId));
        toast.success(`Đã xóa liên hệ ${name}`);
      } catch (err) { 
        const errorMessage = err.response?.data?.message || "Xóa liên hệ thất bại!";
        toast.error(errorMessage);
        console.error(err);
      }
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhật ký hoạt động này?")) {
      try {
        await api.delete(`/activities/${activityId}`);
        toast.success("Xóa nhật ký thành công!");
        fetchData();
      } catch (err) { 
        const errorMessage = err.response?.data?.message || "Xóa nhật ký thất bại!";
        toast.error(errorMessage);
        console.error(err);
      }
    }
  };

  const handleOpenAddContact = () => { setContactToEdit(null); setIsContactModalOpen(true); };
  const handleOpenEditContact = (contact) => { setContactToEdit(contact); setIsContactModalOpen(true); };

  const getActivityIcon = (type) => {
    switch (type) {
      case "CALL": return <PhoneCall size={14} className="text-blue-600" />;
      case "MEETING": return <MeetingIcon size={14} className="text-emerald-600" />;
      case "NOTE": return <StickyNote size={14} className="text-amber-600" />;
      case "EMAIL_QUOTE": return <Receipt size={14} className="text-purple-600" />;
      case "EMAIL_TRANSACTION": return <Mail size={14} className="text-teal-600" />;
      default: return <Clock size={14} className="text-slate-600" />;
    }
  };

  const getActivityBg = (type) => {
    switch (type) {
      case "CALL": return "bg-blue-100 ring-blue-50";
      case "MEETING": return "bg-emerald-100 ring-emerald-50";
      case "NOTE": return "bg-amber-100 ring-amber-50";
      case "EMAIL_QUOTE": return "bg-purple-100 ring-purple-50";
      case "EMAIL_TRANSACTION": return "bg-teal-100 ring-teal-50";
      default: return "bg-slate-100 ring-slate-50";
    }
  };

  if (isLoading) return <div className="p-8 font-medium text-slate-500">Đang tải dữ liệu...</div>;
  if (!customer) return <div className="p-8 font-medium text-red-500">Không tìm thấy khách hàng.</div>;

  return (
    <div className="space-y-6 flex-1">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
          <div className="flex gap-4 items-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black ${customer.isOrganization ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-700"}`}>
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">{customer.name}</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 font-medium">{customer.isOrganization ? "Tổ chức (B2B)" : "Cá nhân (B2C)"} • {customer.customerCode || "Chưa có mã"}</span>
                <span className="px-3 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-100 uppercase tracking-widest">{customer.statusName || "Đang chăm sóc"}</span>
                {customer.rankName && <span className="px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100 uppercase tracking-widest">{customer.rankName}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-sm outline-none"><ArrowLeft size={16} /> Quay lại (Esc)</button>
            {canUpdate && <button onClick={() => setIsCustomerModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-bold text-sm shadow-md shadow-primary/20 outline-none"><Edit size={16} /> Sửa thông tin (Alt+E)</button>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b font-bold text-slate-800 bg-slate-50 uppercase tracking-wider text-xs">Thông tin chi tiết</div>
            
            {/* 🌟 ĐÃ MỞ RỘNG TẤT CẢ CÁC TRƯỜNG THÔNG TIN MỚI TẠI ĐÂY */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <InfoItem icon={<FileText />} label="Mã KH" value={customer.customerCode || "---"} />
              <InfoItem icon={<Building2 />} label="Loại hình" value={customer.isOrganization ? "Tổ chức / Doanh nghiệp" : "Cá nhân"} />
              <InfoItem icon={<FileText />} label={customer.isOrganization ? "Mã số thuế" : "MST Cá nhân"} value={customer.taxCode || "---"} />
              {!customer.isOrganization && <InfoItem icon={<User />} label="CCCD/CMND" value={customer.citizenId || "---"} />}
              <InfoItem icon={<Calendar />} label="Ngày thành lập/Sinh" value={customer.foundedDate ? new Date(customer.foundedDate).toLocaleDateString('vi-VN') : "---"} />
              
              <InfoItem icon={<Phone />} label="Số điện thoại chính" value={customer.mainPhone || "---"} />
              <InfoItem icon={<Mail />} label="Email chính thức" value={customer.emailOfficial || "---"} />
              <InfoItem icon={<Globe />} label="Website" value={customer.website || "---"} />
              <InfoItem icon={<PhoneCall />} label="Số Fax" value={customer.fax || "---"} />
              
              <InfoItem icon={<MapPin />} label="Địa chỉ Trụ sở" value={customer.addressCompany || "---"} />
              <InfoItem icon={<MapPin />} label="Địa chỉ Thanh toán" value={customer.addressBilling || "---"} />
              
              <InfoItem icon={<Network />} label="Nguồn khách" value={customer.sourceName || "Tự nhiên"} />
              <InfoItem icon={<Flag />} label="Chiến dịch" value={customer.campaignName || "Không tham gia"} />
              <InfoItem icon={<User />} label="Người phụ trách" value={customer.assignedUserName ?? "Chưa phân bổ"} />
              
              <InfoItem icon={<Clock />} label="Ngày tạo" value={customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("vi-VN") : "---"} />
              <InfoItem icon={<History />} label="Lần cập nhật cuối" value={customer.updatedAt ? new Date(customer.updatedAt).toLocaleDateString("vi-VN") : "---"} />
            </div>

          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h4 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-xs">Mô tả / Ghi chú</h4>
            <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{customer.description || <span className="italic opacity-50">Không có ghi chú nào.</span>}</p>
          </div>
        </div>

        <div className="lg:col-span-3 relative">
          <div className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="px-6 py-3.5 border-b bg-slate-50 flex justify-between items-center shrink-0">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Danh bạ ({contacts.length})</h4>
              {canCreateContact && (
                <button onClick={handleOpenAddContact} className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1.5 rounded-lg hover:bg-primary/20 flex items-center transition-colors outline-none">
                  <Plus size={14} className="mr-1" /> Thêm
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {contacts.length === 0 ? (
                <div className="text-xs text-slate-400 italic text-center py-6 border border-dashed rounded-lg bg-slate-50">Chưa có người liên hệ.</div>
              ) : (
                contacts.map((contact) => (
                  <div key={contact.id} className={`p-4 rounded-xl border ${contact.isPrimary ? "bg-indigo-50/50 border-indigo-200" : "bg-white border-slate-100"} relative group transition-colors`}>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {canUpdateContact && <button onClick={() => handleOpenEditContact(contact)} className="p-1.5 bg-white border shadow-sm rounded-lg text-slate-400 hover:text-blue-600 outline-none"><Edit size={14} /></button>}
                      {canDeleteContact && <button onClick={() => handleDeleteContact(contact.id, contact.fullName)} className="p-1.5 bg-white border shadow-sm rounded-lg text-slate-400 hover:text-red-600 outline-none"><Trash2 size={14} /></button>}
                    </div>

                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${contact.isPrimary ? "bg-indigo-500" : "bg-slate-400"}`}>{contact.firstName?.charAt(0) || "U"}</div>
                      <div className="flex-1 min-w-0 pr-8">
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="text-sm font-bold text-slate-900 truncate">{contact.fullName}</div>
                          {contact.isPrimary && <span className="text-[8px] bg-indigo-500 text-white px-1.5 py-0.5 rounded uppercase font-black tracking-widest shrink-0">Chính</span>}
                        </div>
                        <div className="text-xs text-slate-500 truncate">{contact.jobTitle || "Nhân viên"}</div>
                        <div className="text-xs text-slate-700 font-medium mt-2 flex items-center gap-1.5"><Phone size={12} className="text-slate-400" />{contact.personalPhone || "Chưa có SĐT"}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 relative">
          <div className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="px-6 py-3.5 border-b bg-slate-50 flex justify-between items-center shrink-0">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs flex items-center gap-2"><History size={16} className="text-primary" /> Nhật ký chăm sóc</h4>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                {activities.length === 0 ? (
                  <div className="text-xs text-slate-400 italic">Chưa có hoạt động nào.</div>
                ) : (
                  activities.map((act) => (
                    <div key={act.id} className="relative pl-6">
                      <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center ring-4 ${getActivityBg(act.activityType)}`}>
                        {getActivityIcon(act.activityType)}
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 hover:border-primary/20 transition-colors group relative cursor-pointer" onClick={() => navigate(`/activities/${act.id}`)}>
                        
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          {canUpdateActivity && (
                            <button onClick={(e) => { e.stopPropagation(); setActivityToEdit(act); setIsFullActivityModalOpen(true); }} className="p-1.5 bg-white border shadow-sm rounded-lg text-slate-400 hover:text-blue-600 outline-none">
                              <Edit size={14} />
                            </button>
                          )}
                          {canDeleteActivity && (
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteActivity(act.id); }} className="p-1.5 bg-white border shadow-sm rounded-lg text-slate-400 hover:text-red-600 outline-none">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        <div className="flex justify-between items-start mb-1 pr-12">
                          <h5 className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2 pr-2">{act.subject}</h5>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium mb-2">
                          <span>Bởi: <span className="font-bold text-slate-700">{act.createdByName || "Hệ thống"}</span></span>
                          <span>•</span>
                          <span>{new Date(act.createdAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}</span>
                        </div>

                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${act.isCompleted ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                          {act.isCompleted ? "Đã hoàn thành" : "Chưa hoàn thành"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white shrink-0">
              <button onClick={() => setIsActivityModalOpen(true)} className="w-full py-2 bg-primary/10 text-primary font-bold text-xs rounded-xl hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 outline-none">
                <Plus size={14} /> Ghi nhận hoạt động
              </button>
            </div>

          </div>
        </div>

      </div>

      <CustomerFormModal isOpen={isCustomerModalOpen} onClose={() => setIsCustomerModalOpen(false)} initialData={customer} onSuccess={fetchData} statuses={statuses} ranks={ranks} sources={sources} campaigns={campaigns} />
      <ContactFormModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} initialData={contactToEdit} customer={customer} onSuccess={fetchData} />
      
      <CustomerActivityModal 
        isOpen={isActivityModalOpen} 
        onClose={() => setIsActivityModalOpen(false)} 
        onSave={fetchData} 
        customerId={id} 
        customerName={customer?.name} 
        contacts={contacts} 
      />

      {isFullActivityModalOpen && (
         <ActivityFormModal 
            isOpen={isFullActivityModalOpen} 
            onClose={() => { setIsFullActivityModalOpen(false); setActivityToEdit(null); }} 
            onSave={fetchData} 
            initialData={activityToEdit} 
         />
      )}

    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex gap-3">
    <div className="text-slate-300 [&>svg]:w-5 [&>svg]:h-5 mt-0.5">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  </div>
);

export default CustomerDetailPage;