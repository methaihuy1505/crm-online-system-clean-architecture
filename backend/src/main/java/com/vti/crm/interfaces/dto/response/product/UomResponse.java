package com.vti.crm.interfaces.dto.response.product;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UomResponse {

    private Integer id;
    private String code;
    private String name;
    private boolean status;
}