import React, { useState, useEffect } from "react";
import api from "../../lib/api";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import { ArrowRight, ArrowLeft, CheckCircle2, Package, Search, X, CircleDollarSign } from "lucide-react"; // Import thêm icon Tiền

// 🌟 Hàm format tiền tệ VNĐ
const formatMoney = (amount) => {
  if (!amount) return "0 đ";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const LeadFormModal = ({
  isOpen,
  onClose,
  onSave,
  currentLead,
  statuses,
  sources,
  campaigns,
  branchProvinces = [],
  users = [],
  currentUser,
}) => {
  const isEditMode = !!currentLead;
  const isAdminOrManager = currentUser?.roleId === 1 || currentUser.roleId === 4;

  const [step, setStep] = useState(1); 

  const branches = Array.from(new Map(branchProvinces.map((bp) => [bp.branchId, { id: bp.branchId, name: bp.branchName }])).values());
  const allProvinces = Array.from(new Map(branchProvinces.map((bp) => [bp.provinceId, { id: bp.provinceId, name: bp.provinceName }])).values());

  const availableProvinces = isAdminOrManager
    ? allProvinces
    : allProvinces.filter((p) => branchProvinces.some((bp) => String(bp.branchId) === String(currentUser?.branchId) && String(bp.provinceId) === String(p.id)));

  const [formData, setFormData] = useState({
    fullName: "", companyName: "", phone: "", email: "", website: "",
    taxCode: "", citizenId: "", address: "", expectedRevenue: "", description: "",
    sourceId: "", campaignId: "", statusId: 1, provinceId: "", branchId: "", assignedTo: "",
    productInterestIds: [], 
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [productKeyword, setProductKeyword] = useState("");
  const [defaultProducts, setDefaultProducts] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [isSearchingProduct, setIsSearchingProduct] = useState(false);

  // STATE CHỨA THÔNG TIN CÁC SẢN PHẨM ĐÃ CHỌN ĐỂ HIỂN THỊ TAGS VÀ TÍNH TIỀN
  const [selectedProductDetails, setSelectedProductDetails] = useState([]);

  const availableUsers = users.filter((u) => {
    if (!formData.branchId) return false;
    return String(u.branchId) === String(formData.branchId);
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setProductKeyword("");
      setErrors({});
      
      if (currentLead) {
        setFormData({
          fullName: currentLead.fullName || "", companyName: currentLead.companyName || "", phone: currentLead.phone || "",
          email: currentLead.email || "", website: currentLead.website || "", taxCode: currentLead.taxCode || "",
          citizenId: currentLead.citizenId || "", address: currentLead.address || "", expectedRevenue: currentLead.expectedRevenue || "",
          description: currentLead.description || "", sourceId: currentLead.sourceId || "", campaignId: currentLead.campaignId || "",
          statusId: currentLead.statusId || 1, provinceId: currentLead.provinceId || "", branchId: currentLead.branchId || "",
          assignedTo: currentLead.assignedTo || "",
          productInterestIds: currentLead.productInterestIds || [], 
        });

        if (currentLead.productInterestIds && currentLead.productInterestIds.length > 0) {
          Promise.allSettled(currentLead.productInterestIds.map(id => api.get(`/products/${id}`)))
            .then(results => {
              const loadedDetails = [];
              results.forEach((res, index) => {
                if (res.status === 'fulfilled' && res.value.data) {
                  loadedDetails.push(res.value.data);
                } else {
                  loadedDetails.push({ 
                    id: currentLead.productInterestIds[index], 
                    name: `Sản phẩm #${currentLead.productInterestIds[index]}`,
                    basePrice: 0 // Gán mặc định 0 nếu không tìm thấy
                  });
                }
              });
              setSelectedProductDetails(loadedDetails);
            });
        } else {
          setSelectedProductDetails([]);
        }

      } else {
        setFormData({
          fullName: "", companyName: "", phone: "", email: "", website: "", taxCode: "", citizenId: "", address: "", expectedRevenue: "", description: "",
          sourceId: "", campaignId: "", statusId: 1, provinceId: "", branchId: currentUser?.branchId || "", assignedTo: currentUser?.id || "",
          productInterestIds: [], 
        });
        setSelectedProductDetails([]);
      }
    }
  }, [currentLead, isOpen, currentUser]);

  // 🌟 ĐỈNH CAO UX: TỰ ĐỘNG TÍNH LẠI TỔNG TIỀN MỖI KHI MẢNG SẢN PHẨM THAY ĐỔI
  useEffect(() => {
    // Dùng reduce quét toàn bộ mảng tính tổng, tránh sai số âm/dương khi cộng trừ thủ công
    const totalRevenue = selectedProductDetails.reduce((sum, product) => {
      const price = parseFloat(product.basePrice) || 0;
      return sum + price;
    }, 0);

    setFormData(prev => ({
      ...prev,
      expectedRevenue: totalRevenue > 0 ? totalRevenue : "" // Cập nhật lại form data
    }));
  }, [selectedProductDetails]);


  useEffect(() => {
    if (!isEditMode && isAdminOrManager && formData.provinceId) { 
      const mapping = branchProvinces.find((bp) => String(bp.provinceId) === String(formData.provinceId));
      if (mapping && String(mapping.branchId) !== String(formData.branchId)) {
        setFormData((prev) => ({ ...prev, branchId: mapping.branchId, assignedTo: "" }));
      }
    }
  }, [formData.provinceId, isAdminOrManager, branchProvinces, isEditMode]);

  useEffect(() => {
    if (formData.branchId && formData.assignedTo) {
      const isUserInBranch = users.some((u) => String(u.id) === String(formData.assignedTo) && String(u.branchId) === String(formData.branchId));
      if (!isUserInBranch) setFormData((prev) => ({ ...prev, assignedTo: "" }));
    }
  }, [formData.branchId, users]);

  useEffect(() => {
    if (step === 2 && defaultProducts.length === 0) {
      setIsSearchingProduct(true);
      api.get("/products") 
        .then(res => {
          const allProds = res.data?.content || res.data || [];
          setDefaultProducts(allProds.slice(0, 20)); 
        })
        .catch(err => console.error(err))
        .finally(() => setIsSearchingProduct(false));
    }
  }, [step]);

  useEffect(() => {
    if (step !== 2) return;
    if (!productKeyword.trim()) {
      setSearchedProducts([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      setIsSearchingProduct(true);
      try {
        const res = await api.get('/products/search', { params: { keyword: productKeyword.trim() } });
        setSearchedProducts(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearchingProduct(false);
      }
    }, 500); 

    return () => clearTimeout(timeoutId);
  }, [productKeyword, step]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Bắt buộc";
    if (formData.phone && !/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(formData.phone)) newErrors.phone = "SĐT sai";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleProductChange = (productObj) => {
    const productId = productObj.id;
    
    // 1. Cập nhật mảng IDs (cho Backend)
    setFormData((prev) => {
      const currentIds = prev.productInterestIds || [];
      if (currentIds.includes(productId)) {
        return { ...prev, productInterestIds: currentIds.filter(id => String(id) !== String(productId)) };
      } else {
        return { ...prev, productInterestIds: [...currentIds, productId] };
      }
    });

    // 2. Cập nhật mảng Object (cho Frontend tính tiền & hiển thị)
    setSelectedProductDetails((prev) => {
      const isExists = prev.some(p => String(p.id) === String(productId));
      if (isExists) {
        return prev.filter(p => String(p.id) !== String(productId));
      } else {
        return [...prev, productObj];
      }
    });
  };

  const handleNextStep = () => {
    if (validateForm()) setStep(2);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        expectedRevenue: formData.expectedRevenue ? parseFloat(formData.expectedRevenue) : null,
        statusId: formData.statusId ? parseInt(formData.statusId) : null,
        sourceId: formData.sourceId ? parseInt(formData.sourceId) : null,
        campaignId: formData.campaignId ? parseInt(formData.campaignId) : null,
        provinceId: formData.provinceId ? parseInt(formData.provinceId) : null,
        branchId: formData.branchId ? parseInt(formData.branchId) : null,
        assignedTo: isAdminOrManager ? (formData.assignedTo ? parseInt(formData.assignedTo) : null) : currentUser.id,
      };

      if (isEditMode) await api.put(`/leads/${currentLead.id}`, payload);
      else await api.post("/leads", payload);

      onSave(); onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi kết nối hoặc xử lý dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const displayProducts = productKeyword.trim() ? searchedProducts : defaultProducts;
  const unselectedDisplayProducts = displayProducts.filter(p => !(formData.productInterestIds || []).includes(p.id));

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[1000px] flex flex-col overflow-hidden animate-slide-up max-h-[95vh]">
        
        {/* HEADER: WIZARD PROGRESS */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              {isEditMode ? "Sửa Tiềm năng" : "Thêm Lead mới"}
              <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full ml-2">
                Bước {step}/2
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-1">
              {step === 1 ? "Cập nhật thông tin cơ bản của khách hàng." : "Cập nhật các sản phẩm khách hàng quan tâm (Tùy chọn)."}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors outline-none">
            <span className="material-symbols-outlined block text-[24px]">close</span>
          </button>
        </div>

        {/* BODY WIZARD */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white relative">
          
          {/* ================= BƯỚC 1: THÔNG TIN CƠ BẢN ================= */}
          <div className={`transition-all duration-300 ${step === 1 ? "block opacity-100 translate-x-0" : "hidden opacity-0 -translate-x-full"}`}>
            <form id="leadFormStep1" className="p-8 grid grid-cols-4 gap-x-5 gap-y-4">
              <div className="col-span-2 relative">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Họ và Tên <span className="text-red-500">*</span></label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} autoFocus className={`w-full px-3 py-2 border rounded-lg focus:border-blue-500 outline-none text-[12px] transition-all ${errors.fullName ? "border-red-500 bg-red-50" : "border-slate-300"}`} />
                {errors.fullName && <p className="text-red-500 text-[10px] absolute mt-0.5">{errors.fullName}</p>}
              </div>
              <div className="col-span-1 relative">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Điện thoại</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:border-blue-500 outline-none text-[12px] transition-all ${errors.phone ? "border-red-500 bg-red-50" : "border-slate-300"}`} />
                {errors.phone && <p className="text-red-500 text-[10px] absolute mt-0.5">{errors.phone}</p>}
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Email</label>
                <input type="text" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 outline-none text-[12px]" />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Tên công ty (B2B)</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 outline-none text-[12px]" />
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Mã số thuế</label>
                <input type="text" name="taxCode" value={formData.taxCode} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 outline-none text-[12px]" />
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">CCCD/CMND</label>
                <input type="text" name="citizenId" value={formData.citizenId} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 outline-none text-[12px]" />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Khu vực (Tỉnh/Thành)</label>
                <select name="provinceId" value={formData.provinceId} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white cursor-pointer focus:border-blue-500 text-[12px]">
                  <option value="">-- Tỉnh thành --</option>
                  {availableProvinces?.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Địa chỉ chi tiết</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 outline-none text-[12px]" />
              </div>

              <div className="col-span-4 mt-2 border-t border-slate-100 pt-4"></div>

              <div className="col-span-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Nguồn khách hàng</label>
                <select name="sourceId" value={formData.sourceId} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white cursor-pointer text-[12px]">
                  <option value="">Tự nhiên</option>
                  {sources?.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Chiến dịch Marketing</label>
                <select name="campaignId" value={formData.campaignId} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white cursor-pointer text-[12px]">
                  <option value="">Không có</option>
                  {campaigns?.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Trạng thái xử lý</label>
                <select name="statusId" value={formData.statusId} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white cursor-pointer text-[12px] font-bold text-blue-700 focus:border-blue-500">
                  {statuses?.filter((s) => s.id !== 3 && s.name !== "Đã chuyển đổi").map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              
              {/* 🌟 ĐÃ KHÓA (READONLY) Ô NHẬP TIỀN */}
              <div className="col-span-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex justify-between">
                  Doanh thu dự kiến
                </label>
                <div className="relative">
                  <input 
                    type="text" // Chuyển sang text để dễ format hiển thị dấu phẩy
                    value={formData.expectedRevenue ? formatMoney(formData.expectedRevenue) : ""} 
                    readOnly
                    placeholder="Tự động tính..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-slate-100 text-slate-500 cursor-not-allowed font-bold text-[12px]" 
                  />
                </div>
              </div>

              {isAdminOrManager ? (
                <>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1">Chi nhánh quản lý</label>
                    <select name="branchId" value={formData.branchId} onChange={handleChange} className="w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg outline-none cursor-pointer text-[12px]">
                      <option value="">Tự do</option>
                      {branches?.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1">Người đảm nhận (Theo Chi nhánh)</label>
                    <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg outline-none cursor-pointer text-[12px]">
                      <option value="">Chưa phân bổ (Để trống)</option>
                      {availableUsers?.map((u) => (<option key={u.id} value={u.id}>{u.fullName}</option>))}
                    </select>
                  </div>
                </>
              ) : (
                <div className="col-span-4"></div>
              )}

              <div className="col-span-4">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Ghi chú nghiệp vụ</label>
                <textarea name="description" rows="2" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none resize-none text-[12px] focus:border-blue-500" placeholder="Thông tin lưu ý thêm..."></textarea>
              </div>
            </form>
          </div>

          {/* ================= BƯỚC 2: SẢN PHẨM QUAN TÂM ================= */}
          <div className={`transition-all duration-300 p-8 ${step === 2 ? "block opacity-100 translate-x-0" : "hidden opacity-0 translate-x-full"}`}>
            
            {/* 🌟 HEADER CÓ HIỂN THỊ TỔNG TIỀN */}
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
               <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                 <Package className="text-blue-600" size={20}/> 
                 Chọn sản phẩm Lead quan tâm
               </h3>
               
               <div className="flex gap-2 items-center">
                 {formData.productInterestIds.length > 0 && (
                   <span className="px-3 py-1 bg-green-100 text-green-700 text-[11px] font-bold rounded-full flex items-center gap-1 border border-green-200 shadow-sm">
                     <CheckCircle2 size={14}/> Đã chọn {formData.productInterestIds.length}
                   </span>
                 )}
                 <span className="px-3 py-1.5 bg-amber-50 text-amber-700 text-[12px] font-bold rounded-lg flex items-center gap-1 border border-amber-200 shadow-sm">
                   <CircleDollarSign size={15}/> 
                   Tổng dự kiến: {formatMoney(formData.expectedRevenue)}
                 </span>
               </div>
            </div>

            {/* THẺ TAGS: CÁC SẢN PHẨM ĐÃ CHỌN */}
            {selectedProductDetails.length > 0 && (
              <div className="mb-6">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase mb-2">Đang chọn ({selectedProductDetails.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProductDetails.map(p => (
                    <div 
                      key={`selected-${p.id}`} 
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-[12px] font-bold shadow-sm transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-200 cursor-pointer group"
                      onClick={() => handleProductChange(p)}
                      title="Nhấn để bỏ chọn"
                    >
                      <span className="truncate max-w-[200px]">{p.productName || p.name}</span>
                      <X size={14} className="text-blue-400 group-hover:text-red-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Gõ tên sản phẩm để tìm trên hệ thống (10.000+ sản phẩm)..."
                value={productKeyword}
                onChange={(e) => setProductKeyword(e.target.value)}
                autoFocus={step === 2}
                className="w-full pl-9 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-[13px] bg-slate-50 focus:bg-white shadow-sm transition-all"
              />
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col h-[280px]">
              <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase flex justify-between">
                <span>{productKeyword ? "Kết quả tìm kiếm" : "Gợi ý sản phẩm nổi bật"}</span>
                {isSearchingProduct && <span className="text-blue-500">Đang tìm...</span>}
              </div>

              <div className="flex-1 overflow-y-auto p-2 custom-scrollbar bg-white grid grid-cols-2 md:grid-cols-3 gap-2 content-start">
                {!isSearchingProduct && unselectedDisplayProducts.length > 0 ? (
                  unselectedDisplayProducts.map((p) => (
                    <label key={`suggest-${p.id}`} className="flex items-start gap-2 text-[12px] cursor-pointer p-2.5 rounded-lg transition-all border bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50">
                      <input
                        type="checkbox"
                        className="w-4 h-4 mt-[1px] text-blue-600 rounded border-slate-300 cursor-pointer"
                        checked={false} 
                        onChange={() => handleProductChange(p)}
                      />
                      <span className="font-medium leading-tight text-slate-700">
                        {p.productName || p.name} 
                        <br/>
                        <span className="text-[10px] text-amber-600 font-bold">{formatMoney(p.basePrice)}</span>
                      </span>
                    </label>
                  ))
                ) : (
                  !isSearchingProduct && <div className="col-span-full text-center py-10 text-slate-400 text-[12px] italic">Không có sản phẩm để hiển thị.</div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* FOOTER WIZARD */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 shrink-0 rounded-b-2xl">
          <div>
            {step === 1 ? (
              <button type="button" onClick={onClose} className="px-5 py-2.5 border border-slate-300 bg-white text-slate-700 rounded-lg hover:bg-slate-100 text-xs font-bold transition-colors outline-none">
                Hủy bỏ
              </button>
            ) : (
              <button type="button" onClick={() => setStep(1)} className="px-5 py-2.5 border border-slate-300 bg-white text-slate-700 rounded-lg hover:bg-slate-100 text-xs font-bold flex items-center justify-center flex-nowrap whitespace-nowrap gap-2 transition-colors outline-none">
                <ArrowLeft size={16} /> Quay lại
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
             {step === 1 ? (
               <>
                 <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-5 py-2.5 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors outline-none disabled:opacity-60 disabled:cursor-not-allowed">
                   Lưu ngay (Bỏ qua Sản phẩm)
                 </button>
                 <button type="button" onClick={handleNextStep} className="px-5 py-2.5 bg-blue-700 text-white hover:bg-blue-800 rounded-lg text-xs font-bold shadow-md flex items-center justify-center flex-nowrap whitespace-nowrap gap-2 transition-colors outline-none">
                   Chọn sản phẩm <ArrowRight size={16} />
                 </button>
               </>
             ) : (
               <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-2.5 bg-blue-700 text-white hover:bg-blue-800 rounded-lg text-xs font-bold shadow-md flex items-center justify-center flex-nowrap whitespace-nowrap gap-2 transition-colors outline-none disabled:opacity-60 disabled:cursor-not-allowed">
                 {isSubmitting ? "Đang xử lý..." : "Hoàn tất & Lưu dữ liệu"}
               </button>
             )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default LeadFormModal;