package com.vti.crm.domain.model;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class BranchProvince {
    private Integer id;
    private Branch branch;
    private Province province;
}