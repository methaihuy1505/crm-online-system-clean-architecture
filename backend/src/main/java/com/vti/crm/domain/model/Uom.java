package com.vti.crm.domain.model;


import java.beans.ConstructorProperties;

public class Uom {   // Aggregate Root

    private final Integer id;           // do DB sinh, có thể là null ban đầu
    private String code;
    private String name;
    private boolean active;             // đổi tên status thành active cho rõ nghĩa

    // Constructor cho tạo mới (thường dùng khi tạo từ Application Layer)
    @ConstructorProperties({"code", "name"})
    public Uom(String code, String name) {
        this(null, code, name, true);   // gọi constructor đầy đủ
    }

    // Constructor đầy đủ (dùng trong persistence hoặc khi load từ DB)
    @ConstructorProperties({"id", "code", "name", "active"})
    public Uom(Integer id, String code, String name, boolean active) {
        this.id =  id;
        this.code = validateInput(code, "Mã đơn vị");
        this.name = validateInput(name, "Tên đơn vị");
        this.active = active;
    }

    /**
     * Cập nhật thông tin Uom
     */
    public void update(String code, String name, boolean active) {
        this.code = validateInput(code, "Mã đơn vị");
        this.name = validateInput(name, "Tên đơn vị");
        this.active = active;
    }

    /**
     * Validation chung
     */
    private String validateInput(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " không được để trống");
        }
        return value.trim();   // trim để loại bỏ khoảng trắng thừa
    }

    // ====================== GETTERS ======================
    public Integer getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public boolean isActive() {        // đổi từ isStatus() thành isActive()
        return active;
    }

    // Nếu muốn soft delete hoặc deactivate
    public void deactivate() {
        this.active = false;
    }

    public void activate() {
        this.active = true;
    }
}