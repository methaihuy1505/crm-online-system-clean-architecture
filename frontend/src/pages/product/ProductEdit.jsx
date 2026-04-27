import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
// Cấu hình base URL cho axios
const api = axios.create({
  baseURL: "http://localhost:8080/api/v1", // Thay đổi domain của bạn ở đây
});

const iconStyle = {
  fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
  verticalAlign: "middle",
};

const SIDEBAR_ITEMS = [
  { icon: "inventory_2", label: "Product List", active: true },
  { icon: "category", label: "Categories" },
  { icon: "fact_check", label: "Inventory Audit" },
  { icon: "conveyor_belt", label: "Suppliers" },
  { icon: "payments", label: "Price Lists" },
];

function DeleteModal({ onConfirm, onCancel, productName }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
        onClick={onCancel}
      ></div>
      <div className="relative bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-center w-16 h-16 bg-[#ffdad6] rounded-full mb-6 mx-auto">
          <span
            className="material-symbols-outlined text-[#ba1a1a] text-3xl"
            style={iconStyle}
          >
            warning
          </span>
        </div>
        <h2
          className="text-2xl font-extrabold text-center mb-2"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Xác nhận xóa?
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa{" "}
          <span className="font-bold text-[#191c1d]">{productName}</span>?
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-3 bg-[#ba1a1a] text-white rounded-lg font-bold shadow-lg"
          >
            Xóa tài sản
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 bg-[#e7e8e9] text-[#191c1d] font-semibold rounded-lg"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditProduct() {
  // Mặc định ID 14 theo ví dụ của bạn
  const { id } = useParams(); // Lấy id từ URL
  const productId = Number(id); // Chuyển sang kiểu số

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [uoms, setUoms] = useState([]);
  const navigate = useNavigate(); // Hook dùng để chuyển trang
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(""); // Để hiển thị ảnh tạm thời
  const [form, setForm] = useState({
    id: null,
    productCode: "",
    name: "",
    categoryId: "",
    productType: "PHYSICAL",
    uomId: "",
    description: "",
    basePrice: 0,
    vatRate: 0,
    depositOverride: 0,
    imageUrl: "",
    status: "ACTIVE", // Backend của bạn chưa có status trong JSON mẫu nhưng UI cần
  });

  // 1. Fetch dữ liệu khi load trang
  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      try {
        const [prodRes, catRes, uomRes] = await Promise.all([
          api.get(`/products/${productId}`),
          api.get("/product-categories"),
          api.get("/uoms"),
        ]);

        setForm(prodRes.data);
        setCategories(catRes.data);
        setUoms(uomRes.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        alert("Không thể tải dữ liệu sản phẩm!");
        navigate("/productpage");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, navigate]);

  // 2. Xử lý Save Changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Tạo đường dẫn tạm thời để hiển thị ảnh ngay lập tức trên UI
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleSave = async () => {
    try {
      const formData = new FormData();

      const productData = {
        productCode: form.productCode,
        name: form.name,
        categoryId: parseInt(form.categoryId),
        uomId: parseInt(form.uomId),
        productType: form.productType,
        basePrice: parseFloat(form.basePrice),
        vatRate: parseFloat(form.vatRate),
        depositOverride: parseFloat(form.depositOverride),
        description: form.description,
        imageUrl: form.imageUrl,
      };

      formData.append(
        "product",
        new Blob([JSON.stringify(productData)], { type: "application/json" }),
      );

      // SỬ DỤNG BIẾN selectedFile TẠI ĐÂY
      if (selectedFile) {
        formData.append("images", selectedFile);
      }

      const response = await api.put(`/products/${form.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Cập nhật thành công!");
      setForm(response.data);
      setSelectedFile(null); // Reset file sau khi lưu
      navigate("/productpage");
    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      alert("Có lỗi xảy ra khi lưu!");
    }
  };
  // 3. Xử lý Delete
  const handleDelete = async () => {
    try {
      await api.delete(`/products/${form.id}`);
      alert("Đã xóa sản phẩm!");
      setShowDeleteModal(false);
      navigate("/productpage");
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Xóa thất bại!");
      navigate("/productpage");
    }
  };

  const change = (field) => (e) => {
    const value =
      e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;
    setForm((p) => ({ ...p, [field]: value }));
  };

  const inputClass =
    "w-full bg-[#f3f4f5] border-none focus:ring-1 focus:ring-[#000666]/20 focus:bg-white rounded-lg px-4 py-3 transition-all outline-none text-sm";

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen">
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&family=Material+Symbols+Outlined"
        rel="stylesheet"
      />

      {showDeleteModal && (
        <DeleteModal
          productName={form.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <div className="flex pt-16 min-h-screen">
        <main className="flex-1 bg-[#f8f9fa] p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase tracking-widest text-slate-500 bg-[#edeeef] px-2 py-1 rounded">
                    Code: {form.productCode}
                  </span>
                </div>
                <h1
                  className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#000666]"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  Chỉnh sửa: {form.name}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-6 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium text-sm"
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={iconStyle}
                  >
                    delete_forever
                  </span>{" "}
                  Xóa
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-2.5 rounded-lg bg-gradient-to-br from-[#000666] to-[#1a237e] text-white shadow-lg flex items-center gap-2 text-sm font-semibold"
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={iconStyle}
                  >
                    save
                  </span>{" "}
                  Lưu thay đổi
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Cột trái: Thông tin chính */}
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm">
                  <h3
                    className="text-lg font-bold mb-6 flex items-center gap-2"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    <span
                      className="material-symbols-outlined text-[#0061a4]"
                      style={iconStyle}
                    >
                      info
                    </span>{" "}
                    Thông số cơ bản
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[0.7rem] uppercase text-slate-500 font-medium">
                        Tên sản phẩm
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        value={form.name}
                        onChange={change("name")}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[0.7rem] uppercase text-slate-500 font-medium">
                        Loại sản phẩm
                      </label>
                      <select
                        className={inputClass}
                        value={form.productType}
                        onChange={change("productType")}
                      >
                        <option value="PHYSICAL">PHYSICAL (Vật lý)</option>
                        <option value="SERVICE">SERVICE (Dịch vụ)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[0.7rem] uppercase text-slate-500 font-medium">
                        Danh mục
                      </label>
                      <select
                        className={inputClass}
                        value={form.categoryId}
                        onChange={change("categoryId")}
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[0.7rem] uppercase text-slate-500 font-medium">
                        Đơn vị tính
                      </label>
                      <select
                        className={inputClass}
                        value={form.uomId}
                        onChange={change("uomId")}
                      >
                        {uoms.map((uom) => (
                          <option key={uom.id} value={uom.id}>
                            {uom.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-[0.7rem] uppercase text-slate-500 font-medium">
                        Mô tả chi tiết
                      </label>
                      <textarea
                        className={inputClass + " resize-none"}
                        rows={3}
                        value={form.description}
                        onChange={change("description")}
                      />
                    </div>
                  </div>
                </div>

                {/* Tài chính */}
                <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm">
                  <h3
                    className="text-lg font-bold mb-6 flex items-center gap-2"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    <span
                      className="material-symbols-outlined text-[#0061a4]"
                      style={iconStyle}
                    >
                      payments
                    </span>{" "}
                    Cấu hình giá
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[0.7rem] uppercase text-slate-500 font-medium">
                        Giá bán lẻ
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-slate-500 text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          className={inputClass + " pl-8"}
                          value={form.basePrice}
                          onChange={change("basePrice")}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[0.7rem] uppercase text-slate-500 font-medium">
                        Thuế VAT (%)
                      </label>
                      <input
                        type="number"
                        className={inputClass}
                        value={form.vatRate}
                        onChange={change("vatRate")}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[0.7rem] uppercase text-slate-500 font-medium">
                        Đặt cọc ghi đè
                      </label>
                      <input
                        type="number"
                        className={inputClass}
                        value={form.depositOverride}
                        onChange={change("depositOverride")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cột phải: Media & Audit */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                  {/* Thêm input file ẩn */}
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e)}
                  />

                  <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                    <h3
                      className="text-lg font-bold mb-4 flex items-center gap-2"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                      <span
                        className="material-symbols-outlined text-[#0061a4]"
                        style={iconStyle}
                      >
                        image
                      </span>
                      Hình ảnh
                    </h3>

                    <div className="relative group">
                      {/* Ưu tiên hiển thị previewUrl nếu có chọn file mới, nếu không thì dùng form.imageUrl từ API */}
                      <img
                        src={previewUrl || form.imageUrl}
                        alt="Preview"
                        className="w-full aspect-square object-cover rounded-lg mb-4 shadow-inner"
                      />

                      <div className="absolute inset-0 bg-[#000666]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg backdrop-blur-sm">
                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById("fileInput").click()
                          }
                          className="flex items-center gap-2 text-white font-medium px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full border border-white/40 transition-all text-sm"
                        >
                          <span
                            className="material-symbols-outlined text-sm"
                            style={iconStyle}
                          >
                            edit
                          </span>
                          Thay đổi ảnh
                        </button>
                      </div>
                    </div>

                    <div
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                      className="mt-4 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-[#0061a4] transition-colors cursor-pointer group"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0061a4] group-hover:scale-110 transition-transform">
                          <span
                            className="material-symbols-outlined"
                            style={iconStyle}
                          >
                            cloud_upload
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#191c1d]">
                          Tải lên từ thiết bị
                        </p>
                        <p className="text-[0.65rem] text-slate-500">
                          Kéo thả hoặc nhấn để chọn file
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[0.7rem] uppercase text-slate-400">
                      <span>Ngày tạo</span>
                      <span className="text-slate-900 font-semibold">
                        {new Date(form.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[0.7rem] uppercase text-slate-400">
                      <span>Cập nhật cuối</span>
                      <span className="text-slate-900 font-semibold">
                        {new Date(form.updatedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
