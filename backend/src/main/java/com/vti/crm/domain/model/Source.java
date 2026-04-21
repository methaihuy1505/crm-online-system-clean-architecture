package com.vti.crm.domain.model;

import lombok.Getter;

@Getter
public class Source {
    private Integer id;
    private String name;
    private Boolean isActive;

    public Source(Integer id, String name, Boolean isActive) {
        this.id = id;
        this.name = name;
        this.isActive = isActive;
    }
}