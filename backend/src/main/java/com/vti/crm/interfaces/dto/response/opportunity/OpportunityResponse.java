package com.vti.crm.interfaces.dto.response.opportunity;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OpportunityResponse {
    private Integer       id;
    private String        opportunityCode;
    private String        name;
    private Integer       customerId;
    private Integer       campaignId;          // thêm
    private Integer       stageId;
    private String        stageName;
    private Integer       statusId;
    private String        statusName;
    private Integer       lostReasonId;
    private String        lostReasonName;
    private LocalDateTime nextFollowUpDate;    // thêm
    private Double        totalAmount;
    private Double        depositAmount;
    private Double        remainingAmount;
    private String        currencyCode;        // thêm
    private Integer       probability;
    private LocalDateTime expectedCloseDate;   // thêm
    private LocalDateTime actualCloseDate;     // thêm
    private String        description;
    private Integer       assignedTo;          // thêm
    private Integer       createdBy;           // thêm
    private Integer       updatedBy;           // thêm
    private LocalDateTime createdAt;           // thêm
    private LocalDateTime updatedAt;           // thêm
    private LocalDateTime deletedAt;           // thêm
}
