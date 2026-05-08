import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Import các Modal mới bóc tách sử dụng State
import StageModal from "./StageAdd";
import StatusModal from "./StatusAdd";
import ReasonModal from "./LostReasons";

const api = axios.create({ baseURL: "http://localhost:8080/api/v1" });
const iconStyle = {
  fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
};

export default function MetadataManagement() {
  const [stages, setStages] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(false);

  // Trạng thái điều khiển Modal
  const [stageModal, setStageModal] = useState({ open: false, id: null });
  const [statusModal, setStatusModal] = useState({ open: false, id: null });
  const [reasonModal, setReasonModal] = useState({ open: false, id: null });
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    type: "",
    id: null,
    name: "",
  });

  // TRẠNG THÁI PHÍM TẮT & DI CHUYỂN DÒNG TOÀN CỤC
  const [activeColumn, setActiveColumn] = useState(0);
  const [stageIndex, setStageIndex] = useState(-1);
  const [statusIndex, setStatusIndex] = useState(-1);
  const [reasonIndex, setReasonIndex] = useState(-1);

  // Refs điều khiển Scroll tự động
  const stageScrollRef = useRef(null);
  const statusScrollRef = useRef(null);
  const reasonScrollRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stg, sts, rsn] = await Promise.all([
        api.get("/opportunity-stages"),
        api.get("/opportunity-statuses"),
        api.get("/lost-reasons"),
      ]);
      setStages(stg.data || []);
      setStatuses(sts.data || []);
      setReasons(rsn.data || []);
    } catch (err) {
      console.error("Lỗi đồng bộ Metadata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- LOGIC TỰ ĐỘNG SCROLL CHO TỪNG CỘT KHI ĐIỀU HƯỚNG BÀN PHÍM ---
  const handleAutoScroll = (containerRef, index) => {
    if (index === -1 || !containerRef.current) return;
    const activeRow = containerRef.current.querySelector(
      `[data-index="${index}"]`,
    );
    if (activeRow) {
      const container = containerRef.current;
      const rowTop = activeRow.offsetTop;
      const rowBottom = rowTop + activeRow.offsetHeight;
      if (rowTop < container.scrollTop) {
        container.scrollTo({ top: rowTop, behavior: "smooth" });
      } else if (rowBottom > container.scrollTop + container.clientHeight) {
        container.scrollTo({
          top: rowBottom - container.clientHeight,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    handleAutoScroll(stageScrollRef, stageIndex);
  }, [stageIndex]);
  useEffect(() => {
    handleAutoScroll(statusScrollRef, statusIndex);
  }, [statusIndex]);
  useEffect(() => {
    handleAutoScroll(reasonScrollRef, reasonIndex);
  }, [reasonIndex]);

  // --- HỆ THỐNG HOTKEYS LẮNG NGHE TOÀN CỤC ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)
      ) {
        if (e.key === "Escape") document.activeElement.blur();
        return;
      }

      if (e.key === "Escape") {
        setStageModal({ open: false, id: null });
        setStatusModal({ open: false, id: null });
        setReasonModal({ open: false, id: null });
        setConfirmDelete({ open: false, type: "", id: null, name: "" });
        return;
      }

      if (
        stageModal.open ||
        statusModal.open ||
        reasonModal.open ||
        confirmDelete.open
      )
        return;

      if (e.altKey) {
        if (e.key === "1") {
          e.preventDefault();
          setStageModal({ open: true, id: null });
        }
        if (e.key === "2") {
          e.preventDefault();
          setStatusModal({ open: true, id: null });
        }
        if (e.key === "3") {
          e.preventDefault();
          setReasonModal({ open: true, id: null });
        }
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveColumn((prev) => (prev < 2 ? prev + 1 : 0));
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveColumn((prev) => (prev > 0 ? prev - 1 : 2));
      }

      if (activeColumn === 0) {
        if (e.key === "ArrowDown" && stages.length > 0) {
          e.preventDefault();
          setStageIndex((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setStageIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        if ((e.key === "e" || e.key === "E") && stageIndex !== -1) {
          setStageModal({ open: true, id: stages[stageIndex]?.id });
        }
        if (
          (e.key === "Delete" || e.key === "Backspace") &&
          stageIndex !== -1
        ) {
          setConfirmDelete({
            open: true,
            type: "stage",
            id: stages[stageIndex].id,
            name: stages[stageIndex].name,
          });
        }
      } else if (activeColumn === 1) {
        if (e.key === "ArrowDown" && statuses.length > 0) {
          e.preventDefault();
          setStatusIndex((prev) =>
            prev < statuses.length - 1 ? prev + 1 : prev,
          );
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setStatusIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        if ((e.key === "e" || e.key === "E") && statusIndex !== -1) {
          setStatusModal({ open: true, id: statuses[statusIndex]?.id });
        }
        if (
          (e.key === "Delete" || e.key === "Backspace") &&
          statusIndex !== -1
        ) {
          setConfirmDelete({
            open: true,
            type: "status",
            id: statuses[statusIndex].id,
            name: statuses[statusIndex].name,
          });
        }
      } else if (activeColumn === 2) {
        if (e.key === "ArrowDown" && reasons.length > 0) {
          e.preventDefault();
          setReasonIndex((prev) =>
            prev < reasons.length - 1 ? prev + 1 : prev,
          );
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setReasonIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        if ((e.key === "e" || e.key === "E") && reasonIndex !== -1) {
          setReasonModal({ open: true, id: reasons[reasonIndex]?.id });
        }
        if (
          (e.key === "Delete" || e.key === "Backspace") &&
          reasonIndex !== -1
        ) {
          setConfirmDelete({
            open: true,
            type: "reason",
            id: reasons[reasonIndex].id,
            name: reasons[reasonIndex].reasonName,
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    activeColumn,
    stageIndex,
    statusIndex,
    reasonIndex,
    stages,
    statuses,
    reasons,
    stageModal,
    statusModal,
    reasonModal,
    confirmDelete,
  ]);

  const executeDelete = async () => {
    const { type, id } = confirmDelete;
    try {
      let endpoint = "";
      if (type === "stage") endpoint = `/opportunity-stages/${id}`;
      if (type === "status") endpoint = `/opportunity-statuses/${id}`;
      if (type === "reason") endpoint = `/lost-reasons/${id}`;

      await api.delete(endpoint);
      setConfirmDelete({ open: false, type: "", id: null, name: "" });
      setStageIndex(-1);
      setStatusIndex(-1);
      setReasonIndex(-1);
      fetchData();
    } catch (err) {
      alert("Không thể xóa mục này do ràng buộc dữ liệu hệ thống!" + err);
    }
  };

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

      <div className="bg-[#f8f9fa] text-[#191c1d] h-screen flex flex-col font-sans p-8 overflow-hidden select-none">
        <div className="mb-6 shrink-0">
          <h1 className="text-3xl font-black text-[#1a237e] tracking-tight">
            Cấu hình Hệ thống Metadata
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Mũi tên <kbd className="bg-slate-200 px-1.5 rounded">←</kbd>{" "}
            <kbd className="bg-slate-200 px-1.5 rounded">→</kbd> đổi cột focus |
            Tổ hợp{" "}
            <kbd className="bg-slate-200 px-1.5 rounded">Alt + 1/2/3</kbd> thêm
            mới | Dùng phím <kbd className="bg-slate-200 px-1.5 rounded">E</kbd>{" "}
            để sửa nhanh
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 mb-4">
          {/* CỘT PANEL 1: STAGES */}
          <div
            className={`bg-white rounded-2xl border transition-all flex flex-col overflow-hidden shadow-sm ${activeColumn === 0 ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200"}`}
          >
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
              <span className="text-xs font-black uppercase text-[#1a237e]">
                1. Giai đoạn (Stages)
              </span>
              <button
                onClick={() => setStageModal({ open: true, id: null })}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
            <div
              ref={stageScrollRef}
              className="flex-1 overflow-y-auto p-2"
              style={{ scrollbarWidth: "none" }}
            >
              {loading ? (
                <div className="p-4 text-center text-xs text-slate-400 animate-pulse">
                  Đang đồng bộ...
                </div>
              ) : (
                stages.map((s, index) => (
                  <div
                    key={s.id}
                    data-index={index}
                    onClick={() => {
                      setActiveColumn(0);
                      setStageIndex(index);
                    }}
                    className={`p-3 rounded-xl mb-1.5 cursor-pointer flex justify-between items-center transition-all ${index === stageIndex && activeColumn === 0 ? "bg-blue-50 border border-blue-200" : "hover:bg-slate-50 border border-transparent"}`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {s.name}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">
                        {s.code} • XS: {s.probabilityDefault}%
                      </p>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 uppercase font-bold">
                      {s.stageType}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CỘT PANEL 2: STATUSES */}
          <div
            className={`bg-white rounded-2xl border transition-all flex flex-col overflow-hidden shadow-sm ${activeColumn === 1 ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200"}`}
          >
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
              <span className="text-xs font-black uppercase text-[#1a237e]">
                2. Trạng thái (Statuses)
              </span>
              <button
                onClick={() => setStatusModal({ open: true, id: null })}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
            <div
              ref={statusScrollRef}
              className="flex-1 overflow-y-auto p-2"
              style={{ scrollbarWidth: "none" }}
            >
              {loading ? (
                <div className="p-4 text-center text-xs text-slate-400 animate-pulse">
                  Đang đồng bộ...
                </div>
              ) : (
                statuses.map((s, index) => (
                  <div
                    key={s.id}
                    data-index={index}
                    onClick={() => {
                      setActiveColumn(1);
                      setStatusIndex(index);
                    }}
                    className={`p-3 rounded-xl mb-1.5 cursor-pointer flex justify-between items-center transition-all ${index === statusIndex && activeColumn === 1 ? "bg-blue-50 border border-blue-200" : "hover:bg-slate-50 border border-transparent"}`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {s.name}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">
                        {s.code}
                      </p>
                    </div>
                    {s.isFinal && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-red-50 text-red-600 rounded font-bold">
                        FINAL
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CỘT PANEL 3: REASONS */}
          <div
            className={`bg-white rounded-2xl border transition-all flex flex-col overflow-hidden shadow-sm ${activeColumn === 2 ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200"}`}
          >
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
              <span className="text-xs font-black uppercase text-[#1a237e]">
                3. Lý do thất bại (Reasons)
              </span>
              <button
                onClick={() => setReasonModal({ open: true, id: null })}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
            <div
              ref={reasonScrollRef}
              className="flex-1 overflow-y-auto p-2"
              style={{ scrollbarWidth: "none" }}
            >
              {loading ? (
                <div className="p-4 text-center text-xs text-slate-400 animate-pulse">
                  Đang đồng bộ...
                </div>
              ) : (
                reasons.map((r, index) => (
                  <div
                    key={r.id}
                    data-index={index}
                    onClick={() => {
                      setActiveColumn(2);
                      setReasonIndex(index);
                    }}
                    className={`p-3 rounded-xl mb-1.5 cursor-pointer flex flex-col transition-all ${index === reasonIndex && activeColumn === 2 ? "bg-blue-50 border border-blue-200" : "hover:bg-slate-50 border border-transparent"}`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-slate-800">
                        {r.name}
                      </p>
                      <span className="text-[9px] font-mono text-slate-400">
                        {r.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-1">
                      {r.description || "Không có mô tả chi tiết."}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <StageModal
        open={stageModal.open}
        stageId={stageModal.id}
        onClose={() => setStageModal({ open: false, id: null })}
        onSaved={fetchData}
      />
      <StatusModal
        open={statusModal.open}
        statusId={statusModal.id}
        onClose={() => setStatusModal({ open: false, id: null })}
        onSaved={fetchData}
      />
      <ReasonModal
        open={reasonModal.open}
        reasonId={reasonModal.id}
        onClose={() => setReasonModal({ open: false, id: null })}
        onSaved={fetchData}
      />

      {confirmDelete.open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            onClick={() =>
              setConfirmDelete({ open: false, type: "", id: null, name: "" })
            }
          />
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center">
            <span
              className="material-symbols-outlined text-red-500 text-4xl mb-2"
              style={iconStyle}
            >
              delete_forever
            </span>
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              Xác nhận xóa dữ liệu?
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Bạn đang chuẩn bị xóa mục{" "}
              <span className="text-slate-700 font-bold">
                "{confirmDelete.name}"
              </span>
              . Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() =>
                  setConfirmDelete({
                    open: false,
                    type: "",
                    id: null,
                    name: "",
                  })
                }
                className="px-4 py-1.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={executeDelete}
                className="px-5 py-1.5 bg-red-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-red-700 transition-all"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
