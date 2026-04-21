import React from "react";
import Button from "../../../components/ui/Button";

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

      {/* Sử dụng Button dùng chung */}
      <Button variant="gradient" icon="person_add" onClick={onOpenAdd}>
        Thêm Lead mới
      </Button>
    </div>
  );
};

export default LeadHeader;
