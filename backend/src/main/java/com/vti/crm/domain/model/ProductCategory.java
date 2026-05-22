package com.vti.crm.domain.model;


public class ProductCategory {
    private Integer id;
    private String name;
    private String description;
    private Boolean isDeleted =false ;

    public ProductCategory(String name, String description) {
        this(null,name,description,false);
    }

    public ProductCategory(Integer id, String name, String description, Boolean isDeleted) {
        this.id = id;
        this.name = validateInput(name,"Tên danh mục");
        this.description = (description != null) ? description.trim() : "";;
        this.isDeleted = isDeleted;
    }

    public void update(String name, String description){
        this.name = validateInput(name,"Tên danh mục");
        this.description = (description != null) ? description.trim() : "";;
    }
    public void deleted(){
        this.isDeleted=true;
    }
    public void restore(){
        this.isDeleted=false;
    }
    private String validateInput(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " không được để trống");
        }
        return value.trim();   // trim để loại bỏ khoảng trắng thừa
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Boolean getDeleted() {
        return isDeleted;
    }
}
