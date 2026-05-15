package com.vti.crm.domain.model;

public class OpportunityStage {
    private Integer id;
    private String name;
    private Integer probabilityDefault;
    private Integer sortOrder;
    private Boolean isClosed;


    public OpportunityStage(String name, Integer probabilityDefault, Integer sortOrder) {
        this(null,name,probabilityDefault,sortOrder,false);
    }

    public OpportunityStage(Integer id, String name, Integer probabilityDefault, Integer sortOrder,boolean isClosed) {
        this.id = id;
        this.name = validateInput(name,"Tên khong được để trống");
        this.probabilityDefault = (probabilityDefault<0)?0:probabilityDefault;
        this.sortOrder = (sortOrder != null && sortOrder < 0) ? 0 : sortOrder;
        this.isClosed=isClosed;
    }

    public void update(String name, Integer probabilityDefault, Integer sortOrder){
        this.name = validateInput(name,"Tên khong được để trống");
        this.probabilityDefault = (probabilityDefault<0)?0:probabilityDefault;
        this.sortOrder = (sortOrder != null && sortOrder < 0) ? 0 : sortOrder;
    }


    private String validateInput(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " không được để trống");
        }
        return value.trim();   // trim để loại bỏ khoảng trắng thừa
    }

    public void closed(){
        isClosed =true;
    }
    public void open(){
        isClosed = false;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Integer getProbabilityDefault() {
        return probabilityDefault;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public Boolean getClosed() {
        return isClosed;
    }


    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
