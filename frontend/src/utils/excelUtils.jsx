import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/**
 * Hàm xuất danh sách sản phẩm ra Excel (Bản cập nhật đầy đủ trường)
 * @param {Array} data - Danh sách sản phẩm đã được lọc (filtered)
 */
export const exportProductToExcel = async (data) => {
  if (!data || data.length === 0) {
    alert("Không có dữ liệu để xuất!");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Inventory");

  // 1. Định nghĩa cấu trúc cột (Đã bổ sung các trường mới)
  worksheet.columns = [
    { header: "MÃ SKU", key: "productCode", width: 15 },
    { header: "TÊN SẢN PHẨM", key: "name", width: 35 },
    { header: "DANH MỤC", key: "categoryName", width: 20 },
    { header: "LOẠI", key: "productType", width: 12 },
    { header: "ĐƠN VỊ", key: "uomName", width: 10 },
    { header: "GIÁ CƠ BẢN", key: "basePrice", width: 15 },
    { header: "THUẾ (%)", key: "vatRate", width: 10 },
    // --- Các trường bổ sung ---
    { header: "TIỀN CỌC (VNĐ)", key: "depositOverride", width: 15 },
    { header: "MÔ TẢ", key: "description", width: 40 },
    { header: "NGÀY TẠO", key: "createdAt", width: 15 },
  ];

  // 2. Thêm dữ liệu và định dạng dòng
  data.forEach((item) => {
    const row = worksheet.addRow({
      productCode: item.productCode,
      name: item.name,
      categoryName: item.categoryName || "Chưa phân loại",
      productType: item.productType,
      uomName: item.uomName || "Cái",
      basePrice: item.basePrice || 0,
      vatRate: item.vatRate || 0,
      // Dữ liệu mới từ DB
      depositOverride: item.depositOverride || 0,
      description: item.description || "Không có mô tả",
      createdAt: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("vi-VN")
        : "N/A",
    });

    // Căn lề và định dạng số cho các cột tiền tệ
    ["basePrice", "depositOverride"].forEach((key) => {
      const cell = row.getCell(key);
      cell.alignment = { horizontal: "right" };
      cell.numFmt = "#,##0";
    });

    // Căn giữa cho ngày tháng và mã SKU
    row.getCell("createdAt").alignment = { horizontal: "center" };
    row.getCell("productCode").alignment = { horizontal: "center" };
  });

  // 3. Styling cho Header
  const headerRow = worksheet.getRow(1);
  headerRow.height = 25; // Tăng chiều cao header cho thoáng
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1A237E" }, // Màu xanh đồng bộ UI
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    // Thêm border cho header
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // 4. Xuất file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const fileName = `Inventory_Report_${new Date().toISOString().split("T")[0]}.xlsx`;
  saveAs(blob, fileName);
};
