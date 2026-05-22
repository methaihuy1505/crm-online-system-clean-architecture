package com.vti.crm.domain.model;



public class OpportunityStatus {
    private Integer id;
    private String code;
    private String name;
    private Boolean isFinal;

    public OpportunityStatus(String code, String name) {
        this(null,code,name,false);
    }

    public OpportunityStatus(Integer id, String code, String name,boolean isFinal) {
        this.id = id;
        this.code = validateInput(code,"Mã trạng thái");
        this.name = validateInput(name,"Tên trạng thái");
        this.isFinal=isFinal;
    }

    public void update( String name){
        this.name = validateInput(name,"Tên trạng thái");
    }
    private String validateInput(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " không được để trống");
        }
        return value.trim();   // trim để loại bỏ khoảng trắng thừa
    }

    public void finalized(){
        isFinal=true;
    }
    public void deFinalized(){
        isFinal=false;
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

    public Boolean getFinal() {
        return isFinal;
    }
}
