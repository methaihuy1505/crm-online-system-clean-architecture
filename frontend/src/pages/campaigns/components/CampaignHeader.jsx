import React from "react";
import { Megaphone } from "lucide-react";

// Nhận thêm props canCreate
const CampaignHeader = ({ onOpenAdd, canCreate }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-primary tracking-tight mb-2">
          Chiến dịch Marketing
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Theo dõi hiệu quả chuyển đổi từ các chương trình quảng bá.
        </p>
      </div>
      
      {/* ẨN/HIỆN DỰA VÀO QUYỀN */}
      {canCreate && (
        <button
          onClick={onOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-bold text-sm shadow-lg shadow-primary/20 outline-none transition-all"
        >
          <Megaphone size={18} strokeWidth={2.5} /> Thêm chiến dịch (Alt+N)
        </button>
      )}
    </div>
  );
};

export default CampaignHeader;