import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AddProductModal from "./ProductInput";
import EditProductModal from "./ProductEdit";
import ProductFilterPanel from "./ProductFilter";

// Import các Module đã được bóc tách
import ProductInspectionPanel from "./ProductInspectionPanel";
import ProductRow from "./ProductRow";
import ProductPagination from "./ProductPagination";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

const iconStyle = {
  fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
};

export default function ProductInventory() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State tạm hiển thị ở ô input để gõ mượt
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchInputRef = useRef(null);
  const pageSizeRef = useRef(null);
  const tableContainerRef = useRef(null);

  const [rightPanel, setRightPanel] = useState("inspection"); // "inspection" | "filter"

  // 1. GỘP SEARCH VÀO TRONG FILTERS STATE
  const [filters, setFilters] = useState({
    search: "",
    sort: "",
    productType: "",
    categoryIds: [],
    uomIds: [],
  });

  // Hàm fetch data gốc - nhận params từ filters state và gửi lên BE
  const fetchProducts = async (activeFilters = filters) => {
    try {
      setLoading(true);
      const params = {};

      // Đẩy param search lên Backend (nếu không có thì truyền chuỗi rỗng hoặc null)
      params.search = activeFilters.search || "";

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
      setSelectedIndex(-1);
      alert("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Không thể xóa sản phẩm!");
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setSelectedIndex(-1);
  };

  // Hàm xử lý khi user gõ vào ô search: Cập nhật text ngay lập tức & nhảy về page 1
  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setPage(1);
    setSelectedIndex(-1);
  };

  const activeFilterCount = [
    filters.sort !== "",
    filters.productType !== "",
    filters.categoryIds.length > 0,
    filters.uomIds.length > 0,
  ].filter(Boolean).length;

  // FE BÂY GIỜ CHỈ LÀM NHIỆM VỤ PHÂN TRANG (PAGINATION) TRÊN MẢNG BE ĐÃ LỌC
  const totalFiltered = products.length;
  const startIdx = (page - 1) * pageSize;
  const paginated = products.slice(startIdx, startIdx + pageSize);

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

  // --- EFFECT 1: CHỈ ĐỒNG BỘ DỮ LIỆU KHI BỘ LỌC (BAO GỒM CẢ SEARCH DEBOUNCED) THAY ĐỔI ---
  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  // --- EFFECT MỚI: DEBOUNCE SEARCH TERM ĐỂ CẬP NHẬT VÀO FILTERS ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm }));
    }, 300); // Trì hoãn 300ms trước khi kích hoạt gọi API

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // --- EFFECT 2: XỬ LÝ LẮNG NGHE BÀN PHÍM TOÀN CỤC ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)
      ) {
        if (e.key === "Escape") {
          document.activeElement.blur();
        }
        return;
      }

      if (e.key === "Escape") {
        setShowAddModal(false);
        setEditProductId(null);
        setRightPanel("inspection");
        return;
      }

      if (showAddModal || editProductId !== null || rightPanel === "filter")
        return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prevIndex) => {
            const nextIndex =
              prevIndex < paginated.length - 1 ? prevIndex + 1 : prevIndex;
            setSelectedProduct(paginated[nextIndex]);
            return nextIndex;
          });
          break;

        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prevIndex) => {
            const nextIndex = prevIndex > 0 ? prevIndex - 1 : 0;
            setSelectedProduct(paginated[nextIndex]);
            return nextIndex;
          });
          break;

        case "e":
        case "E":
          if (selectedProduct) {
            e.preventDefault();
            setEditProductId(selectedProduct.id);
          }
          break;

        case "Delete":
        case "Backspace":
          if (selectedProduct) {
            e.preventDefault();
            handleDelete(selectedProduct.id);
          }
          break;

        default:
          break;
      }

      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case "e":
            if (selectedProduct) {
              e.preventDefault();
              setEditProductId(selectedProduct.id);
            }
            break;
          case "delete":
          case "backspace":
            if (selectedProduct) {
              e.preventDefault();
              handleDelete(selectedProduct.id);
            }
            break;
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
            e.preventDefault();
            setPage(1);
            break;
          case ".":
            e.preventDefault();
            setPage(Math.ceil(totalFiltered / pageSize) || 1);
            break;
        }
      }

      if (e.key === "ArrowLeft" && page > 1) setPage(page - 1);
      if (e.key === "ArrowRight" && page < Math.ceil(totalFiltered / pageSize))
        setPage(page + 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    page,
    pageSize,
    totalFiltered,
    showAddModal,
    editProductId,
    rightPanel,
    paginated,
    selectedProduct,
  ]);

  // --- EFFECT 3: TỰ ĐỘNG CUỘN THEO ĐIỀU HƯỚNG PHÍM ---
  useEffect(() => {
    if (selectedIndex === -1 || !tableContainerRef.current) return;

    const activeRow = tableContainerRef.current.querySelector(
      `tr[data-index="${selectedIndex}"]`,
    );

    if (activeRow) {
      const container = tableContainerRef.current;
      const rowTop = activeRow.offsetTop;
      const rowBottom = rowTop + activeRow.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      if (rowTop < containerTop) {
        container.scrollTo({ top: rowTop, behavior: "smooth" });
      } else if (rowBottom > containerBottom) {
        container.scrollTo({
          top: rowBottom - container.clientHeight,
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  return (
    <>
      <div className="bg-[#f8f9fa] text-[#191c1d] h-screen flex flex-col">
        <div className="flex flex-1 overflow-hidden">
          <main className="space-y-6 flex-1 relative">
            <div className="flex justify-between items-end shrink-0 gap-4">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                  Catalog Manager
                </p>
                <h2 className="text-3xl font-black text-[#1a237e]">
                  Danh mục sản phẩm
                </h2>
              </div>

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
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setRightPanel(
                      rightPanel === "filter" ? "inspection" : "filter",
                    )
                  }
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
                ref={tableContainerRef}
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
                      paginated.map((p, index) => (
                        <ProductRow
                          key={p.id}
                          product={p}
                          index={index}
                          isActive={index === selectedIndex}
                          onSelect={() => {
                            setSelectedProduct(p);
                            setSelectedIndex(index);
                            setRightPanel("inspection");
                          }}
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

              <ProductPagination
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
            {rightPanel === "filter" ? (
              <ProductFilterPanel
                filters={filters}
                onChange={handleFilterChange}
                onClose={() => setRightPanel("inspection")}
              />
            ) : (
              <ProductInspectionPanel selectedProduct={selectedProduct} />
            )}
          </aside>
        </div>
      </div>
      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSaved={fetchProducts}
      />
      <EditProductModal
        open={editProductId !== null}
        productId={editProductId}
        onClose={() => setEditProductId(null)}
        onSaved={fetchProducts}
      />
    </>
  );
}
