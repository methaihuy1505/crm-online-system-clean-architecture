package com.vti.crm.interfaces.dto.response.opportunity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpportunityResponse {

    private Integer id;
    private String opportunityCode;
    private String name;
    private Integer customerId;

    private Integer stageId;
    private String stageName;

    private Integer statusId;
    private String statusName;

    private Integer lostReasonId;
    private String lostReasonName;

    private Double totalAmount;
    private Double depositAmount;
    private Double remainingAmount;
    private Integer probability;

}
