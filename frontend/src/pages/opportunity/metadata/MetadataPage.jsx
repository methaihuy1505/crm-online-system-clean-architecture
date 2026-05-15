import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Import các Module Form đã bóc tách
import StageInput from "./StageInput";
import StageEdit from "./StageEdit";
import StatusInput from "./StatusInput";
import StatusEdit from "./StatusEdit";
import ReasonInput from "./ReasonInput";
import ReasonEdit from "./ReasonEdit";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

const iconStyle = {
  fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
};

export default function MetadataPage() {
  // Điều khiển Tab: 'stage' | 'status' | 'reason'
  const [activeTab, setActiveTab] = useState("stage");

  // Dữ liệu và trạng thái danh sách
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Điều khiển các Modal Thêm mới / Sửa
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const searchInputRef = useRef(null);

  // Lấy cấu hình dựa vào Tab hiện tại
  const tabConfig = {
    stage: { endpoint: "/opportunity-stages", label: "Giai đoạn" },
    status: { endpoint: "/opportunity-statuses", label: "Trạng thái" },
    reason: { endpoint: "/lost-reasons", label: "Lý do thất bại" },
  };

  const currentConfig = tabConfig[activeTab];

  // Hàm gọi API lấy dữ liệu
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(currentConfig.endpoint);
      setData(response.data || []);
      setSelectedIndex(-1);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu cấu hình:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Xử lý bộ lọc tìm kiếm cục bộ (Realtime Debounce / Filter tương tự Product)
  const filteredData = data.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const name = (item.name || item.reasonName || "").toLowerCase();
    const code = (item.code || item.reasonCode || "").toLowerCase();
    return name.includes(searchLower) || code.includes(searchLower);
  });

  const selectedItem =
    selectedIndex !== -1 ? filteredData[selectedIndex] : null;

  // Xử lý phím tắt di chuyển dòng
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      )
        return;
      if (showAddModal || editId !== null) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredData.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter" && selectedItem) {
        e.preventDefault();
        setEditId(selectedItem.id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredData, selectedItem, showAddModal, editId]);

  return (
    <div className="flex flex-col h-screen bg-[#f3f4f5] font-sans antialiased select-none text-[#191c1d]">
      {/* Header điều hướng Tab */}
      <header className="flex items-center justify-between px-8 py-3 bg-white border-b border-slate-200/60 shrink-0 shadow-xs">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-black tracking-tight text-[#000666]">
            QUẢN LÝ METADATA
          </h1>

          {/* Nhóm nút chuyển Tab chuẩn M3 */}
          <nav className="flex bg-slate-100 p-1 rounded-xl gap-1">
            {Object.keys(tabConfig).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchTerm("");
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === tab
                    ? "bg-[#1a237e] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                }`}
              >
                {tabConfig[tab].label}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1a237e] text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all"
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={iconStyle}
          >
            add
          </span>
          THÊM {currentConfig.label.toUpperCase()}
        </button>
      </header>

      {/* Giao diện chính: Split-view */}
      <div className="flex flex-1 overflow-hidden">
        {/* Bên trái: Danh sách bảng dữ liệu Full màn hình */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden m-4 rounded-2xl border border-slate-200/50 shadow-xs">
          {/* Thanh tìm kiếm */}
          <div className="px-8 py-3.5 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0 bg-linear-to-b from-slate-50/50 to-white">
            <div className="relative flex-1 max-w-md">
              <span
                className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-[18px]"
                style={iconStyle}
              >
                search
              </span>
              <input
                ref={searchInputRef}
                type="text"
                placeholder={`Tìm kiếm tên hoặc mã ${currentConfig.label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200/50 focus:bg-white border-none rounded-xl outline-none transition-all focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Tổng số: {filteredData.length} bản ghi
            </p>
          </div>

          {/* Bảng dữ liệu */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-black text-slate-400 uppercase tracking-widest sticky top-0 z-10 backdrop-blur-md">
                  <th className="pl-8 py-3 w-1/3">Tên hiển thị</th>
                  <th className="pl-4 py-3 w-1/4">Mã định danh</th>
                  {activeTab === "stage" && (
                    <th className="pl-4 py-3">Xác suất (%)</th>
                  )}
                  {activeTab === "stage" && (
                    <th className="pl-4 py-3">Loại trạng thái</th>
                  )}
                  {activeTab === "status" && (
                    <th className="pl-4 py-3">Bước kết thúc (Final)</th>
                  )}
                  {activeTab === "reason" && (
                    <th className="pl-4 py-3">Mô tả</th>
                  )}
                  <th className="pr-8 py-3 text-right w-24">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-20 text-center text-xs font-semibold text-slate-400"
                    >
                      Đang tải dữ liệu cấu hình...
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item, index) => {
                    const isActive = index === selectedIndex;
                    return (
                      <tr
                        key={item.id}
                        className={`group border-b border-slate-50 transition-colors duration-150 cursor-pointer ${
                          isActive
                            ? "bg-blue-50/70 hover:bg-blue-50"
                            : "hover:bg-[#f3f4f5]"
                        }`}
                        onClick={() => setSelectedIndex(index)}
                      >
                        <td className="pl-8 py-2 overflow-hidden truncate font-semibold text-sm text-[#191c1d]">
                          {item.name || item.reasonName}
                        </td>
                        <td className="pl-4 py-2 overflow-hidden truncate font-mono text-[12px] text-slate-500">
                          {item.code || item.reasonCode}
                        </td>

                        {/* Render các cột đặc thù theo Tab */}
                        {activeTab === "stage" && (
                          <>
                            <td className="pl-4 py-2 text-sm font-bold text-indigo-600">
                              {item.probabilityDefault}%
                            </td>
                            <td className="pl-4 py-2">
                              <span
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                                  item.stageType === "CLOSED"
                                    ? "bg-red-50 text-red-700 border-red-100"
                                    : "bg-green-50 text-green-700 border-green-100"
                                }`}
                              >
                                {item.stageType ||
                                  (item.isClosed ? "CLOSED" : "OPEN")}
                              </span>
                            </td>
                          </>
                        )}

                        {activeTab === "status" && (
                          <td className="pl-4 py-2">
                            <span
                              className={`w-2 h-2 inline-block rounded-full mr-2 ${item.isFinal ? "bg-red-500" : "bg-slate-300"}`}
                            />
                            <span className="text-xs font-semibold">
                              {item.isFinal ? "Phải" : "Không"}
                            </span>
                          </td>
                        )}

                        {activeTab === "reason" && (
                          <td className="pl-4 py-2 text-xs text-slate-400 overflow-hidden truncate italic">
                            {item.description || "---"}
                          </td>
                        )}

                        {/* Nút hành động sửa nhanh */}
                        <td className="pr-8 py-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditId(item.id);
                            }}
                            className="p-1 text-slate-400 hover:text-blue-900 transition-colors"
                          >
                            <span
                              className="material-symbols-outlined text-[18px]"
                              style={iconStyle}
                            >
                              edit_square
                            </span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-20 text-center text-slate-400 text-xs font-medium"
                    >
                      Không có dữ liệu phù hợp trong danh mục này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>

        {/* Bên phải: Sidebar Inspection Panel hiển thị nhanh chi tiết bản ghi đang chọn */}
        <aside className="hidden xl:block w-80 shrink-0 border-l border-slate-200/50 bg-[#f3f4f5]/50 overflow-y-auto p-6">
          {selectedItem ? (
            <div className="flex flex-col gap-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Xem nhanh thông tin
              </h3>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/40 shadow-xs flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Tên cấu hình
                  </label>
                  <p className="text-sm font-bold text-[#191c1d] mt-0.5">
                    {selectedItem.name || selectedItem.reasonName}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Mã hệ thống
                  </label>
                  <p className="text-xs font-mono text-slate-600 mt-0.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    {selectedItem.code || selectedItem.reasonCode}
                  </p>
                </div>
                {activeTab === "stage" && (
                  <>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        Xác suất thành công
                      </label>
                      <p className="text-sm font-black text-indigo-600 mt-0.5">
                        {selectedItem.probabilityDefault}%
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        Trạng thái chốt
                      </label>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">
                        {selectedItem.stageType === "CLOSED"
                          ? "Đóng quy trình (CLOSED)"
                          : "Đang mở xử lý (OPEN)"}
                      </p>
                    </div>
                  </>
                )}
                {activeTab === "status" && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">
                      Phân loại bước
                    </label>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">
                      {selectedItem.isFinal
                        ? "Trạng thái đóng cuối cùng"
                        : "Trạng thái trung gian"}
                    </p>
                  </div>
                )}
                {activeTab === "reason" && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">
                      Chi tiết mô tả
                    </label>
                    <p className="text-xs text-slate-500 italic mt-1 leading-relaxed">
                      {selectedItem.description || "Không có mô tả bổ sung"}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setEditId(selectedItem.id)}
                  className="w-full mt-2 py-2 bg-slate-100 hover:bg-slate-200/80 text-[#1a237e] rounded-xl text-xs font-bold transition-all"
                >
                  Chỉnh sửa cấu hình
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-4">
              <span
                className="material-symbols-outlined text-4xl mb-2 opacity-40"
                style={iconStyle}
              >
                info
              </span>
              <p className="text-xs font-medium leading-relaxed">
                Chọn một dòng bất kỳ để xem nhanh thông tin chi tiết
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* ── QUẢN LÝ KHAI BÁO CÁC MODAL THEO TAB ── */}
      {activeTab === "stage" && (
        <>
          <StageInput
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSaved={fetchData}
          />
          <StageEdit
            open={editId !== null}
            stageId={editId}
            onClose={() => setEditId(null)}
            onSaved={fetchData}
          />
        </>
      )}

      {activeTab === "status" && (
        <>
          <StatusInput
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSaved={fetchData}
          />
          <StatusEdit
            open={editId !== null}
            statusId={editId}
            onClose={() => setEditId(null)}
            onSaved={fetchData}
          />
        </>
      )}

      {activeTab === "reason" && (
        <>
          <ReasonInput
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSaved={fetchData}
          />
          <ReasonEdit
            open={editId !== null}
            reasonId={editId}
            onClose={() => setEditId(null)}
            onSaved={fetchData}
          />
        </>
      )}
    </div>
  );
}
