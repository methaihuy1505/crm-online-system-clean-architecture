import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

const iconStyle = {
  fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
};

function TopBar({ search, onSearch }) {
  return (
    <header className="flex justify-between items-center px-8 py-4 w-full bg-[#f8f9fa] shrink-0 border-b border-slate-200/50">
      <div className="flex items-center gap-6">
        <h1
          className="text-2xl font-extrabold tracking-tight text-[#1A237E]"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Inventory
        </h1>
        <div className="hidden lg:flex items-center bg-[#f3f4f5] px-4 py-2 rounded-full w-96 focus-within:bg-white border border-transparent focus-within:border-slate-200 transition-all">
          <span
            className="material-symbols-outlined text-slate-400 text-xl"
            style={iconStyle}
          >
            search
          </span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 text-[#191c1d] ml-2 outline-none"
            placeholder="Tìm kiếm theo mã hoặc tên sản phẩm..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}

function InspectionPanel({ selectedProduct }) {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-black uppercase tracking-widest text-[#1A237E]">
        Chi tiết nhanh
      </h3>
      {selectedProduct ? (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/50">
          <div className="w-full h-40 bg-[#edeeef] rounded-xl mb-4 overflow-hidden">
            <img
              src={
                selectedProduct.imageUrl || "https://via.placeholder.com/150"
              }
              className="w-full h-full object-cover"
              alt="preview"
            />
          </div>
          <h4 className="text-sm font-bold text-[#191c1d] mb-2">
            {selectedProduct.name}
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            {selectedProduct.description || "Không có mô tả cho sản phẩm này."}
          </p>
          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between text-[0.7rem] mb-2">
              <span className="text-slate-500 uppercase">Mã hệ thống</span>
              <span className="font-bold">{selectedProduct.productCode}</span>
            </div>
            <div className="flex justify-between text-[0.7rem]">
              <span className="text-slate-500 uppercase">Loại</span>
              <span className="font-bold">{selectedProduct.productType}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed border-slate-300 rounded-2xl">
          <p className="text-xs text-slate-400">
            Chọn một sản phẩm để xem thông tin nhanh.
          </p>
        </div>
      )}
    </div>
  );
}

function ProductRow({ product, onSelect, onDelete }) {
  const navigate = useNavigate();

  return (
    <tr
      className="group hover:bg-[#f3f4f5] transition-colors duration-200 cursor-pointer"
      onClick={() => onSelect(product)}
    >
      <td className="pl-2 ">
        <p className="text-sm font-medium text-[#191c1d]">{product.name}</p>
      </td>
      <td className="pl-2 text-sm font-mono text-slate-500">
        {product.productCode}
      </td>
      <td className="pl-2 ">
        <span className="px-2  text-[0.65rem] font-bold rounded-full border bg-blue-50 text-blue-700 border-blue-100">
          {product.categoryName || "Chưa phân loại"}
        </span>
      </td>
      <td className="pl-2  text-sm text-slate-500">
        {product.uomName || "Cái"}
      </td>
      <td className="pl-2 text-sm font-bold text-[#191c1d]">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(product.basePrice || 0)}
      </td>
      <td className="pl-2 ">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
          <span className="text-xs font-bold text-[#191c1d]">
            {product.vatRate}%
          </span>
        </div>
      </td>
      <td className="flex items-center text-right">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product.id);
          }}
          className="p-2 text-slate-300 hover:text-red-600 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/productedit/${product.id}`);
          }}
          className="p-2 text-slate-300 hover:text-blue-900 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">edit_square</span>
        </button>
      </td>
    </tr>
  );
}

function Pagination({
  current,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.ceil(total / pageSize) || 1;

  const getPages = () => {
    if (totalPages <= 7) return [...Array(totalPages)].map((_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (current >= totalPages - 3)
      return [
        1,
        "...",
        ...Array(5)
          .fill(0)
          .map((_, i) => totalPages - 4 + i),
      ];
    return [1, "...", current - 1, current, current + 1, "...", totalPages];
  };

  const showing = Math.min(pageSize, total - (current - 1) * pageSize);

  return (
    <div className="px-3 py-2 bg-[#f3f4f5]/30 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4 shrink-0">
      <div className="flex items-center gap-3">
        <p className="text-xs text-slate-500 font-medium">
          Hiển thị <span className="font-bold text-[#191c1d]">{showing}</span> /{" "}
          <span className="font-bold text-[#191c1d]">{total}</span> sản phẩm
        </p>
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="text-xs font-bold border border-slate-200 rounded-lg px-2 py-1 bg-white text-[#191c1d] outline-none cursor-pointer hover:border-slate-300 transition-colors"
        >
          {[10, 25, 50].map((s) => (
            <option key={s} value={s}>
              {s} / trang
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <button
          disabled={current === 1}
          onClick={() => onPageChange(current - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-500 transition-all disabled:opacity-20"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        {getPages().map((p, i) =>
          p === "..." ? (
            <span
              key={`dot-${i}`}
              className="w-8 text-center text-slate-400 text-xs select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-all ${
                current === p
                  ? "bg-[#1a237e] text-white"
                  : "hover:bg-white text-slate-500"
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          disabled={current >= totalPages}
          onClick={() => onPageChange(current + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-500 transition-all disabled:opacity-20"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
}

export default function ProductInventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products"),
        api.get("/product-categories"),
      ]);

      const categoryMap = Object.fromEntries(
        categoriesRes.data.map((c) => [c.id, c.name]),
      );
      const merged = productsRes.data.map((p) => ({
        ...p,
        categoryName: categoryMap[p.categoryId] ?? "Chưa phân loại",
      }));

      setProducts(merged);
      setError(null);
    } catch (err) {
      console.error("Chi tiết lỗi:", err);
      setError("Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelectedProduct(null);
      alert("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Không thể xóa sản phẩm!");
    }
  };

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.productCode?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalFiltered = filtered.length;
  const startIdx = (page - 1) * pageSize;
  const paginated = filtered.slice(startIdx, startIdx + pageSize);

  // Widths cố định để thead và tbody columns thẳng hàng
  const colWidths = ["20%", "15%", "14%", "10%", "15%", "10%", "10%"];
  const COLS = [
    "Sản phẩm",
    "Mã SKU",
    "Danh mục",
    "Đơn vị",
    "Giá cơ bản",
    "Thuế",
    "",
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/*
        Kỹ thuật "chỉ tbody scroll":
        - Tách thead và tbody thành 2 <table> riêng biệt
        - thead table: shrink-0, không scroll
        - tbody wrapper: flex-1 overflow-y-auto → chỉ rows cuộn
        - Dùng colgroup với width % giống nhau ở cả 2 table để columns thẳng hàng
      */}
      <div className="bg-[#f8f9fa] text-[#191c1d] h-screen flex flex-col font-sans">
        <TopBar search={search} onSearch={handleSearch} />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 flex flex-col overflow-hidden p-8 gap-8">
            {/* Title + actions */}
            <div className="flex justify-between items-end shrink-0">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                  Catalog Manager
                </p>
                <h2 className="text-3xl font-black text-[#1a237e]">
                  Danh mục sản phẩm
                </h2>
              </div>
              <div className="flex gap-3">
                <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                  <span className="material-symbols-outlined text-lg">
                    file_download
                  </span>
                  Xuất Excel
                </button>
                <button
                  onClick={() => navigate("/productimport")}
                  className="bg-[#1a237e] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  Thêm mới
                </button>
              </div>
            </div>

            {/* Card: flex-col flex-1 để chiếm hết chiều cao còn lại */}
            <section className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col flex-1 overflow-hidden min-h-0">
              {/* THEAD cố định */}
              <div className="shrink-0 border-b border-slate-100">
                <table className="w-full text-left border-collapse table-fixed">
                  <colgroup>
                    {colWidths.map((w, i) => (
                      <col key={i} style={{ width: w }} />
                    ))}
                  </colgroup>
                  <thead>
                    <tr className="bg-[#f3f4f5]/50">
                      {COLS.map((h, i) => (
                        <th
                          key={i}
                          className={`px-2 py-4 text-[0.65rem] uppercase tracking-widest text-slate-400 font-black ${i === 0 ? "pl-8" : ""}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                </table>
              </div>

              {/* TBODY scroll — chỉ phần này cuộn */}
              <div
                className="flex-1 overflow-y-auto min-h-0"
                style={{ scrollbarWidth: "none" }}
              >
                <table className="w-full text-left border-collapse table-fixed">
                  <colgroup>
                    {colWidths.map((w, i) => (
                      <col key={i} style={{ width: w }} />
                    ))}
                  </colgroup>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-8 py-20 text-center text-slate-400"
                        >
                          Đang đồng bộ dữ liệu...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-8 py-20 text-center text-red-400"
                        >
                          {error}
                        </td>
                      </tr>
                    ) : paginated.length > 0 ? (
                      paginated.map((p) => (
                        <ProductRow
                          key={p.id}
                          product={p}
                          onSelect={setSelectedProduct}
                          onDelete={handleDelete}
                        />
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-8 py-20 text-center text-slate-400"
                        >
                          Không có dữ liệu phù hợp.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION cố định dưới cùng */}
              <Pagination
                current={page}
                total={totalFiltered}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </section>
          </main>

          <aside className="hidden xl:block w-80 shrink-0 border-l border-slate-200/50 bg-[#f3f4f5]/50 overflow-y-auto p-6">
            <InspectionPanel selectedProduct={selectedProduct} />
          </aside>
        </div>
      </div>
    </>
  );
}
