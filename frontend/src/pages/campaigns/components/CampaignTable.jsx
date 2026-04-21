import React from "react";
import Button from "../../../components/ui/Button";
import { getCampaignStatus } from "../../../utils/formatters";

const CampaignTable = ({
  filteredCampaigns,
  isLoading,
  onOpenEdit,
  onDelete,
  onOpenDetail,
}) => {
  return (
    <section className="lg:col-span-2 bg-surface-container-low rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10 flex flex-col h-full">
      <div className="p-6 border-b border-surface-variant/30 flex justify-between items-center">
        <h2 className="text-xl font-bold text-on-surface">
          Danh sách Chiến dịch
        </h2>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead className="bg-surface-container-high/50 text-[0.75rem] font-bold uppercase text-on-surface-variant">
            <tr>
              <th className="px-6 py-4">Chiến dịch</th>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant/30">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="p-10 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : (
              filteredCampaigns.map((item) => {
                const status = getCampaignStatus(item.startDate, item.endDate);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-primary/5 transition-colors group cursor-pointer"
                    onClick={() => onOpenDetail(item.id)}
                  >
                    <td className="px-6 py-5 font-bold text-on-surface">
                      {item.name}
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface-variant">
                      {item.startDate} - {item.endDate}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td
                      className="px-6 py-5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="iconOnly"
                          className="hover:bg-primary/10 text-primary"
                          onClick={() => onOpenEdit(item)}
                          icon="edit"
                        />
                        <Button
                          variant="iconOnly"
                          className="hover:bg-error/10 text-error"
                          onClick={() => onDelete(item.id, item.name)}
                          icon="delete"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CampaignTable;
