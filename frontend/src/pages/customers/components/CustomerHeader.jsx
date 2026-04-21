import React from "react";
import Button from "../../../components/ui/Button";

const CustomerHeader = ({ totalCustomers, onOpenAdd }) => {
  return (
    <div className="flex justify-between items-end mb-8">
      <div>
        <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-2">Khách hàng</h1>
        <p className="text-slate-500 font-medium">Quản lý và theo dõi {totalCustomers || 0} đối tác hệ thống.</p>
      </div>
      <Button variant="gradient" icon="add" onClick={onOpenAdd}>
        Thêm khách hàng mới
      </Button>
    </div>
  );
};

export default CustomerHeader;