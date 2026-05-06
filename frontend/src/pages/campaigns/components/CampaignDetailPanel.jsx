import React, { useEffect } from "react";
import Button from "../../../components/ui/Button";

const CampaignDetailPanel = ({ isOpen, onClose, campaign, onEdit }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!campaign) return null;

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[105]"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed right-0 top-0 h-full w-[450px] bg-white shadow-2xl transition-transform duration-300 z-[110] border-l ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/50">
                Chi tiết & Hiệu quả
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1 line-clamp-2">
                {campaign.name}
              </h2>
            </div>
            <Button
              variant="iconOnly"
              icon="close"
              onClick={onClose}
              className="hover:text-red-500 bg-slate-50"
            />
          </div>

          <div className="space-y-8 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            <section className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-center">
                <div className="text-[10px] font-bold uppercase text-indigo-400 mb-1">
                  Tổng Leads
                </div>
                <div className="text-2xl font-black text-indigo-700">
                  {campaign.totalLeads || 0}
                </div>
              </div>
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-center">
                <div className="text-[10px] font-bold uppercase text-emerald-400 mb-1">
                  Khách hàng mới
                </div>
                <div className="text-2xl font-black text-emerald-700">
                  {campaign.totalCustomers || 0}
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-[11px] font-black uppercase text-slate-400 mb-2">
                Hiệu quả tài chính
              </h3>
              <div className="p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">
                  Dự thu (Đang tiếp cận)
                </span>
                <span className="text-sm font-bold text-amber-600">
                  {formatMoney(campaign.expectedRevenue)}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-800 flex justify-between items-center shadow-lg">
                <span className="text-sm font-medium text-slate-300">
                  Thực thu (Đã chốt)
                </span>
                <span className="text-sm font-black text-white">
                  {formatMoney(campaign.actualRevenue)}
                </span>
              </div>
            </section>

            <section>
              <h3 className="text-[11px] font-black uppercase text-slate-400 mb-2">
                Thời gian triển khai
              </h3>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <div className="flex-1 p-3 border rounded-lg text-center bg-slate-50">
                  <div className="text-[9px] text-slate-400 uppercase">
                    Bắt đầu
                  </div>
                  {campaign.startDate
                    ? new Date(campaign.startDate).toLocaleDateString("vi-VN")
                    : "---"}
                </div>
                <div className="flex-1 p-3 border rounded-lg text-center bg-slate-50">
                  <div className="text-[9px] text-slate-400 uppercase">
                    Kết thúc
                  </div>
                  {campaign.endDate
                    ? new Date(campaign.endDate).toLocaleDateString("vi-VN")
                    : "---"}
                </div>
              </div>
            </section>
          </div>

          <div className="pt-6 border-t mt-6 flex gap-3">
            <Button
              variant="primary"
              className="flex-1 shadow-md shadow-primary/20"
              icon="edit"
              onClick={() => {
                onEdit(campaign);
                onClose();
              }}
            >
              Chỉnh sửa (Alt+E)
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignDetailPanel;
