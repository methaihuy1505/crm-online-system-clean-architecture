import { useState, useEffect } from "react";
import axios from "axios";

const SIDEBAR_ITEMS = [
  { icon: "dashboard", label: "Bảng điều khiển", active: false },
  { icon: "inventory_2", label: "Sản phẩm", active: true, fill: true },
  { icon: "category", label: "Danh mục", active: false },
  { icon: "conveyor_belt", label: "Nhà cung cấp", active: false },
  { icon: "payments", label: "Bảng giá", active: false },
];

function TopBar() {
  return (
    <header className="flex justify-between items-center px-8 py-4 w-full bg-[#f8f9fa]">
      <div className="flex items-center gap-2 text-slate-400">
        <span className="text-sm font-medium">Kho hàng</span>
        <span
          className="material-symbols-outlined text-xs"
          style={{ fontVariationSettings: "'wght' 200" }}
        >
          chevron_right
        </span>
        <span className="text-sm font-bold text-[#1A237E]">Thêm sản phẩm</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}
          >
            notifications
          </span>
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}
          >
            settings
          </span>
        </button>
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        <span className="text-xs font-bold text-[#1A237E] tracking-tight">
          QUẢN TRỊ VIÊN
        </span>
      </div>
    </header>
  );
}

function LabeledField({ label, children }) {
  return (
    <div>
      <label className="block text-[0.75rem] font-bold tracking-widest text-slate-500 uppercase mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-[#f3f4f5] border-none focus:ring-1 focus:ring-[#1A237E]/20 focus:bg-white p-4 rounded-lg text-sm transition-all outline-none";

export default function AddProduct() {
  // State chứa dữ liệu từ API
  const [categories, setCategories] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "PRODUCT",
    categoryId: "",
    uomId: "",
    description: "",
    basePrice: "0",
    vat: "10",
    deposit: "0",
  });
  const PRODUCT_TYPE_OPTIONS = {
    PHYSICAL: "Hàng hóa vật lý",
    SERVICE: "Gói dịch vụ",
    DIGITAL: "Sản phẩm kỹ thuật số",
  };
  // 1. Fetch dữ liệu Category và Uom khi load trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, uomRes] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/product-categories"),
          axios.get("http://localhost:8080/api/v1/uoms"),
        ]);
        setCategories(catRes.data);
        setUoms(uomRes.data);

        // Set mặc định giá trị đầu tiên nếu có
        if (catRes.data.length > 0)
          setForm((p) => ({ ...p, categoryId: catRes.data[0].id }));
        if (uomRes.data.length > 0)
          setForm((p) => ({ ...p, uomId: uomRes.data[0].id }));
      } catch (error) {
        console.error("Lỗi lấy dữ liệu danh mục:", error);
      }
    };
    fetchData();
  }, []);

  const basePrice = parseFloat(form.basePrice) || 0;
  const vat = parseFloat(form.vat) || 0;
  const totalWithVat = (basePrice * (1 + vat / 100)).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // 2. Xử lý chọn ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Tạo link tạm để xem trước
    }
  };

  // 3. Hàm Lưu Sản Phẩm (Gửi lên Server)
  const handleSave = async () => {
    try {
      // 1. Kiểm tra dữ liệu bắt buộc trước khi gửi
      if (!form.name || !form.code || !form.categoryId || !form.uomId) {
        alert("Vui lòng nhập đầy đủ các trường bắt buộc (*)");
        return;
      }

      const data = new FormData();

      // 2. Map lại dữ liệu theo đúng chuẩn data mẫu bạn vừa gửi
      const productData = {
        productCode: form.code, // Khớp với data mẫu
        name: form.name, // Khớp với data mẫu
        categoryId: parseInt(form.categoryId),
        uomId: parseInt(form.uomId),
        productType: "PHYSICAL", // Theo mẫu là PHYSICAL thay vì PRODUCT
        basePrice: parseFloat(form.basePrice) || 0,
        vatRate: parseFloat(form.vat) || 0, // Theo mẫu dùng vatRate thay vì vat
        depositOverride: parseFloat(form.deposit) || 0, // Theo mẫu dùng depositOverride
        imageUrl: form.imageUrl || "", // Thêm trường này nếu backend yêu cầu
        description: form.description || "",
      };

      // 3. Đóng gói Blob với Content-Type chuẩn như trong Postman
      data.append(
        "product",
        new Blob([JSON.stringify(productData)], { type: "application/json" }),
      );

      // 4. Xử lý file ảnh (Key là "images" như trong ảnh Postman)
      if (selectedFile) {
        data.append("images", selectedFile);
      }

      // 5. Gửi request
      const response = await axios.post(
        "http://localhost:8080/api/v1/products",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Thành công:", response.data);
      alert("Lưu sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi chi tiết từ Server:");
      if (error.response) {
        // Server trả về lỗi (400, 500...)
        console.log("Data:", error.response.data);
        console.log("Status:", error.response.status);
        alert(
          `Lỗi ${error.response.status}: ${JSON.stringify(error.response.data)}`,
        );
      } else {
        // Lỗi kết nối hoặc lỗi khác
        console.log("Error Message:", error.message);
        alert("Không thể kết nối đến server!");
      }
    }
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen flex overflow-hidden">
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <div className="flex-1 overflow-y-auto px-12 py-10">
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-12 flex justify-between items-end">
              <div>
                <h2
                  className="text-[2.75rem] font-extrabold tracking-tight leading-tight"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  Thêm Sản Phẩm
                </h2>
                <p className="text-slate-500 mt-2 max-w-lg text-sm">
                  Định nghĩa các thành phần kiến trúc và mặt hàng tồn kho một
                  cách chính xác.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* Left Column */}
              <div className="col-span-8 space-y-8">
                <section className="bg-white p-8 rounded-xl shadow-[0_8px_32px_-4px_rgba(25,28,29,0.06)]">
                  <h3
                    className="text-lg font-bold mb-6 flex items-center gap-2"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    <span className="w-1.5 h-6 bg-[#000666] rounded-full"></span>
                    Thông tin định danh
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <LabeledField label="Tên sản phẩm">
                        <input
                          type="text"
                          className={inputClass}
                          value={form.name}
                          maxLength={50}
                          onChange={handleChange("name")}
                        />
                      </LabeledField>
                    </div>
                    <LabeledField label="Mã sản phẩm (Duy nhất)">
                      <input
                        type="text"
                        className={inputClass}
                        value={form.code}
                        maxLength={10}
                        onChange={handleChange("code")}
                      />
                    </LabeledField>
                    <LabeledField label="Loại sản phẩm">
                      <select
                        className={
                          inputClass + " appearance-none cursor-pointer"
                        }
                        value={form.type}
                        onChange={handleChange("type")}
                      >
                        {Object.entries(PRODUCT_TYPE_OPTIONS).map(
                          ([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                    </LabeledField>
                    <LabeledField label="Danh mục">
                      <select
                        className={
                          inputClass + " appearance-none cursor-pointer"
                        }
                        value={form.categoryId}
                        onChange={handleChange("categoryId")}
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </LabeledField>
                    <LabeledField label="Đơn vị tính (UOM)">
                      <select
                        className={
                          inputClass + " appearance-none cursor-pointer"
                        }
                        value={form.uomId}
                        onChange={handleChange("uomId")}
                      >
                        {uoms.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </LabeledField>
                    <div className="col-span-2">
                      <LabeledField label="Mô tả chi tiết">
                        <textarea
                          className={inputClass + " resize-none"}
                          rows={4}
                          value={form.description}
                          onChange={handleChange("description")}
                        />
                      </LabeledField>
                    </div>
                  </div>
                </section>

                {/* Financial Parameters */}
                <section className="bg-white p-8 rounded-xl shadow-[0_8px_32px_-4px_rgba(25,28,29,0.06)]">
                  <h3
                    className="text-lg font-bold mb-6 flex items-center gap-2"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    <span className="w-1.5 h-6 bg-[#0061a4] rounded-full"></span>
                    Thông số tài chính
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    <LabeledField label="Giá cơ bản (USD)">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">
                          $
                        </span>
                        <input
                          type="number"
                          className={inputClass + " pl-8 font-mono"}
                          value={form.basePrice}
                          onChange={handleChange("basePrice")}
                        />
                      </div>
                    </LabeledField>
                    <LabeledField label="Thuế suất VAT (%)">
                      <div className="relative">
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">
                          %
                        </span>
                        <input
                          type="number"
                          className={inputClass + " pr-8 font-mono"}
                          value={form.vat}
                          onChange={handleChange("vat")}
                        />
                      </div>
                    </LabeledField>
                    <LabeledField label="Tỉ lệ đặt cọc (%)">
                      <div className="relative">
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">
                          %
                        </span>
                        <input
                          type="number"
                          className={inputClass + " pr-8 font-mono"}
                          value={form.deposit}
                          onChange={handleChange("deposit")}
                        />
                      </div>
                    </LabeledField>
                  </div>
                  <div className="mt-8 p-4 bg-[#f8f9fa] rounded-lg border border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#191c1d]">
                      ${totalWithVat} Tổng cộng (bao gồm VAT)
                    </span>
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="col-span-4 space-y-8">
                <section className="bg-[#f3f4f5] p-8 rounded-xl flex flex-col gap-6">
                  <h3
                    className="text-lg font-bold"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    Hình ảnh minh họa
                  </h3>
                  <div className="aspect-square w-full bg-white rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-4xl text-slate-300">
                          image
                        </span>
                        <p className="text-xs font-bold text-slate-400">
                          CHƯA CÓ HÌNH ẢNH
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Thay thế URL Input bằng File Input */}
                  <input
                    type="file"
                    id="product-image"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={() =>
                      document.getElementById("product-image").click()
                    }
                    className="w-full py-4 border-2 border-[#1A237E]/10 border-dashed rounded-lg flex items-center justify-center gap-3 hover:bg-[#e1e3e4] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[#1A237E]">
                      upload_file
                    </span>
                    <span className="text-xs font-bold text-[#1A237E]">
                      TẢI LÊN TỪ THIẾT BỊ
                    </span>
                  </button>
                </section>

                {/* Catalog Metadata giữ nguyên layout của bạn */}
                <section className="bg-[#1a237e] p-8 rounded-xl text-white">
                  <h3 className="text-sm font-bold mb-6 tracking-widest uppercase opacity-70">
                    Siêu dữ liệu danh mục
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-xs opacity-80">Trạng thái</span>
                      <span className="text-xs font-bold">Mới tạo</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-12 mb-20 flex items-center justify-between p-6 bg-[#f3f4f5] rounded-2xl">
              <p className="text-xs text-slate-500 italic font-medium">
                Vui lòng kiểm tra kỹ thông tin trước khi lưu.
              </p>
              <div className="flex gap-4"></div>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => (window.location.href = "/productpage")}
                  className="px-6 py-2.5 text-sm font-semibold text-[#191c1d] bg-[#e1e3e4] hover:bg-[#d9dadb] rounded-lg transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-3 text-sm font-bold text-white rounded-lg bg-gradient-to-br from-[#000666] to-[#1a237e] shadow-xl hover:shadow-2xl transition-all"
                >
                  Hoàn tất &amp; Lưu sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
