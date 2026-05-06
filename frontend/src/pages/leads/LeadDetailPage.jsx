import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LeadFormModal from "./LeadFormModal"; 
import Button from "../../components/ui/Button";
import { formatCurrency } from "../../utils/formatters";

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // BỔ SUNG STATE LƯU DANH MỤC
  const [sources, setSources] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // === LẮNG NGHE PHÍM TẮT TRONG TRANG DETAIL ===
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
      // BỔ SUNG GỌI API LẤY DANH MỤC CÙNG LÚC VỚI LẤY CHI TIẾT LEAD
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
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-outline-variant/10">
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
                <span className="text-sm text-slate-500 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    business
                  </span>{" "}
                  {lead.companyName || "Khách hàng cá nhân"}
                </span>
                <span className="px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100 uppercase tracking-widest">
                  {lead.statusName}
                </span>
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
              onClick={() => setIsModalOpen(true)}
            >
              Sửa thông tin (Alt+E)
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="px-6 py-4 border-b font-bold text-slate-800 bg-slate-50 uppercase tracking-wider text-xs">
              Thông tin chi tiết
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <InfoItem icon="call" label="Số điện thoại" value={lead.phone} />
              <InfoItem icon="mail" label="Email" value={lead.email || "---"} />
              <InfoItem
                icon="fingerprint"
                label="CMND/CCCD"
                value={lead.citizenId}
              />
              <InfoItem
                icon="payments"
                label="Doanh thu dự kiến"
                value={formatCurrency(lead.expectedRevenue)}
              />
              <InfoItem
                icon="public"
                label="Website"
                value={lead.website || "---"}
              />
              <InfoItem
                icon="location_on"
                label="Địa chỉ"
                value={lead.address || "---"}
              />
              <InfoItem icon="share" label="Nguồn" value={lead.sourceName} />
              <InfoItem
                icon="person"
                label="Người đảm nhận"
                value={lead.assignedTo ? `ID: ${lead.assignedTo}` : "Chưa giao"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ĐÃ TRUYỀN ĐẦY ĐỦ DANH MỤC VÀO FORM */}
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

export default LeadDetailPage;
