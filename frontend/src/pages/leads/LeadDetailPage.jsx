import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LeadFormModal from "./LeadFormModal";
import Button from "../../components/ui/Button"; // Import Button
import { formatCurrency } from "../../utils/formatters"; // Import formatter

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeadDetail = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/leads/${id}`);
      setLead(res.data);
    } catch (err) {
      console.error("Lỗi tải chi tiết lead:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetail();
  }, [id]);

  if (isLoading) return <div className="p-8">Đang tải dữ liệu...</div>;
  if (!lead) return <div className="p-8">Không tìm thấy khách hàng.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-outline-variant/10">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
              {lead.fullName.charAt(0)}
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-on-surface">
                {lead.fullName}
              </h2>
              <p className="text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  business
                </span>
                {lead.companyName || "Khách hàng cá nhân"}
              </p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                  {lead.statusName}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            {/* Sử dụng component Button thay vì code cứng */}
            <Button
              variant="cancel"
              icon="arrow_back"
              onClick={() => navigate(-1)}
              className="border border-outline-variant hover:bg-slate-50"
            >
              Quay lại
            </Button>
            <Button
              variant="primary"
              icon="edit"
              onClick={() => setIsModalOpen(true)}
            >
              Chỉnh sửa
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="px-6 py-4 border-b font-bold text-primary bg-slate-50">
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
              {/* Dùng formatCurrency dùng chung */}
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
                value={
                  lead.assignedTo
                    ? `Nhân viên ID: ${lead.assignedTo}`
                    : "Chưa giao cho ai"
                }
              />
              <InfoItem
                icon="event"
                label="Ngày tạo"
                value={new Date(lead.createdAt).toLocaleDateString("vi-VN")}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 p-6">
            <h4 className="font-bold text-primary mb-4">Ghi chú</h4>
            <p className="text-on-surface-variant italic">
              {lead.description || "Không có ghi chú nào."}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 p-6">
            <h4 className="font-bold text-on-surface mb-6">
              Thống kê tương tác
            </h4>
            <div className="space-y-4">
              <StatRow
                icon="phone_in_talk"
                label="Cuộc gọi"
                count={lead.totalCalls}
                color="text-blue-600"
              />
              <StatRow
                icon="alternate_email"
                label="Email"
                count={lead.totalEmails}
                color="text-purple-600"
              />
              <StatRow
                icon="groups"
                label="Cuộc gặp"
                count={lead.totalMeetings}
                color="text-orange-600"
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
      />
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex gap-3">
    <span className="material-symbols-outlined text-outline text-lg">
      {icon}
    </span>
    <div>
      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-medium text-on-surface">{value}</p>
    </div>
  </div>
);

const StatRow = ({ icon, label, count, color }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
    <div className="flex items-center gap-3">
      <span className={`material-symbols-outlined ${color}`}>{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
    <span className="font-bold text-lg">{count}</span>
  </div>
);

export default LeadDetailPage;
