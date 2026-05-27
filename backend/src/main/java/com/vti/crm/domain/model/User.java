package com.vti.crm.domain.model;

import java.time.LocalDateTime;

public class User {
    public enum Status {
        ACTIVE, INACTIVE
    }

    private final Integer id;
    private String username;
    private String fullName;
    private String password;
    private String email;
    private String phone;
    private final Integer roleId;
    private final Integer branchId;
    private final Integer teamId; // Thêm trường teamId
    private Status status;
    private final LocalDateTime createdAt;

    // Constructor cho tạo mới (id được tự động tạo)
    public User(String username, String fullName, String password, String email, String phone,
                Integer roleId, Integer branchId, Integer teamId) {
        this.id = null;
        this.username = validateInput(username, "Tên đăng nhập");
        this.fullName = validateInput(fullName, "Họ tên");
        this.password = validatePassword(password);
        this.email = validateEmail(email);
        this.phone = validatePhone(phone);
        this.roleId = roleId;
        this.branchId = branchId;
        this.teamId = teamId; // Khởi tạo teamId
        this.status = Status.ACTIVE;
        this.createdAt = LocalDateTime.now();
    }

    // Constructor cho lấy từ DB (có id)
    public User(Integer id, String username, String fullName, String password, String email, String phone,
                Integer roleId, Integer branchId, Integer teamId, Status status, LocalDateTime createdAt) {
        this.id = id;
        this.username = validateInput(username, "Tên đăng nhập");
        this.fullName = validateInput(fullName, "Họ tên");
        this.password = password;
        this.email = validateEmail(email);
        this.phone = validatePhone(phone);
        this.roleId = roleId;
        this.branchId = branchId;
        this.teamId = teamId; // Khởi tạo teamId
        this.status = status != null ? status : Status.ACTIVE;
        this.createdAt = createdAt;
    }

    // Update method - không update username, password, createdAt, roleId, branchId, teamId
    public void update(String fullName, String email, String phone, Status status) {
        this.fullName = validateInput(fullName, "Họ tên");
        this.email = validateEmail(email);
        this.phone = validatePhone(phone);
        this.status = status != null ? status : Status.ACTIVE;
    }

    // Update password separately
    public void updatePassword(String newPassword) {
        this.password = validatePassword(newPassword);
    }

    // --- Helpers ---
    private String validateInput(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " không được để trống");
        }
        return value.trim();
    }

    private String validatePassword(String password) {
        String validated = validateInput(password, "Mật khẩu");
        if (validated.length() < 6) {
            throw new IllegalArgumentException("Mật khẩu phải ít nhất 6 ký tự");
        }
        return validated;
    }

    private String validateEmail(String email) {
        String trimmed = validateInput(email, "Email");
        if (!trimmed.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Email không hợp lệ");
        }
        return trimmed;
    }

    private String validatePhone(String phone) {
        if (phone != null && !phone.trim().isEmpty()) {
            String trimmed = phone.trim();
            if (!trimmed.matches("^[0-9]{10,11}$")) {
                throw new IllegalArgumentException("Số điện thoại phải là 10-11 chữ số");
            }
            return trimmed;
        }
        return null;
    }

    // --- Getters ---
    public Integer getId() { return id; }
    public String getUsername() { return username; }
    public String getFullName() { return fullName; }
    public String getPassword() { return password; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public Integer getRoleId() { return roleId; }
    public Integer getBranchId() { return branchId; }
    public Integer getTeamId() { return teamId; } // Getter mới
    public Status getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public boolean isActive() {
        return status == Status.ACTIVE;
    }
}