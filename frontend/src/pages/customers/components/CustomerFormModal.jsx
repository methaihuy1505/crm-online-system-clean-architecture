import React, { useState, useEffect } from "react";
import api from "../../../lib/api";
import Button from "../../../components/ui/Button";
import toast from "react-hot-toast";
import { Building2, PhoneCall, Settings2 } from "lucide-react";

const CustomerFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  statuses,
  ranks,
  sources,
  campaigns,
  branchProvinces = [],
}) => {
  const isEditMode = !!initialData;

  const [currentUser] = useState(() => JSON.parse(localStorage.getItem("currentUser")) || { roleId: 3, id: 1, branchId: 1 });
  const currentUserId = Number(currentUser.id);
  const isAdminOrManager = [1, 4].includes(Number(currentUser.roleId));

  const [users, setUsers] = useState([]);

  const branches = Array.from(new Map(branchProvinces.map((bp) => [bp.branchId, { id: bp.branchId, name: bp.branchName }])).values());
  const allProvinces = Array.from(new Map(branchProvinces.map((bp) => [bp.provinceId, { id: bp.provinceId, name: bp.provinceName }])).values());

  const availableProvinces = isAdminOrManager
    ? allProvinces
    : allProvinces.filter((p) => branchProvinces.some((bp) => String(bp.branchId) === String(currentUser?.branchId) && String(bp.provinceId) === String(p.id)));

  const [formData, setFormData] = useState({
    name: "", shortName: "", isOrganization: true, taxCode: "", citizenId: "",
    foundedDate: "", website: "", emailOfficial: "", mainPhone: "", fax: "",
    addressCompany: "", addressBilling: "", description: "",
    statusId: 1, rankId: "", sourceId: "", campaignId: "", provinceId: "", branchId: "",
    assignedUserId: currentUserId, 
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableUsers = users.filter((u) => {
    if (!formData.branchId) return false;
    return String(u.branchId) === String(formData.branchId);
  });

  useEffect(() => {
    if (isOpen && isAdminOrManager) {
      api.get("/users", { params: { size: 1000 } })
        .then(res => setUsers(res.data?.content || res.data || []))
        .catch(err => console.error("Lỗi tải nhân viên:", err));
    }
  }, [isOpen, isAdminOrManager]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape" && isOpen) onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || "", shortName: initialData.shortName || "",
          isOrganization: initialData.isOrganization ?? true,
          taxCode: initialData.taxCode || "", citizenId: initialData.citizenId || "",
          foundedDate: initialData.foundedDate || "", website: initialData.website || "",
          emailOfficial: initialData.emailOfficial || "", mainPhone: initialData.mainPhone || "",
          fax: initialData.fax || "", addressCompany: initialData.addressCompany || "",
          addressBilling: initialData.addressBilling || "", description: initialData.description || "",
          statusId: initialData.statusId || 1, rankId: initialData.rankId || "",
          sourceId: initialData.sourceId || "", campaignId: initialData.campaignId || "",
          provinceId: initialData.provinceId || "", branchId: initialData.branchId || "",
          assignedUserId: initialData.assignedUserId || currentUserId,
        });
      } else {
        setFormData({
          name: "", shortName: "", isOrganization: true, taxCode: "", citizenId: "",
          foundedDate: "", website: "", emailOfficial: "", mainPhone: "", fax: "",
          addressCompany: "", addressBilling: "", description: "",
          statusId: 1, rankId: "", sourceId: "", campaignId: "", 
          provinceId: "", branchId: currentUser.branchId || "", assignedUserId: "", // Mặc định bỏ trống nếu muốn
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData, currentUserId, currentUser.branchId]); 

  useEffect(() => {
    if (!isEditMode && isAdminOrManager && formData.provinceId) {
      const mapping = branchProvinces.find((bp) => String(bp.provinceId) === String(formData.provinceId));
      if (mapping) {
        setFormData((prev) => {
          if (String(prev.branchId) !== String(mapping.branchId)) {
            return { ...prev, branchId: mapping.branchId, assignedUserId: "" };
          }
          return prev;
        });
      }
    }
  }, [formData.provinceId, isAdminOrManager, branchProvinces, isEditMode]);

  useEffect(() => {
    if (formData.branchId) {
      setFormData(prev => {
        if (!prev.assignedUserId) return prev;
        const isUserInBranch = users.some(
          (u) => String(u.id) === String(prev.assignedUserId) && String(u.branchId) === String(formData.branchId)
        );
        return isUserInBranch ? prev : { ...prev, assignedUserId: "" };
      });
    }
  }, [formData.branchId, users]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Bắt buộc";
    if (!formData.mainPhone.trim()) newErrors.mainPhone = "Bắt buộc";
    
    // ĐÃ XÓA VALIDATE BẮT BUỘC NGƯỜI PHỤ TRÁCH CHO ADMIN/MANAGER
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      // 🌟 ĐÃ SỬA: Nếu Admin bỏ trống -> null, Nếu là Sale -> currentUserId
      const payload = {
        ...formData,
        statusId: formData.statusId ? Number(formData.statusId) : null,
        rankId: formData.rankId ? Number(formData.rankId) : null,
        sourceId: formData.sourceId ? Number(formData.sourceId) : null,
        campaignId: formData.campaignId ? Number(formData.campaignId) : null,
        provinceId: formData.provinceId ? Number(formData.provinceId) : null,
        branchId: formData.branchId ? Number(formData.branchId) : null,
        assignedUserId: isAdminOrManager ? (formData.assignedUserId ? Number(formData.assignedUserId) : null) : currentUserId,
      };

      if (isEditMode) await api.put(`/customers/${initialData.id}`, payload);
      else await api.post("/customers", payload);
      
      onSuccess(); onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi lưu khách hàng!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnterToNext = (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
      const formElements = Array.from(e.target.form.elements);
      const index = formElements.indexOf(e.target);
      if (formElements[index + 1]) formElements[index + 1].focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[1100px] max-h-[95vh] rounded-2xl shadow-2xl flex flex-col animate-slide-up border border-slate-200">
        
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl shrink-0">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditMode ? "Cập nhật Khách hàng" : "Thêm mới Khách hàng"}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-red-500 rounded-full transition-colors outline-none" title="Đóng (Esc)">
            <span className="material-symbols-outlined text-[20px] block">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form id="customerForm" onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* CỘT 1: THÔNG TIN CƠ BẢN */}
            <div className="space-y-4">
              <h4 className="text-[12px] font-bold text-blue-800 border-b border-blue-100 pb-2 flex items-center gap-2 uppercase tracking-wider">
                <Building2 size={16} /> Thông tin cơ bản
              </h4>
              
              <div className="flex items-center gap-6 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-700 cursor-pointer">
                  <input type="radio" name="isOrganization" checked={formData.isOrganization === true} onChange={() => setFormData((p) => ({ ...p, isOrganization: true, citizenId: "" }))} className="w-3.5 h-3.5 text-primary" />
                  Doanh nghiệp
                </label>
                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-700 cursor-pointer">
                  <input type="radio" name="isOrganization" checked={formData.isOrganization === false} onChange={() => setFormData((p) => ({ ...p, isOrganization: false, taxCode: "" }))} className="w-3.5 h-3.5 text-primary" />
                  Cá nhân
                </label>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Tên khách hàng <span className="text-red-500">*</span></label>
                </div>
                <input type="text" name="name" value={formData.name} onChange={handleChange} onKeyDown={handleEnterToNext} autoFocus className={`w-full px-3 py-2 border rounded-lg outline-none text-[12px] transition-all ${errors.name ? "border-red-500 bg-red-50" : "border-slate-300 focus:border-blue-500"}`} placeholder="Ví dụ: Công ty TNHH VTI..." />
                {errors.name && <p className="text-red-500 text-[10px] mt-0.5">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Tên viết tắt</label>
                  <input type="text" name="shortName" value={formData.shortName} onChange={handleChange} onKeyDown={handleEnterToNext} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-[12px] focus:border-blue-500" placeholder="VD: VTI" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">{formData.isOrganization ? "Mã số thuế" : "CCCD/CMND"}</label>
                  {formData.isOrganization ? (
                    <input type="text" name="taxCode" value={formData.taxCode} onChange={handleChange} onKeyDown={handleEnterToNext} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-[12px] focus:border-blue-500" placeholder="Nhập MST..." />
                  ) : (
                    <input type="text" name="citizenId" value={formData.citizenId} onChange={handleChange} onKeyDown={handleEnterToNext} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-[12px] focus:border-blue-500" placeholder="Nhập CCCD..." />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Ngày {formData.isOrganization ? "thành lập" : "sinh"}</label>
                  <input type="date" name="foundedDate" value={formData.foundedDate} onChange={handleChange} onKeyDown={handleEnterToNext} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-[12px] focus:border-blue-500 bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Khu vực (Tỉnh/Thành)</label>
                  <select name="provinceId" value={formData.provinceId || ""} onChange={handleChange} onKeyDown={handleEnterToNext} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white cursor-pointer focus:border-blue-500 text-[12px]">
                    <option value="">-- Chọn tỉnh thành --</option>
                    {availableProvinces?.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                  </select>
                </div>
              </div>
            </div>

            {/* CỘT 2: THÔNG TIN LIÊN LẠC */}
            <div className="space-y-4">
              <h4 className="text-[12px] font-bold text-blue-800 border-b border-blue-100 pb-2 flex items-center gap-2 uppercase tracking-wider">
                <PhoneCall size={16} /> Liên hệ & Địa chỉ
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">SĐT chính <span className="text-red-500">*</span></label>
                  <input type="text" name="mainPhone" value={formData.mainPhone} onChange={handleChange} onKeyDown={handleEnterToNext} className={`w-full px-3 py-2 border rounded-lg outline-none text-[12px] transition-all ${errors.mainPhone ? "border-red-500 bg-red-50" : "border-slate-300 focus:border-blue-500"}`} placeholder="090..." />
                  {errors.mainPhone && <p className="text-red-500 text-[10px] mt-0.5">{errors.mainPhone}</p>}
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Email</label>
                  <input type="email" name="emailOfficial" value={formData.emailOfficial} onChange={handleChange} onKeyDown={handleEnterToNext} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-[12px] focus:border-blue-500" placeholder="email@..." />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Website</label>
                  <input type="text" name="website" value={formData.website} onChange={handleChange} onKeyDown={handleEnterToNext} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-[12px] focus:border-blue-500" placeholder="www..." />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Số Fax</label>
                  <input type="text" name="fax" value={formData.fax} onChange={handleChange} onKeyDown={handleEnterToNext} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-[12px] focus:border-blue-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase">Trụ sở chính</label>
                <input type="text" name="addressCompany" value={formData.addressCompany} onChange={handleChange} onKeyDown={handleEnterToNext} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-[12px] focus:border-blue-500" placeholder="Số nhà, đường..." />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase">Địa chỉ thanh toán</label>
                <input type="text" name="addressBilling" value={formData.addressBilling} onChange={handleChange} onKeyDown={handleEnterToNext} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-[12px] focus:border-blue-500" placeholder="Bỏ trống nếu trùng trụ sở..." />
              </div>
            </div>

            {/* CỘT 3: HỆ THỐNG */}
            <div className="space-y-4 bg-slate-50 border border-slate-200 p-5 rounded-xl shadow-inner">
              <h4 className="text-[12px] font-bold text-blue-800 border-b border-blue-100 pb-2 flex items-center gap-2 uppercase tracking-wider">
                <Settings2 size={16} /> Hệ thống quản lý
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Trạng thái</label>
                  <select name="statusId" value={formData.statusId || ""} onChange={handleChange} onKeyDown={handleEnterToNext} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-[12px] font-bold text-blue-700 bg-white focus:border-blue-500">
                    {statuses?.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Xếp hạng</label>
                  <select name="rankId" value={formData.rankId || ""} onChange={handleChange} onKeyDown={handleEnterToNext} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-[12px] bg-white focus:border-blue-500">
                    <option value="">- Chọn -</option>
                    {ranks?.map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Nguồn gốc</label>
                  <select name="sourceId" value={formData.sourceId || ""} onChange={handleChange} onKeyDown={handleEnterToNext} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-[12px] bg-white focus:border-blue-500">
                    <option value="">- Tự nhiên -</option>
                    {sources?.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Chiến dịch</label>
                  <select name="campaignId" value={formData.campaignId || ""} onChange={handleChange} onKeyDown={handleEnterToNext} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-[12px] bg-white focus:border-blue-500">
                    <option value="">- Không -</option>
                    {campaigns?.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>
              </div>

              {isAdminOrManager && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-blue-600 uppercase">Chi nhánh phụ trách</label>
                  <select name="branchId" value={formData.branchId || ""} onChange={handleChange} className="w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg outline-none cursor-pointer text-[12px]">
                    <option value="">-- Chọn chi nhánh --</option>
                    {branches?.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
                  </select>
                </div>
              )}

              <div className="space-y-1 pt-2 border-t border-slate-200">
                <label className="block text-[11px] font-bold text-slate-500 uppercase">
                  Người phụ trách
                </label>
                {isAdminOrManager ? (
                  <select name="assignedUserId" value={formData.assignedUserId || ""} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg outline-none text-[12px] font-bold bg-white transition-all ${errors.assignedUserId ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-blue-500'}`}>
                    <option value="">-- Chọn nhân viên --</option>
                    {availableUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.fullName}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-[12px] font-semibold text-slate-600">
                    Gán tự động: Chính bạn
                  </div>
                )}
                {errors.assignedUserId && <p className="text-red-500 text-[10px] mt-0.5">{errors.assignedUserId}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase">Ghi chú thêm</label>
                <textarea name="description" rows="2" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white resize-none text-[12px] focus:border-blue-500" placeholder="Thông tin lưu ý..."></textarea>
              </div>
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl shrink-0">
          <Button variant="cancel" type="button" onClick={onClose} disabled={isSubmitting} className="bg-white border border-slate-300 text-[12px] px-6 font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all rounded-[5px]">
            Hủy bỏ (Esc)
          </Button>
          <Button variant="primary" type="submit" form="customerForm" disabled={isSubmitting} className="text-[12px] px-8 font-bold shadow-md bg-blue-700 hover:bg-blue-800 flex items-center gap-2 rounded-[5px]">
            {isSubmitting ? <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> Đang xử lý</> : <><span className="material-symbols-outlined text-[16px]">save</span> Ghi nhận</>}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default CustomerFormModal;