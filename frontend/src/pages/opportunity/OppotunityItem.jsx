import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
// --- Icons ---
function Icon({ path, size = 18, color = "currentColor", strokeWidth = 1.5 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}
const API_BASE_URL = "http://localhost:8080/api/v1/opportunity-items";
const ic = {
  grid: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z",
  handshake: "M7 11l4.08 4.08a1 1 0 001.41 0L20 7M4 12l3 3 7-7M16 7h4v4",
  inventory:
    "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z",
  analytics:
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  settings:
    "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0",
  plus: "M12 4v16m8-8H4",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  bell: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  help: "M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  user: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z",
  chevR: "M9 5l7 7-7 7",
  chevL: "M15 19l-7-7 7-7",
  trending: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  filter: "M3 4h18M7 8h10M11 12h2M11 16h2",
  download: "M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 11l5 5 5-5M12 4v12",
  edit: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  trash:
    "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  addCircle: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
  receipt:
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  arch: "M3 21h18M9 21V9l3-6 3 6v12M9 12h6",
};

// --- Data ---

function fmt(n) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

// --- Component ---
export default function OpportunityLineItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Lấy id từ URL (ví dụ: /opportunitylineitems/12)
  const { id: opportunityId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Chỉ gọi API khi có opportunityId
    if (opportunityId) {
      fetchItems();
    } else {
      setLoading(false);
      console.warn("Không tìm thấy Opportunity ID trên URL");
    }
  }, [opportunityId]); // Theo dõi opportunityId để fetch lại nếu ID thay đổi

  const fetchItems = async () => {
    try {
      setLoading(true);
      // Gửi request xuống Backend theo ID cụ thể
      // Giả sử API của bạn là: GET /api/v1/opportunity-items/opportunity/12
      // Hoặc sửa lại URL tùy theo mapping thực tế ở Controller của bạn
      const response = await axios.get(
        `${API_BASE_URL}/opportunity/${opportunityId}`,
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.content;

      setItems(data || []);
    } catch (error) {
      console.error("Lỗi khi fetch items:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };
  const handleAddClick = () => {
    if (opportunityId) {
      navigate(`/addeditlineitem/${opportunityId}`);
    } else {
      alert("Cần có Opportunity ID để thêm mục mới!");
    }
  };
  // 2. Xử lý Xóa item khỏi DB
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mục này?")) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        // Xóa thành công trên DB thì cập nhật lại UI
        setItems((prev) => prev.filter((i) => i.id !== id));
      } catch (error) {
        alert("Xóa thất bại! Vui lòng thử lại.");
        console.error("Delete error:", error);
      }
    }
  };
  const handleFinalize = async () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        items.map((item) => ({
          ID: item.id,
          // Cách 1: Dùng biến opportunityId từ useParams (Khuyên dùng)
          "Opportunity ID": opportunityId,

          // Cách 2: Nếu muốn lấy từ data của item (phòng hờ)
          // "Opportunity ID": item.opportunity?.id || item.opportunityId || opportunityId,

          "Product Name": item.productName,
          Quantity: item.quantity,
          "Unit Price": item.unitPrice,
          "VAT (%)": item.vatRate,
          Discount: item.discountAmount,
          "Final Total": item.finalLineTotal,
        })),
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Quote Details");

      XLSX.writeFile(
        workbook,
        `Quote_${opportunityId}_${new Date().getTime()}.xlsx`,
      );

      alert("Quote finalized and Excel exported!");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // 3. Logic hiển thị/tính toán (Map lại theo tên trường của
  // Entity)
  // 1. Lọc danh sách (giữ nguyên logic của bạn)
  const filteredSearch = items.filter(
    (i) =>
      i.productName?.toLowerCase().includes(search.toLowerCase()) ||
      String(i.id).includes(search),
  );

  // 2. Định nghĩa số mục mỗi trang
  const itemsPerPage = 10;

  // 3. Tính toán startIndex với mặc định là 0
  // Sử dụng Math.max để đảm bảo index không bao giờ âm
  const startIndex = Math.max(0, (page - 1) * itemsPerPage) || 0;

  // 4. Cắt mảng để lấy dữ liệu trang hiện tại
  const paginatedItems = filteredSearch.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // 5. Tính tổng số trang (mặc định tối thiểu là 1 để tránh lỗi UI)
  const totalPages = Math.ceil(filteredSearch.length / itemsPerPage) || 0;
  // Tính toán dựa trên các trường của Entity Java
  const subtotal = items.reduce((s, i) => s + (i.totalPrice || 0), 0);
  const totalDisc = items.reduce((s, i) => s + (i.discountAmount || 0), 0);
  const totalVat = items.reduce((s, i) => s + (i.vatAmount || 0), 0);
  const grandTotal = items.reduce((s, i) => s + (i.finalLineTotal || 0), 0);

  if (loading)
    return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div
      className="flex min-h-screen bg-[#f8f9fa] text-[#191c1d]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Content */}
        <div className="flex flex-1 min-w-0">
          <div className="flex-1 px-8 py-6 min-w-0 overflow-y-auto">
            {/* Page header */}
            <div className="flex justify-between items-end mb-7">
              <div>
                <h2
                  className="text-3xl font-extrabold tracking-tight text-[#191c1d]"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  Opportunity Line Items
                </h2>
                <p className="text-sm text-slate-400 mt-1.5 max-w-lg">
                  Manage detailed specifications and pricing for the
                  Metropolitan Commercial Development project.
                </p>
              </div>
              <button
                onClick={handleAddClick}
                className="flex items-center gap-2 bg-[#000666] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
              >
                <Icon path={ic.addCircle} size={16} />
                Add Line Item
              </button>
            </div>

            {/* Stats bento */}
            <div className="grid grid-cols-12 gap-5 mb-8">
              <div className="col-span-4 bg-[#f3f4f5] p-5 rounded-xl">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Total Gross Value
                </span>
                <div
                  className="mt-3 text-2xl font-black text-[#000666]"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {fmt(grandTotal)}
                </div>
                <div className="flex items-center gap-1 mt-1 text-green-600 text-xs font-bold">
                  <Icon path={ic.trending} size={13} color="currentColor" />
                  +12% vs last quote
                </div>
              </div>
              <div className="col-span-3 bg-[#f3f4f5] p-5 rounded-xl">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Items Count
                </span>
                <div
                  className="mt-3 text-xl font-black"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {items.length} Items
                </div>
                <div className="mt-1 text-xs text-slate-400 font-medium">
                  3 Categories selected
                </div>
              </div>
              <div className="col-span-5 bg-[#1a237e] p-5 rounded-xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-widest text-[#8690ee] uppercase">
                    Estimated Margin
                  </span>
                  <div
                    className="mt-3 text-2xl font-black"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    24.8%
                  </div>
                  <p className="mt-1 text-xs text-[#8690ee] font-medium">
                    Above enterprise benchmark of 18%
                  </p>
                </div>
                <div className="absolute -right-6 -bottom-6 opacity-10">
                  <Icon
                    path={ic.analytics}
                    size={100}
                    color="white"
                    strokeWidth={0.5}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon path={ic.search} size={15} />
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#f3f4f5] border-none rounded-lg pl-9 pr-4 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[#000666]/20 focus:bg-white transition-all"
                  placeholder="Search line items..."
                />
              </div>
            </div>
            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table
                  className="w-full text-left"
                  style={{ borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr className="bg-[#f3f4f5]/50">
                      {[
                        "ID",
                        "Product Name",
                        "Qty",
                        "Unit Price",
                        "VAT (%)",
                        "Discount",
                        "Final Total",
                        "Actions",
                      ].map((h, i) => (
                        <th
                          key={h}
                          className={`px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase ${i >= 2 && i <= 6 ? "text-right" : ""}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Thay filtered bằng paginatedItems ở đây */}
                    {paginatedItems.map((item, idx) => (
                      <tr
                        key={item.id}
                        className={`border-t border-slate-50 hover:bg-[#f3f4f5]/60 transition-colors ${idx % 2 === 0 ? "" : "bg-[#f8f9fa]/40"}`}
                      >
                        <td className="px-5 py-4 font-mono text-[11px] text-slate-400">
                          #{item.id}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-sm text-[#191c1d]">
                            {item.productName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {item.uomName}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-right text-sm font-medium">
                          {item.quantity}
                        </td>
                        <td className="px-5 py-4 text-right text-sm font-medium">
                          {fmt(item.unitPrice)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#33a0fd]/10 text-[#00355c]">
                            {item.vatRate}%
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right text-sm font-medium text-[#ba1a1a]">
                          -{fmt(item.discountAmount || 0)}
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-sm text-[#000666]">
                          {fmt(item.finalLineTotal)}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 text-slate-400 hover:text-[#ba1a1a] transition-all"
                            >
                              <Icon path={ic.trash} size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* --- Bộ điều hướng phân trang (Pagination Controls) --- */}
              <div className="mt-4 flex items-center justify-between px-2">
                <p className="text-xs text-slate-400 font-medium">
                  Showing{" "}
                  <span className="text-[#191c1d]">{startIndex + 1}</span> to{" "}
                  <span className="text-[#191c1d]">
                    {Math.min(startIndex + itemsPerPage, filteredSearch.length)}
                  </span>{" "}
                  of{" "}
                  <span className="text-[#191c1d]">
                    {filteredSearch.length}
                  </span>{" "}
                  entries
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-[#000666] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  >
                    <Icon path={ic.chevronLeft} size={16} />
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          page === i + 1
                            ? "bg-[#000666] text-white shadow-md shadow-blue-900/20"
                            : "text-slate-400 hover:bg-white hover:text-[#000666]"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || totalPages === 0}
                    className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-[#000666] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  >
                    <Icon path={ic.chevronRight} size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="mt-7 flex justify-end">
              <div className="w-full max-w-xs bg-[#f3f4f5] p-7 rounded-2xl">
                <div className="space-y-3">
                  {[
                    {
                      label: "Subtotal",
                      val: fmt(subtotal), // Tổng totalPrice của các item
                      cls: "text-[#191c1d] font-bold",
                    },
                    {
                      label: "Total Discount",
                      val: totalDisc > 0 ? `-${fmt(totalDisc)}` : fmt(0), // Tổng discountAmount
                      cls: "text-[#ba1a1a] font-bold",
                    },
                    {
                      label: "VAT (Estimated)",
                      val: fmt(totalVat), // Tổng vatAmount
                      cls: "text-[#191c1d] font-bold",
                    },
                  ].map(({ label, val, cls }) => (
                    <div
                      key={label}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-slate-400 font-medium">
                        {label}
                      </span>
                      <span
                        className={cls}
                        style={{ fontFamily: "Manrope, sans-serif" }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}

                  {/* --- Tổng cộng cuối cùng --- */}
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                        Final Line Total
                      </span>
                      <div
                        className="text-2xl font-black text-[#000666] mt-1"
                        style={{ fontFamily: "Manrope, sans-serif" }}
                      >
                        {fmt(grandTotal)} {/* Tổng finalLineTotal từ DB */}
                      </div>
                    </div>
                    <Icon
                      path={ic.receipt}
                      size={36}
                      color="#1a237e"
                      strokeWidth={0.8}
                    />
                  </div>
                </div>

                {/* Nút hành động */}
                <button
                  className="w-full mt-6 py-3.5 bg-[#000666] text-white rounded-xl font-bold text-sm tracking-tight active:scale-[0.99] hover:opacity-90 transition-all shadow-lg shadow-blue-900/10"
                  onClick={handleFinalize}
                >
                  Finalize Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
