package com.vti.crm.domain.model;


import lombok.Getter;

@Getter
public class Customer {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String status;

    public Customer(Long id, String fullName, String email, String phone, String status) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.status = status;
    }

    public Customer(String fullName, String email, String phone) {
        if (fullName == null || fullName.trim().isEmpty()) throw new IllegalArgumentException("Tên không được để trống");
        if (email == null || !email.contains("@")) throw new IllegalArgumentException("Email không hợp lệ");

        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.status = "ACTIVE";
    }

    public void update(String fullName, String email, String phone) {
        if (fullName != null && !fullName.trim().isEmpty()) this.fullName = fullName;
        if (email != null && email.contains("@")) this.email = email;
        if (phone != null) this.phone = phone;
    }

    // THÊM MỚI: Hành vi nghiệp vụ nâng cấp VIP
    public void upgradeToVip() {
        // 1. Kiểm tra điều kiện trạng thái
        if (!"ACTIVE".equals(this.status)) {
            throw new IllegalStateException("Lỗi nghiệp vụ: Chỉ khách hàng đang ACTIVE mới được nâng cấp VIP.");
        }

        // 2. Kiểm tra điều kiện dữ liệu
        if (this.phone == null || this.phone.trim().isEmpty()) {
            throw new IllegalStateException("Lỗi nghiệp vụ: Khách hàng phải bổ sung số điện thoại trước khi lên VIP.");
        }

        // 3. Đổi trạng thái nếu vượt qua mọi vòng kiểm duyệt
        this.status = "VIP";
    }

    // Thêm hành vi vô hiệu hóa khi bị hợp nhất
    public void markAsMerged() {
        this.status = "MERGED";
    }
}
