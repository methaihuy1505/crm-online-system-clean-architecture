import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LeadActivityModal from "./LeadActivityModal"; 
import api from "../../lib/api";
import {
  ArrowLeft, Edit, Phone, Mail, IdCard, CircleDollarSign, Globe, MapPin, Network, User, Building2, CheckCircle,
  History, PhoneCall, Users as MeetingIcon, StickyNote, Receipt, Clock, ChevronRight, Plus, Trash2
} from "lucide-react";
import LeadFormModal from "./LeadFormModal";
import { formatCurrency } from "../../utils/formatters";
import toast from "react-hot-toast";
import ConfirmModal from "./components/ConfirmModal";
import { usePermission } from "../../hooks/usePermission";

import ActivityFormModal from "../activites/components/ActivityFormModal"; 


const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // States Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  // States Activity Modals
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false); // Tạo nhanh
  const [isFullActivityModalOpen, setIsFullActivityModalOpen] = useState(false); // Sửa (Inline Edit)
  const [activityToEdit, setActivityToEdit] = useState(null);

  const [sources, setSources] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [branchProvinces, setBranchProvinces] = useState([]);
  const [users, setUsers] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { roleId: 1, id: 1, branchId: 1 };
  
  // Phân quyền
  const { hasPermission } = usePermission();
  const canUpdate = hasPermission("leads.update");
  const canConvert = hasPermission("leads.convert");
  const canUpdateActivity = hasPermission("activities.update");
  const canDeleteActivity = hasPermission("activities.delete");

  const isConverted = lead?.statusId === 3 || lead?.statusName === "Đã chuyển đổi";

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isModalOpen && !isConfirmOpen && !isActivityModalOpen && !isFullActivityModalOpen) { 
        e.preventDefault(); 
        navigate(-1); 
      }
      if (e.altKey && (e.code === "KeyE" || e.key.toLowerCase() === "e") && !isModalOpen && !isActivityModalOpen && !isFullActivityModalOpen && canUpdate && !isConverted) {
        e.preventDefault(); 
        setIsModalOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, isConfirmOpen, isActivityModalOpen, isFullActivityModalOpen, navigate, canUpdate, isConverted]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [res, srcRes, camRes, statusRes, bpRes, userRes, actRes] = await Promise.all([
        api.get(`/leads/${id}`),
        api.get("/sources"),
        api.get("/campaigns/options"),
        api.get("/lead-statuses"),
        api.get("/branch-provinces"),
        api.get("/users", { params: { size: 100 } }),
        api.get('/activities/advanced-search', { params: { parentId: id, parentTypes: 'LEAD', size: 50 } }).catch(() => ({ data: { data: [] } }))
      ]);
      setLead(res.data); setSources(srcRes.data); setCampaigns(camRes.data); setStatuses(statusRes.data);
      setBranchProvinces(bpRes.data); setUsers(userRes.data.content || userRes.data);

      let activityData = actRes?.data?.data || actRes?.data?.content || [];
      activityData = activityData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setActivities(activityData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Lỗi khi tải dữ liệu chi tiết!";
      toast.error(errorMessage);
      console.error("Lỗi khi tải dữ liệu chi tiết:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleConvertLead = async () => {
    try {
      await api.post(`/leads/${id}/convert`);
      toast.success("Chuyển đổi thành công!");
      fetchData(); setIsConfirmOpen(false); 
    } catch (error) { 
      setIsConfirmOpen(false); 
      console.error("Lỗi khi chuyển đổi lead:", error); 
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhật ký hoạt động này?")) {
      try {
        await api.delete(`/activities/${activityId}`);
        toast.success("Xóa nhật ký thành công!");
        fetchData();
      } catch (err) { 
        const errorMessage = err.response?.data?.message || "Xóa thất bại!";
        toast.error(errorMessage);
        console.error(err); 
      }
    }
  };

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
  if (!lead) return <div className="p-8 font-medium text-red-500">Không tìm thấy khách hàng.</div>;

  return (
    <div className="space-y-6 flex-1">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black">{lead.fullName.charAt(0)}</div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">{lead.fullName}</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 font-medium flex items-center gap-2"><User size={16} /> {lead.companyName || "Khách hàng cá nhân"}</span>
                <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-widest ${isConverted ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-100"}`}>{lead.statusName}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-sm outline-none"><ArrowLeft size={16} /> Quay lại (Esc)</button>
            <ConfirmModal isOpen={isConfirmOpen} title="Xác nhận chuyển đổi" message={`Chuyển đổi [${lead.fullName}] thành Khách hàng chính thức?`} onConfirm={handleConvertLead} onCancel={() => setIsConfirmOpen(false)} confirmText="Chuyển đổi ngay" />
            {canConvert && !isConverted && (<button onClick={() => setIsConfirmOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-sm shadow-md shadow-green-600/20 outline-none transition-colors"><CheckCircle size={16} /> Chuyển đổi</button>)}
            {canUpdate && !isConverted && (<button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-bold text-sm shadow-md shadow-primary/20 outline-none transition-colors"><Edit size={16} /> Sửa (Alt+E)</button>)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CỘT TRÁI */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b font-bold text-slate-800 bg-slate-50 uppercase tracking-wider text-xs">Thông tin chi tiết</div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <InfoItem icon={<Phone />} label="Số điện thoại" value={lead.phone} />
              <InfoItem icon={<Mail />} label="Email" value={lead.email || "---"} />
              <InfoItem icon={<IdCard />} label="CMND/CCCD" value={lead.citizenId || "---"} />
              <InfoItem icon={<CircleDollarSign />} label="Doanh thu dự kiến" value={formatCurrency(lead.expectedRevenue)} />
              <InfoItem icon={<Globe />} label="Website" value={lead.website || "---"} />
              <InfoItem icon={<MapPin />} label="Địa chỉ" value={lead.address || "---"} />
              <InfoItem icon={<Network />} label="Nguồn" value={lead.sourceName || "---"} />
              <InfoItem icon={<MapPin />} label="Khu vực (Tỉnh/Thành)" value={lead.provinceName || "---"} />
              <InfoItem icon={<Building2 />} label="Chi nhánh phụ trách" value={lead.branchName || "---"} />
              <InfoItem icon={<User />} label="Người đảm nhận" value={lead.assignedToName ? `${lead.assignedToName}` : "Chưa giao"} />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h4 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-xs">Mô tả / Ghi chú</h4>
            <p className="text-slate-600 text-sm whitespace-pre-wrap">{lead.description || <span className="italic opacity-50">Không có ghi chú nào.</span>}</p>
          </div>
        </div>

        {/* CỘT PHẢI - HOẠT ĐỘNG */}
        <div className="lg:col-span-1 h-[500px] lg:h-auto relative">
          <div className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center shrink-0">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs flex items-center gap-2"><History size={16} className="text-primary" /> Nhật ký hoạt động</h4>
            </div>

            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                {activities.length === 0 ? (
                  <div className="text-xs text-slate-400 italic">Chưa có hoạt động nào.</div>
                ) : (
                  activities.map((act) => (
                    <div key={act.id} className="relative pl-6">
                      <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center ring-4 ${getActivityBg(act.activityType)}`}>
                        {getActivityIcon(act.activityType)}
                      </div>
                      
                      {/* WRAPPER CLICK ĐỂ XEM CHI TIẾT */}
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 hover:border-primary/20 transition-colors group relative cursor-pointer" onClick={() => navigate(`/activities/${act.id}`)}>
                        
                        {/* THÊM NÚT SỬA/XÓA TẠI CHỖ KHI HOVER */}
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

            {!isConverted && (
              <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                <button 
                  onClick={() => setIsActivityModalOpen(true)} 
                  className="w-full py-2.5 bg-primary/10 text-primary font-bold text-sm rounded-xl hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Ghi nhận hoạt động mới
                </button>
              </div>  
            )}
          </div>
        </div>

      </div>

      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={fetchData} currentLead={lead} statuses={statuses} sources={sources} campaigns={campaigns} branchProvinces={branchProvinces} users={users} currentUser={currentUser} />
      
      {/* MODAL TẠO NHANH */}
      <LeadActivityModal 
        isOpen={isActivityModalOpen} 
        onClose={() => setIsActivityModalOpen(false)} 
        onSave={fetchData} 
        leadId={id} 
        leadName={lead?.fullName} 
      />

      {/* MODAL CHỈNH SỬA TẠI CHỖ (INLINE EDIT) BẰNG FORM LỚN */}
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
      <p className="text-sm font-medium text-slate-800 break-all">{value}</p>
    </div>
  </div>
);

export default LeadDetailPage;