package com.vti.crm.domain.model;

import lombok.Getter;

@Getter
public class LeadStatus {
    private Integer id;
    private String name;
    private Boolean isActive;

    public LeadStatus(Integer id, String name, Boolean isActive) {
        this.id = id;
        this.name = name;
        this.isActive = isActive;
    }
}