import React, { useState, useEffect } from "react";
import api from "../../lib/api";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import { Search, Package } from "lucide-react";

const LeadInterestModal = ({ isOpen, onClose, onSave, currentLead, products = [] }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && currentLead) {
      // Load danh sách ID sản phẩm đã chọn từ Lead hiện tại
      setSelectedIds(currentLead.productInterestIds || []);
      setSearchKeyword("");
    }
  }, [isOpen, currentLead]);

  const handleToggleProduct = (productId) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Mượn API Update Lead để cập nhật lại danh sách Sản phẩm (Giữ nguyên các data khác)
      const payload = {
        fullName: currentLead.fullName,
        companyName: currentLead.companyName,
        phone: currentLead.phone,
        email: currentLead.email,
        website: currentLead.website,
        taxCode: currentLead.taxCode,
        citizenId: currentLead.citizenId,
        address: currentLead.address,
        provinceId: currentLead.provinceId,
        branchId: currentLead.branchId,
        sourceId: currentLead.sourceId,
        campaignId: currentLead.campaignId,
        statusId: currentLead.statusId,
        assignedTo: currentLead.assignedTo,
        expectedRevenue: currentLead.expectedRevenue,
        description: currentLead.description,
        productInterestIds: selectedIds, // 🌟 CHỈ CẬP NHẬT TRƯỜNG NÀY
      };

      await api.put(`/leads/${currentLead.id}`, payload);
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật sản phẩm thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lọc sản phẩm theo thanh tìm kiếm
  const filteredProducts = products.filter((p) =>
    (p.name || p.productName || "").toLowerCase().includes(searchKeyword.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-slide-up">
        
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-blue-600" /> Cập nhật Sản phẩm quan tâm
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined block">close</span>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm nhanh sản phẩm..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm bg-slate-50 focus:bg-white transition-colors"
            />
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden h-[300px] flex flex-col">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase flex justify-between">
              <span>Danh sách sản phẩm</span>
              <span>Đã chọn: {selectedIds.length}</span>
            </div>
            <div className="overflow-y-auto p-2 custom-scrollbar flex-1 bg-white">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer rounded-lg transition-colors border-b border-slate-50 last:border-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.id)}
                      onChange={() => handleToggleProduct(p.id)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                    />
                    <span className={`text-sm ${selectedIds.includes(p.id) ? 'font-bold text-blue-700' : 'text-slate-700 font-medium'}`}>
                      {p.name || p.productName}
                    </span>
                  </label>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm italic">
                  Không tìm thấy sản phẩm phù hợp.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <Button variant="cancel" onClick={onClose} disabled={isSubmitting} className="bg-white border text-sm">
            Hủy bỏ
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting} className="text-sm shadow-md bg-blue-700 hover:bg-blue-800">
            {isSubmitting ? "Đang lưu..." : "Lưu danh sách"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeadInterestModal;