package com.vti.crm.interfaces.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpportunityStatusResponse {
    private Integer id;
    private String code;
    private String name;
    private Boolean isFinal;
}