import React, { useState, useEffect, useRef } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { Search, Filter, Download, Plus, Lock } from "lucide-react";
import { usePermission } from "../../hooks/usePermission";

import AddProductModal from "./ProductInput";
import EditProductModal from "./ProductEdit";
import ProductFilterPanel from "./ProductFilter";
import ProductInspectionPanel from "./ProductInspectionPanel";
import ProductRow from "./ProductRow";
import ProductPagination from "./ProductPagination";

export default function ProductInventory() {
  const { hasPermission } = usePermission();
  const canView = hasPermission("products.view");
  const canCreate = hasPermission("products.create");
  const canUpdate = hasPermission("products.update");
  const canDelete = hasPermission("products.delete");

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
  const [rightPanel, setRightPanel] = useState("inspection");

  const [filters, setFilters] = useState({
    search: "", sort: "", productType: "", categoryIds: [], uomIds: [],
  });

  const fetchProducts = async (activeFilters = filters) => {
    if (!canView) return; 
    try {
      setLoading(true);
      const params = {};
      params.search = activeFilters.search || "";
      if (activeFilters.sort) params.sort = activeFilters.sort;
      if (activeFilters.productType) params.productType = activeFilters.productType;
      if (activeFilters.categoryIds.length) params.categoryId = activeFilters.categoryIds.join(",");
      if (activeFilters.uomIds.length) params.uomId = activeFilters.uomIds.join(",");

      // CHỈ GỌI DUY NHẤT 1 API SẢN PHẨM (Vì Backend Enricher đã lo map tên rồi)
      const productsRes = await api.get("/products", { params });
      
      setProducts(productsRes.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Không thể tải danh sách sản phẩm!";
      toast.error(errorMessage);
      setError("Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!canDelete) { toast.error("Bạn không có quyền xóa sản phẩm!"); return; }
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelectedProduct(null);
      setSelectedIndex(-1);
      toast.success("Xóa thành công!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Không thể xóa sản phẩm!";
      toast.error(errorMessage);
    }
  };

  const handleFilterChange = (newFilters) => { setFilters(newFilters); setPage(1); setSelectedIndex(-1); };
  const handleSearchChange = (val) => { setSearchTerm(val); setPage(1); setSelectedIndex(-1); };

  const activeFilterCount = [
    filters.sort !== "", filters.productType !== "", filters.categoryIds.length > 0, filters.uomIds.length > 0,
  ].filter(Boolean).length;

  const totalFiltered = products.length;
  const startIdx = (page - 1) * pageSize;
  const paginated = products.slice(startIdx, startIdx + pageSize);
  const MIN_VISIBLE_ROWS = 10;
  const emptyRows = Math.max(0, MIN_VISIBLE_ROWS - paginated.length);
  const colWidths = ["25%", "15%", "15%", "10%", "15%", "8%", "12%"];
  const COLS = ["Sản phẩm", "Mã SKU", "Danh mục", "Đơn vị", "Giá cơ bản", "Thuế", ""];

  useEffect(() => { fetchProducts(filters); }, [filters, canView]);
  useEffect(() => {
    const handler = setTimeout(() => { setFilters((prev) => ({ ...prev, search: searchTerm })); }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        if (e.key === "Escape") document.activeElement.blur();
        return;
      }
      if (e.key === "Escape") { setShowAddModal(false); setEditProductId(null); setRightPanel("inspection"); return; }
      if (showAddModal || editProductId !== null || rightPanel === "filter") return;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          if (page < Math.ceil(totalFiltered / pageSize)) { setPage((p) => p + 1); setSelectedIndex(0); }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (page > 1) { setPage((p) => p - 1); setSelectedIndex(0); }
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prevIndex) => {
            const nextIndex = prevIndex < paginated.length - 1 ? prevIndex + 1 : prevIndex;
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
          if (selectedProduct && canUpdate) { e.preventDefault(); setEditProductId(selectedProduct.id); }
          break;
        case "Delete":
        case "Backspace":
          if (selectedProduct && canDelete) { e.preventDefault(); handleDelete(selectedProduct.id); }
          break;
      }

      if (e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        if (canCreate) setShowAddModal(true);
        else toast.error("Bạn không có quyền thêm mới!");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [page, pageSize, totalFiltered, showAddModal, editProductId, rightPanel, paginated, selectedProduct, canUpdate, canDelete, canCreate]);

  if (!canView) {
    return (
      <div className="bg-[#f8f9fa] h-screen flex flex-col items-center justify-center text-slate-500">
        <Lock size={64} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Truy cập bị từ chối</h2>
        <p className="text-sm mt-2">Bạn không có quyền xem danh sách sản phẩm.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#f8f9fa] text-[#191c1d] h-screen flex flex-col p-4">
        <div className="flex flex-1 overflow-hidden gap-4">
          <main className="flex-1 flex flex-col relative space-y-4 min-w-0">
            <div className="flex justify-between items-end shrink-0 gap-4">
              <div>
                <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">Danh mục sản phẩm</h2>
              </div>
              <div className="hidden lg:flex items-center bg-[#e6e6e7] px-4 py-2.5 rounded-full w-80 lg:w-96 focus-within:bg-white border border-transparent focus-within:border-slate-200 transition-all">
                <Search size={18} className="text-slate-400 shrink-0" />
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 text-[#191c1d] ml-2 outline-none"
                  placeholder="Tìm kiếm..." ref={searchInputRef} value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setRightPanel(rightPanel === "filter" ? "inspection" : "filter")}
                  className="relative bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all outline-none"
                >
                  <Filter size={16} /> Lọc
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#1a237e] text-white text-[0.6rem] font-bold rounded-full w-4 h-4 flex items-center justify-center">{activeFilterCount}</span>
                  )}
                </button>
                <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all outline-none">
                  <Download size={16} />
                </button>
                
                {canCreate && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#1a237e] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center gap-2 outline-none"
                  >
                    <Plus size={18} strokeWidth={2.5} /> Thêm Mới
                  </button>
                )}
              </div>
            </div>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden min-h-0">
              <div ref={tableContainerRef} className="flex-1 overflow-y-auto min-h-0 custom-scrollbar relative">
                <table className="w-full text-left border-collapse table-fixed">
                  <colgroup>{colWidths.map((w, i) => <col key={i} style={{ width: w }} />)}</colgroup>
                  <thead className="sticky top-0 z-20 shadow-sm ring-1 ring-slate-100">
                    <tr className="bg-[#f3f4f5]/90 backdrop-blur-sm">
                      {COLS.map((h, i) => (
                        <th key={i} className={`px-2 py-4 text-[0.65rem] uppercase tracking-widest text-slate-500 font-black ${i === 0 ? "pl-8" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr><td colSpan={7} className="px-8 py-20 text-center text-slate-400">Đang đồng bộ dữ liệu...</td></tr>
                    ) : error ? (
                      <tr><td colSpan={7} className="px-8 py-20 text-center text-red-400">{error}</td></tr>
                    ) : paginated.length > 0 ? (
                      paginated.map((p, index) => (
                        <ProductRow
                          key={p.id}
                          product={p}
                          index={index}
                          isActive={index === selectedIndex}
                          onSelect={() => { setSelectedProduct(p); setSelectedIndex(index); setRightPanel("inspection"); }}
                          onDelete={handleDelete}
                          onEdit={setEditProductId}
                          canUpdate={canUpdate}
                          canDelete={canDelete}
                        />
                      ))
                    ) : (
                      <tr><td colSpan={7} className="px-8 py-20 text-center text-slate-400">Không có dữ liệu phù hợp.</td></tr>
                    )}
                    {Array.from({ length: emptyRows }).map((_, idx) => (
                      <tr key={`empty-${idx}`}>
                        <td className="px-2 py-4 select-none text-transparent"><div className="h-6">_</div></td>
                        <td></td><td></td><td></td><td></td><td></td><td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ProductPagination current={page} total={totalFiltered} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} selectRef={pageSizeRef} />
            </section>
          </main>

          <aside className="hidden xl:block w-80 shrink-0 border border-slate-200 bg-white rounded-2xl overflow-y-auto p-6 shadow-sm">
            {rightPanel === "filter" ? (
              <ProductFilterPanel filters={filters} onChange={handleFilterChange} onClose={() => setRightPanel("inspection")} />
            ) : (
              <ProductInspectionPanel selectedProduct={selectedProduct} />
            )}
          </aside>
        </div>
      </div>

      <AddProductModal open={showAddModal} onClose={() => setShowAddModal(false)} onSaved={fetchProducts} />
      <EditProductModal open={editProductId !== null} productId={editProductId} onClose={() => setEditProductId(null)} onSaved={fetchProducts} />
    </>
  );
}