import React from "react";
import { UserPlus } from "lucide-react";

const CustomerHeader = ({ totalCustomers, onOpenAdd }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-primary tracking-tight mb-2">Khách hàng</h1>
        <p className="text-slate-500 font-medium mt-1">Quản lý và theo dõi {totalCustomers || 0} đối tác hệ thống.</p>
      </div>
      <button onClick={onOpenAdd} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-bold text-sm shadow-lg shadow-primary/20 outline-none transition-all">
        <UserPlus size={18} strokeWidth={2.5} /> Thêm khách hàng mới (Alt+N)
      </button>
    </div>
  );
};  

export default CustomerHeader;