package com.vti.crm.domain.model;

import lombok.Getter;

@Getter
public class CustomerRank {
    private Integer id;
    private String name;

    public CustomerRank(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
}