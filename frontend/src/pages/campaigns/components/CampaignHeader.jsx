import React from "react";
import Button from "../../../components/ui/Button";

const CampaignHeader = ({ onOpenAdd }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-[2.75rem] font-bold text-primary leading-tight tracking-tight">
          Chiến dịch Marketing
        </h1>
        <p className="text-on-surface-variant">
          Theo dõi hiệu quả chuyển đổi từ các chương trình quảng bá.
        </p>
      </div>
      <Button variant="gradient" icon="add" onClick={onOpenAdd}>
        Thêm chiến dịch
      </Button>
    </div>
  );
};

export default CampaignHeader;
