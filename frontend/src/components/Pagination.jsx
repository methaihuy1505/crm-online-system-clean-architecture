import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onChangePage,
  totalElements,
}) {
  // Nếu chỉ có 1 trang hoặc không có trang nào thì không cần hiện phân trang
  if (totalPages <= 1) return null;

  const handlePrevClick = () => {
    if (currentPage > 0) onChangePage(currentPage - 1);
  };

  const handleNextClick = () => {
    if (currentPage < totalPages - 1) onChangePage(currentPage + 1);
  };

  // Tạo mảng các số trang muốn hiển thị quanh trang hiện tại
  // Ví dụ: hiển thị tối đa 3 nút số
  const renderPageButtons = () => {
    const pages = [];
    const startPage = Math.max(0, Math.min(currentPage, totalPages - 3));
    const endPage = Math.min(totalPages, startPage + 3);

    for (let i = startPage; i < endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onChangePage(i)}
          className={`px-4 py-2 text-[11px] font-semibold rounded-md transition-colors ${
            currentPage === i
              ? "bg-blue-600 text-white" // Trang hiện tại: xanh đậm
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300" // Trang khác
          }`}
        >
          {i + 1}
        </button>,
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-4 px-2 py-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          Tổng số :{" "}
          <span className="text-slate-800 font-bold">{totalElements}</span>
        </div>
        <div className="w-[1px] h-3 bg-slate-200"></div>
        <div className="flex items-center gap-1">
          số item hiển thị/trang:{" "}
          <span className="text-primary font-bold">200/{totalPages}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-4">
        {/* Nút lùi */}
        <button
          onClick={handlePrevClick}
          disabled={currentPage === 0}
          className="p-2 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Render các nút số động */}
        {renderPageButtons()}

        {/* Hiển thị dấu ... và trang cuối nếu cần */}
        {currentPage + 2 < totalPages - 1 && (
          <>
            <span className="px-2 text-gray-400">...</span>
            <button
              onClick={() => onChangePage(totalPages - 1)}
              className="px-4 py-2 text-[11px] font-semibold bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-md"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Nút tiến */}
        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages - 1}
          className="p-2 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
        
    </div>
  );
}
