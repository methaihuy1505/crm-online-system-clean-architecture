package com.vti.crm.domain.model;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Branch {
    private Integer id;
    private String name;
    private String address;
    private String taxCode;
}