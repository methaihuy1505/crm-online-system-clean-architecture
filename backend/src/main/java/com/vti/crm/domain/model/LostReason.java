package com.vti.crm.domain.model;



public class LostReason {
    private Integer id;
    private String code;
    private String name;
    private String description;

    public LostReason(String code, String name, String description) {
        this(null ,code,name,description);
    }

    public LostReason(Integer id, String code, String name, String description) {
        this.id = id;
        this.code = validateInput(code,"Mã thất bại");
        this.name = validateInput(name,"Tên thất bại");
        this.description = description;
    }

    private String validateInput(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " không được để trống");
        }
        return value.trim();   // trim để loại bỏ khoảng trắng thừa
    }
    public void update( String name, String description){
        this.name = validateInput(name,"Tên thất bại");
        this.description = description;
    }

    public Integer getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }
}
