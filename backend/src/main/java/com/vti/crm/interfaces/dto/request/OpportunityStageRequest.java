package com.vti.crm.interfaces.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpportunityStageRequest {
    private String name;
    private Integer probabilityDefault;
    private Integer sortOrder;
    private Boolean isClosed;
}