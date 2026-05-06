import React from "react";
import { UserPlus } from "lucide-react";

const LeadHeader = ({ onOpenAdd }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">
          Khách hàng tiềm năng
        </h2>
        <p className="text-on-surface-variant mt-1">
          Quản lý và theo dõi các cơ hội kinh doanh mới trong hệ thống.
        </p>
      </div>
      <button
        onClick={onOpenAdd}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-bold text-sm shadow-lg shadow-primary/20 outline-none transition-all"
      >
        <UserPlus size={18} strokeWidth={2.5} /> Thêm Lead mới (Alt+N)
      </button>
    </div>
  );
};

export default LeadHeader;
