// Hàm format tiền tệ (VND)
export const formatCurrency = (amount) => {
  if (!amount) return "Chưa cập nhật";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Hàm lấy 2 chữ cái đầu của tên (ví dụ: Nguyễn Văn A -> NA)
export const getInitials = (fullName) => {
  if (!fullName) return "KH";
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Hàm tính toán trạng thái chiến dịch dựa vào ngày
export const getCampaignStatus = (start, end) => {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (now < startDate) {
    return {
      label: "Sắp tới",
      color: "bg-primary-fixed text-on-primary-fixed-variant",
      dot: "bg-primary",
    };
  } else if (now > endDate) {
    return {
      label: "Đã kết thúc",
      color: "bg-surface-container-highest text-on-surface-variant",
      dot: "bg-outline",
    };
  } else {
    return {
      label: "Đang diễn ra",
      color: "bg-secondary-container/15 text-secondary",
      dot: "bg-secondary",
    };
  }
};
