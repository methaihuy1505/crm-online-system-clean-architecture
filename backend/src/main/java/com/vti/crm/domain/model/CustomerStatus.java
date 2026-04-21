package com.vti.crm.domain.model;

import lombok.Getter;

@Getter
public class CustomerStatus {
    private Integer id;
    private String name;

    public CustomerStatus(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
}