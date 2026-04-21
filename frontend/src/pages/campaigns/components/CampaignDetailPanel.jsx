import React from "react";
import Button from "../../../components/ui/Button";

const CampaignDetailPanel = ({ isOpen, onClose, campaign, onEdit }) => {
  if (!campaign) return null;

  const formatMoney = (amount) => 
    new Intl.NumberFormat("vi-VN", { style: 'currency', currency: 'VND' }).format(amount || 0);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-[55] backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      )}

      <div className={`fixed right-0 top-0 h-full w-[450px] bg-white shadow-2xl transition-transform duration-500 z-[60] border-l ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-8 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/50">Báo cáo hiệu quả</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">{campaign.name}</h2>
            </div>
            <Button variant="iconOnly" icon="close" onClick={onClose} className="hover:text-red-500" />
          </div>

          <div className="space-y-8 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {/* Mô tả - Trường mới thêm */}
            <section>
              <h3 className="text-[11px] font-black uppercase text-slate-400 mb-2">Mục tiêu chiến dịch</h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {campaign.description || "Chưa có mô tả chi tiết."}
              </p>
            </section>

            {/* Thống kê Leads & Customers */}
            <section className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-center">
                <div className="text-[10px] font-bold uppercase text-indigo-400 mb-1">Tổng Leads</div>
                <div className="text-2xl font-black text-indigo-700">{campaign.totalLeads || 0}</div>
              </div>
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-center">
                <div className="text-[10px] font-bold uppercase text-emerald-400 mb-1">Khách hàng mới</div>
                <div className="text-2xl font-black text-emerald-700">{campaign.totalCustomers || 0}</div>
              </div>
            </section>

            {/* Tài chính */}
            <section className="space-y-3">
               <h3 className="text-[11px] font-black uppercase text-slate-400 mb-2">Hiệu quả tài chính</h3>
               <div className="p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Dự thu (Đang đàm phán)</span>
                  <span className="text-sm font-bold text-amber-600">{formatMoney(campaign.expectedRevenue)}</span>
               </div>
               <div className="p-4 rounded-xl bg-slate-900 flex justify-between items-center shadow-lg">
                  <span className="text-sm font-medium text-slate-400">Thực thu (Đã chốt)</span>
                  <span className="text-sm font-black text-white">{formatMoney(campaign.actualRevenue)}</span>
               </div>
            </section>

            {/* Timeline */}
            <section>
              <h3 className="text-[11px] font-black uppercase text-slate-400 mb-2">Thời gian triển khai</h3>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <div className="flex-1 p-3 border rounded-lg text-center bg-slate-50">
                   <div className="text-[9px] text-slate-400 uppercase">Bắt đầu</div>
                   {campaign.startDate}
                </div>
                <div className="flex-1 p-3 border rounded-lg text-center bg-slate-50">
                   <div className="text-[9px] text-slate-400 uppercase">Kết thúc</div>
                   {campaign.endDate}
                </div>
              </div>
            </section>
          </div>

          <div className="pt-6 border-t mt-6 flex gap-3">
             <Button variant="primary" className="flex-1" icon="edit" onClick={() => onEdit(campaign)}>Chỉnh sửa</Button>
             <Button variant="cancel" className="flex-1 border" onClick={onClose}>Đóng</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignDetailPanel;