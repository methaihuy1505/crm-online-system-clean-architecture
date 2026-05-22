package com.vti.crm.interfaces.dto.request.opportunity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpportunityRequest {

    private String opportunityCode;
    private String name;
    private Integer customerId;
    private Integer stageId;
    private Integer statusId;
    private Integer lostReasonId;

    private Double totalAmount;
    private Double depositAmount;
    private Double remainingAmount;
    private Integer probability;
    private String description;
}