import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  IdCard,
  CircleDollarSign,
  Globe,
  MapPin,
  Network,
  User,
} from "lucide-react";
import LeadFormModal from "./LeadFormModal";
import { formatCurrency } from "../../utils/formatters";
import toast from "react-hot-toast";

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sources, setSources] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isModalOpen) {
        e.preventDefault();
        navigate(-1);
      }
      if (
        e.altKey &&
        (e.code === "KeyE" || e.key.toLowerCase() === "e") &&
        !isModalOpen
      ) {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, navigate]);

  const fetchLeadDetail = async () => {
    try {
      const [res, srcRes, camRes, statusRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/v1/leads/${id}`),
        axios.get("http://localhost:8080/api/v1/sources"),
        axios.get("http://localhost:8080/api/v1/campaigns/options"),
        axios.get("http://localhost:8080/api/v1/lead-statuses"),
      ]);
      setLead(res.data);
      setSources(srcRes.data);
      setCampaigns(camRes.data);
      setStatuses(statusRes.data);
    } catch (err) {
      toast.error("Không thể tải thông tin khách hàng!"); 
      console.error("Lỗi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetail();
  }, [id]);

  if (isLoading)
    return (
      <div className="p-8 font-medium text-slate-500">Đang tải dữ liệu...</div>
    );
  if (!lead)
    return (
      <div className="p-8 font-medium text-red-500">
        Không tìm thấy khách hàng.
      </div>
    );

  return (
    <div className="space-y-6 flex-1">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black">
              {lead.fullName.charAt(0)}
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">
                {lead.fullName}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
                  <User size={16} /> {lead.companyName || "Khách hàng cá nhân"}
                </span>
                <span className="px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100 uppercase tracking-widest">
                  {lead.statusName}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-sm outline-none"
            >
              <ArrowLeft size={16} /> Quay lại (Esc)
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-bold text-sm shadow-md shadow-primary/20 outline-none"
            >
              <Edit size={16} /> Sửa thông tin (Alt+E)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b font-bold text-slate-800 bg-slate-50 uppercase tracking-wider text-xs">
              Thông tin chi tiết
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <InfoItem
                icon={<Phone />}
                label="Số điện thoại"
                value={lead.phone}
              />
              <InfoItem
                icon={<Mail />}
                label="Email"
                value={lead.email || "---"}
              />
              <InfoItem
                icon={<IdCard />}
                label="CMND/CCCD"
                value={lead.citizenId}
              />
              <InfoItem
                icon={<CircleDollarSign />}
                label="Doanh thu dự kiến"
                value={formatCurrency(lead.expectedRevenue)}
              />
              <InfoItem
                icon={<Globe />}
                label="Website"
                value={lead.website || "---"}
              />
              <InfoItem
                icon={<MapPin />}
                label="Địa chỉ"
                value={lead.address || "---"}
              />
              <InfoItem
                icon={<Network />}
                label="Nguồn"
                value={lead.sourceName}
              />
              <InfoItem
                icon={<User />}
                label="Người đảm nhận"
                value={lead.assignedTo ? `ID: ${lead.assignedTo}` : "Chưa giao"}
              />
            </div>
          </div>
        </div>
      </div>

      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchLeadDetail}
        currentLead={lead}
        statuses={statuses}
        sources={sources}
        campaigns={campaigns}
      />
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex gap-3">
    <div className="text-slate-300 [&>svg]:w-5 [&>svg]:h-5 mt-0.5">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  </div>
);

export default LeadDetailPage;
