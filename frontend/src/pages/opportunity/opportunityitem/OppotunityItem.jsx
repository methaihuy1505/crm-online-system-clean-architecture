import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import OpportunityItemRow from "./OpportunityItemRow";
import OpportunityItemModal from "./OpportunityItemAdd";

const api = axios.create({ baseURL: "http://localhost:8080/api/v1" });
const fmt = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v || 0,
  );

export default function OpportunityItemsManagement() {
  const { id: currentOpportunityId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  // Điều khiển các Modal
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
      if (data.length > 0 && !selectedItem) {
        setSelectedItem(data[0]); // Mặc định chọn dòng đầu tiên để đổ detail sang panel phải
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách item: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentOpportunityId) fetchItems();
  }, [currentOpportunityId]);

  // Tính tổng kết giỏ hàng cơ hội
  const grandTotal = items.reduce(
    (sum, item) => sum + (item.finalLineTotal || 0),
    0,
  );
  const totalQuantity = items.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  // Xuất file excel báo giá nhanh
  const handleExportExcel = () => {
    if (items.length === 0) return alert("Không có dữ liệu để xuất.");
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Báo giá cơ hội");
    XLSX.writeFile(workbook, `Bao_Gia_Co_Hoi_ID_${currentOpportunityId}.xlsx`);
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/opportunity-items/${deleteTarget.id}`);
      if (selectedItem?.id === deleteTarget.id) setSelectedItem(null);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại, vui lòng kiểm tra lại.");
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-[#f8f9fa]">
        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-slate-200/60 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                arrow_back
              </span>
            </button>
            <h1 className="text-sm font-black text-slate-800 uppercase tracking-tight">
              Quản lý danh mục vật tư cơ hội #{currentOpportunityId}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="h-9 px-4 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/50 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-lg">
                download_folder
              </span>
              Xuất file Excel
            </button>
            <button
              onClick={() => {
                setEditItem(null);
                setModalOpen(true);
              }}
              className="h-9 px-4 rounded-xl text-xs font-bold text-white bg-linear-to-br from-primary to-primary-container shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-lg">add_box</span>
              Thêm mặt hàng mới
            </button>
          </div>
        </header>

        {/* Khung chính chia 2 vùng dạng Master - Detail */}
        <div className="flex flex-1 overflow-hidden">
          {/* VÙNG TRÁI: Bảng danh sách mặt hàng (Master) */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 h-10">
                    <th className="w-12 text-center text-[10px] font-black uppercase text-slate-400 tracking-wider pl-6">
                      STT
                    </th>
                    <th className="w-1/3 text-[10px] font-black uppercase text-slate-400 tracking-wider pl-4">
                      Tên mặt hàng / Vật tư
                    </th>
                    <th className="w-24 text-center text-[10px] font-black uppercase text-slate-400 tracking-wider pl-2">
                      Số lượng
                    </th>
                    <th className="w-32 text-right text-[10px] font-black uppercase text-slate-400 tracking-wider pl-2">
                      Đơn giá gốc
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
                    <th className="w-20 pr-6"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-20 text-center text-xs font-medium text-slate-400"
                      >
                        Đang tải dữ liệu giỏ hàng...
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-20 text-center text-xs font-medium text-slate-400"
                      >
                        Chưa có vật tư nào được gán cho cơ hội này. Vui lòng bấm
                        thêm mới.
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
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </main>

          {/* VÙNG PHẢI: Panel kiểm tra xem chi tiết + Tổng kết ngân sách (Detail Inspection) */}
          <aside className="hidden xl:block w-80 shrink-0 border-l border-slate-200/50 bg-[#f3f4f5]/50 overflow-y-auto p-6 space-y-6">
            {/* Tổng hợp ngân sách dự án toàn cục */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs space-y-4">
              <h3 className="text-[10px] font-black uppercase text-[#1A237E] tracking-wider border-b border-slate-100 pb-2">
                Tổng hợp ngân sách cơ hội
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    Tổng số lượng mặt hàng:
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
              <button className="w-full py-2.5 bg-[#000666] text-white rounded-xl font-bold text-xs tracking-wide hover:opacity-95 transition-all shadow-md">
                Chốt báo giá (Finalize Quote)
              </button>
            </div>

            {/* Chi tiết kĩ thuật của dòng đang click chọn (Inspection) */}
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
                        Đơn giá mua
                      </span>
                      <span className="font-mono text-slate-700 font-bold">
                        {fmt(selectedItem.unitPrice)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">
                        Thành tiền gốc
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
                        Tiền thuế VAT
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

      {/* Modal Thêm / Sửa */}
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

      {/* Modal Xác nhận xóa an toàn cấp độ z-200 giống ProductEdit */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-200 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center">
            <span className="material-symbols-outlined text-red-600 text-4xl mb-2">
              warning
            </span>
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
                className="px-4 py-1.5 text-xs font-bold text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteItem}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
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
