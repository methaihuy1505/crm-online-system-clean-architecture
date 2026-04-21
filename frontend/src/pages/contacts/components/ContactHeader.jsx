import React from "react";
import Button from "../../../components/ui/Button";

const ContactHeader = ({ totalContacts, onOpenAdd }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
      <div>
        <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight mb-2">
          Danh sách Người liên hệ
        </h2>
        <div className="flex items-center space-x-2">
          <span className="flex items-center text-xs text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-full font-medium">
            <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-1.5"></span>
            {totalContacts} Tổng số
          </span>
          <span className="text-xs text-on-surface-variant font-label opacity-60">
            Sắp xếp theo: Hoạt động gần nhất
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Toggle Grid/List */}
        <div className="flex bg-surface-container-low p-1 rounded-lg">
          <button className="p-2 bg-white rounded shadow-sm text-primary">
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button className="p-2 text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">
              format_list_bulleted
            </span>
          </button>
        </div>

        {/* Nút thêm mới */}
        <Button variant="gradient" icon="person_add" onClick={onOpenAdd}>
          Thêm Liên hệ
        </Button>
      </div>
    </div>
  );
};

export default ContactHeader;
