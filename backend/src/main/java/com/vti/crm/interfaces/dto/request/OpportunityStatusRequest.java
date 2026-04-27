package com.vti.crm.interfaces.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpportunityStatusRequest {
    private String code;
    private String name;
    private Boolean isFinal;
}