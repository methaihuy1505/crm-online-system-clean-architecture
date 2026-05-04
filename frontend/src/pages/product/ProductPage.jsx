import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AddProductModal from "./ProductInput";
import EditProductModal from "./ProductEdit";
import FilterSidebar from "./ProductFilter";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

const iconStyle = {
  fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
};

function InspectionPanel({ selectedProduct }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-black uppercase tracking-widest text-[#1A237E]">
        Chi tiết nhanh
      </h3>
      {selectedProduct ? (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/50">
          <div className="w-full h-40 bg-[#edeeef] rounded-xl mb-4 overflow-hidden border border-slate-100">
            <img
              src={
                selectedProduct.imageUrl || "https://via.placeholder.com/150"
              }
              className="w-full h-full object-cover"
              alt="preview"
            />
          </div>

          <div className="mb-4">
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded uppercase">
              {selectedProduct.productType || "Hàng hóa"}
            </span>
            <h4
              className="text-sm font-bold text-[#191c1d] mt-1 leading-tight truncate"
              title={selectedProduct.name}
            >
              {selectedProduct.name}
            </h4>
            <p className="text-xs text-slate-500 mt-2 line-clamp-3">
              {selectedProduct.description ||
                "Không có mô tả cho sản phẩm này."}
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <div className="flex justify-between text-[0.7rem]">
              <span className="text-slate-500 uppercase">Mã hệ thống</span>
              <span className="font-mono font-bold text-[#191c1d]">
                {selectedProduct.productCode}
              </span>
            </div>
            <div className="flex justify-between text-[0.7rem]">
              <span className="text-slate-500 uppercase">Đơn vị tính</span>
              <span className="font-bold text-[#191c1d]">
                {selectedProduct.uomName || "Cái"}
              </span>
            </div>
            <div className="flex justify-between text-[0.7rem]">
              <span className="text-slate-500 uppercase">Giá cơ bản</span>
              <span className="font-bold text-[#1a237e]">
                {formatCurrency(selectedProduct.basePrice)}
              </span>
            </div>
            <div className="flex justify-between text-[0.7rem]">
              <span className="text-slate-500 uppercase">Thuế VAT</span>
              <span className="font-bold text-[#191c1d]">
                {selectedProduct.vatRate}%
              </span>
            </div>
            {selectedProduct.depositOverride > 0 && (
              <div className="flex justify-between text-[0.7rem]">
                <span className="text-slate-500 uppercase">Đặt cọc</span>
                <span className="font-bold text-orange-600">
                  {formatCurrency(selectedProduct.depositOverride)}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
          <p className="text-xs text-slate-400">
            Chọn một sản phẩm để xem thông tin nhanh.
          </p>
        </div>
      )}
    </div>
  );
}

function ProductRow({ product, onSelect, onDelete, onEdit }) {
  return (
    <tr
      className="group hover:bg-[#f3f4f5] border-b border-slate-50 transition-colors duration-150 cursor-pointer"
      onClick={() => onSelect(product)}
    >
      <td className="pl-8  py-0.5 overflow-hidden">
        <p
          className="text-sm font-semibold text-[#191c1d] truncate block"
          title={product.name}
        >
          {product.name}
        </p>
      </td>
      <td className="pl-2  py-0.5 overflow-hidden">
        <p className="text-[13px] font-mono text-slate-500 truncate block">
          {product.productCode}
        </p>
      </td>
      <td className="pl-2  py-0.5 overflow-hidden">
        <div className="flex">
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md border bg-blue-50 text-blue-700 border-blue-100 uppercase truncate">
            {product.categoryName || "N/A"}
          </span>
        </div>
      </td>
      <td className="pl-2  py-0.5 overflow-hidden">
        <p className="text-[13px] text-slate-500 truncate block">
          {product.uomName || "Cái"}
        </p>
      </td>
      <td className="pl-2  py-0.5 text-sm font-bold text-[#191c1d] overflow-hidden">
        <p className="truncate block">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(product.basePrice || 0)}
        </p>
      </td>
      <td className="pl-2  py-0.5 overflow-hidden">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-blue-600"></div>
          <span className="text-[12px] font-bold text-[#191c1d]">
            {product.vatRate}%
          </span>
        </div>
      </td>
      <td className="pr-4  py-0.5 text-right opacity-0 group-hover:opacity-100 transition-all">
        <div className="flex justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product.id);
            }}
            className="px-1.5 py-0.5 text-slate-400 hover:text-blue-900 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              edit_square
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product.id);
            }}
            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              delete
            </span>
          </button>
        </div>
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
  selectRef,
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
          ref={selectRef}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="text-xs font-bold border border-slate-200 rounded-lg px-2  py-0.5 bg-white text-[#191c1d] outline-none cursor-pointer hover:border-slate-300 transition-colors"
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
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProductId, setEditProductId] = useState(null); // null = đóng, number = mở
  const searchInputRef = useRef(null);
  const pageSizeRef = useRef(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    sort: "",
    productType: "",
    categoryIds: [],
    uomIds: [],
  });

  const fetchProducts = async (activeFilters = filters) => {
    try {
      setLoading(true);
      const params = {};
      if (activeFilters.sort) params.sort = activeFilters.sort;
      if (activeFilters.productType)
        params.productType = activeFilters.productType;
      if (activeFilters.categoryIds.length)
        params.categoryId = activeFilters.categoryIds.join(",");
      if (activeFilters.uomIds.length)
        params.uomId = activeFilters.uomIds.join(",");

      const [productsRes, categoriesRes, uomsRes] = await Promise.all([
        api.get("/products", { params }),
        api.get("/product-categories"),
        api.get("/uoms"),
      ]);

      const categoryMap = Object.fromEntries(
        categoriesRes.data.map((c) => [c.id, c.name]),
      );
      const uomMap = Object.fromEntries(
        uomsRes.data.map((u) => [u.id, u.name]),
      );

      const merged = productsRes.data.map((p) => ({
        ...p,
        categoryName: categoryMap[p.categoryId] ?? "Chưa phân loại",
        uomName: uomMap[p.uomId] ?? "Cái",
      }));

      setProducts(merged);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách sản phẩm." + err);
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
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    fetchProducts(newFilters);
  };
  const activeFilterCount = [
    filters.sort !== "",
    filters.productType !== "",
    filters.categoryIds.length > 0,
    filters.uomIds.length > 0,
  ].filter(Boolean).length;
  const totalFiltered = filtered.length;
  const startIdx = (page - 1) * pageSize;
  const paginated = filtered.slice(startIdx, startIdx + pageSize);

  const colWidths = ["25%", "15%", "15%", "10%", "15%", "8%", "12%"];
  const COLS = [
    "Sản phẩm",
    "Mã SKU",
    "Danh mục",
    "Đơn vị",
    "Giá cơ bản",
    "Thuế",
    "",
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cho phép phím Esc hoạt động mọi lúc để đóng modal/sidebar
      if (e.key === "Escape") {
        setShowAddModal(false);
        setEditProductId(null);
        setShowFilter(false);
        return;
      }

      // Nếu đang mở Modal, không nhận phím tắt điều hướng khác
      if (showAddModal || editProductId !== null || showFilter) return;

      // Phím tắt Alt + ...
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case "n":
            e.preventDefault();
            setShowAddModal(true);
            break;
          case "s":
            e.preventDefault();
            searchInputRef.current?.focus();
            break;
          case "p":
            e.preventDefault();
            pageSizeRef.current?.focus();
            break;
          case ",":
          case "<":
            e.preventDefault();
            setPage(1);
            break;
          case ".":
          case ">":
            e.preventDefault();
            setPage(Math.ceil(totalFiltered / pageSize) || 1);
            break;
        }
      }

      // Phím mũi tên điều hướng (không cần Alt)
      if (e.key === "ArrowLeft" && page > 1) setPage(page - 1);
      if (e.key === "ArrowRight" && page < Math.ceil(totalFiltered / pageSize))
        setPage(page + 1);
    };
    fetchProducts();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [page, pageSize, totalFiltered, showAddModal, editProductId, showFilter]);
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

      <div className="bg-[#f8f9fa] text-[#191c1d] h-screen flex flex-col font-sans">
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 flex flex-col overflow-hidden p-8 gap-8">
            <div className="flex justify-between items-end shrink-0 gap-4">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                  Catalog Manager
                </p>
                <h2 className="text-3xl font-black text-[#1a237e]">
                  Danh mục sản phẩm
                </h2>
              </div>

              {/* Search Bar - Đã điều chỉnh size và padding */}
              <div className="hidden lg:flex items-center bg-[#e6e6e7] px-4 py-2.5 rounded-full w-80 lg:w-96 focus-within:bg-white border border-transparent focus-within:border-slate-200 transition-all">
                <span
                  className="material-symbols-outlined text-slate-400 text-xl"
                  style={iconStyle}
                >
                  search
                </span>
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 text-[#191c1d] ml-2 outline-none"
                  placeholder="Tìm kiếm..."
                  ref={searchInputRef}
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilter(true)}
                  className="relative bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">
                    tune
                  </span>
                  Lọc
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#1a237e] text-white text-[0.6rem] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                  <span className="material-symbols-outlined text-lg">
                    file_download
                  </span>
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-[#1a237e] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            </div>

            <section className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col flex-1 overflow-hidden min-h-0">
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
                          onEdit={setEditProductId}
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

              <Pagination
                current={page}
                total={totalFiltered}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                selectRef={pageSizeRef}
              />
            </section>
          </main>

          <aside className="hidden xl:block w-80 shrink-0 border-l border-slate-200/50 bg-[#f3f4f5]/50 overflow-y-auto p-6">
            <InspectionPanel selectedProduct={selectedProduct} />
          </aside>
        </div>
      </div>

      {/* Add modal */}
      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSaved={fetchProducts}
      />

      {/* Edit modal */}
      <EditProductModal
        open={editProductId !== null}
        productId={editProductId}
        onClose={() => setEditProductId(null)}
        onSaved={fetchProducts}
      />
      <FilterSidebar
        open={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onChange={handleFilterChange}
      />
    </>
  );
}
