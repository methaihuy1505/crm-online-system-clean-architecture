package com.vti.crm.interfaces.dto.response.opportunity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpportunityStageResponse {
    private Integer id;
    private String name;
    private Integer probabilityDefault;
    private Integer sortOrder;
    private Boolean isClosed;
}