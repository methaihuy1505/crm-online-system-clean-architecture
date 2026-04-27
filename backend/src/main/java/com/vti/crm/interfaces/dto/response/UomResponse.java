package com.vti.crm.interfaces.dto.response;

import com.vti.crm.domain.model.Uom;
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