import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../lib/api";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { ArrowLeft, Download, PlusSquare, AlertTriangle } from "lucide-react"; // ĐỔI ICON
import { usePermission } from "../../../hooks/usePermission";

import OpportunityItemRow from "./OpportunityItemRow";
import OpportunityItemModal from "./OpportunityItemAdd";

const fmt = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v || 0,
  );

export default function OpportunityItemsManagement() {
  const { id: currentOpportunityId } = useParams();
  const navigate = useNavigate();

  // Dùng chung quyền update của cơ hội bán hàng để quản lý items
  const { hasPermission } = usePermission();
  const canUpdate = hasPermission("opportunities.update");
  const canDelete = hasPermission("opportunities.delete");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/opportunity-items/opportunity/${currentOpportunityId}`,
      );
      const data = res.data || [];
      setItems(data);
      if (data.length > 0 && !selectedItem) setSelectedItem(data[0]);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Lỗi khi lấy danh sách vật tư!",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentOpportunityId) fetchItems();
  }, [currentOpportunityId]);

  const grandTotal = items.reduce(
    (sum, item) => sum + (item.finalLineTotal || 0),
    0,
  );
  const totalQuantity = items.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  const handleExportExcel = () => {
    if (items.length === 0) return toast.error("Không có dữ liệu để xuất.");
    const formatData = items.map((i) => ({
      STT: i.lineItemNumber,
      "Tên mặt hàng": i.productName,
      "Số lượng": i.quantity,
      "Đơn giá": i.unitPrice,
      "Tỷ lệ CK (%)": i.discountRate,
      "Tiền chiết khấu": i.discountAmount,
      "Thuế VAT (%)": i.vatRate,
      "Tiền Thuế": i.vatAmount,
      "Thành tiền (VND)": i.finalLineTotal,
      "Ghi chú": i.note,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Báo giá");
    XLSX.writeFile(workbook, `Bao_Gia_Co_Hoi_ID_${currentOpportunityId}.xlsx`);
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget || !canUpdate) return;
    try {
      await api.delete(`/opportunity-items/${deleteTarget.id}`);
      if (selectedItem?.id === deleteTarget.id) setSelectedItem(null);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      fetchItems();
      toast.success("Gỡ vật tư thành công!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi xóa vật tư!");
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-[#f8f9fa]">
        <header className="h-16 bg-white border-b border-slate-200/60 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-sm font-black text-slate-800 uppercase tracking-tight">
              Quản lý SP báo giá #{currentOpportunityId}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportExcel}
              className="h-9 px-4 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center gap-1.5"
            >
              <Download size={16} /> Xuất Excel
            </button>
            {canUpdate && (
              <button
                onClick={() => {
                  setEditItem(null);
                  setModalOpen(true);
                }}
                className="h-9 px-4 rounded-lg text-xs font-bold text-white bg-linear-to-br from-primary to-primary-container shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                <PlusSquare size={16} /> Thêm mặt hàng
              </button>
            )}
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 h-10">
                    <th className="w-12 text-center text-[10px] font-black uppercase text-slate-400 tracking-wider pl-6">
                      STT
                    </th>
                    <th className="w-1/3 text-[10px] font-black uppercase text-slate-400 tracking-wider pl-4">
                      Sản phẩm / Vật tư
                    </th>
                    <th className="w-24 text-center text-[10px] font-black uppercase text-slate-400 tracking-wider pl-2">
                      Số lượng
                    </th>
                    <th className="w-32 text-right text-[10px] font-black uppercase text-slate-400 tracking-wider pl-2">
                      Đơn giá
                    </th>
                    <th className="w-32 text-right text-[10px] font-black uppercase text-slate-400 tracking-wider pl-2">
                      Chiết khấu
                    </th>
                    <th className="w-24 text-center text-[10px] font-black uppercase text-slate-400 tracking-wider pl-2">
                      VAT
                    </th>
                    <th className="w-36 text-right text-[10px] font-black uppercase text-slate-400 tracking-wider pl-2">
                      Thành tiền
                    </th>
                    <th className="w-20 pr-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-20 text-center text-xs font-medium text-slate-400"
                      >
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-20 text-center text-xs font-medium text-slate-400"
                      >
                        Chưa có vật tư nào. Vui lòng bấm thêm mới.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <OpportunityItemRow
                        key={item.id}
                        item={item}
                        index={index}
                        isActive={selectedItem?.id === item.id}
                        onSelect={setSelectedItem}
                        onEdit={(target) => {
                          setEditItem(target);
                          setModalOpen(true);
                        }}
                        onDelete={(target) => {
                          setDeleteTarget(target);
                          setShowDeleteConfirm(true);
                        }}
                        canUpdate={canUpdate} 
                        canDelete={canDelete}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </main>

          <aside className="hidden xl:block w-80 shrink-0 border-l border-slate-200 bg-[#f3f4f5]/50 overflow-y-auto p-6 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs space-y-4">
              <h3 className="text-[10px] font-black uppercase text-[#1A237E] tracking-wider border-b border-slate-100 pb-2">
                Tổng hợp ngân sách cơ hội
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    Tổng mặt hàng:
                  </span>
                  <span className="font-bold text-slate-700">
                    {totalQuantity}
                  </span>
                </div>
                <div className="pt-2 border-t border-dashed border-slate-100 flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Final Net Total
                  </span>
                  <span className="text-xl font-black text-[#1a237e] mt-0.5">
                    {fmt(grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {selectedItem && (
              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Bóc tách dòng #{selectedItem.lineItemNumber}
                  </h3>
                  <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    ID: {selectedItem.id}
                  </span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">
                      Mặt sản phẩm
                    </span>
                    <span className="font-bold text-slate-800 text-sm leading-tight">
                      {selectedItem.productName}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">
                        Đơn giá
                      </span>
                      <span className="font-mono text-slate-700 font-bold">
                        {fmt(selectedItem.unitPrice)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">
                        Gốc
                      </span>
                      <span className="font-mono text-slate-700 font-bold">
                        {fmt(selectedItem.totalPrice)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-50">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">
                        Giảm trừ CK
                      </span>
                      <span className="font-mono text-rose-600 font-bold">
                        -{fmt(selectedItem.discountAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">
                        Thuế VAT
                      </span>
                      <span className="font-mono text-blue-600 font-bold">
                        +{fmt(selectedItem.vatAmount)}
                      </span>
                    </div>
                  </div>
                  {selectedItem.note && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase mb-0.5">
                        Ghi chú đặc biệt
                      </span>
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {selectedItem.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <OpportunityItemModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
        opportunityId={currentOpportunityId}
        editItem={editItem}
        onSuccess={fetchItems}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center">
            <AlertTriangle size={40} className="text-red-600 mx-auto mb-3" />
            <h2 className="text-lg font-black text-slate-800 mb-1">
              Xác nhận gỡ vật tư?
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Bạn có chắc muốn loại bỏ{" "}
              <span className="font-bold text-slate-700">
                "{deleteTarget?.productName}"
              </span>{" "}
              ra khỏi cơ hội này?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteItem}
                className="flex-1 py-2 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
