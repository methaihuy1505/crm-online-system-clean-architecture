package com.vti.crm.interfaces.dto.request.opportunity;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OpportunityRequest {
    private String        opportunityCode;
    private String        name;
    private Integer       customerId;
    private Integer       campaignId;          // thêm
    private Integer       stageId;
    private Integer       statusId;
    private Integer       lostReasonId;
    private LocalDateTime nextFollowUpDate;    // thêm
    private Double        totalAmount;
    private Double        depositAmount;
    private Double        remainingAmount;
    private String        currencyCode;        // thêm — nếu null, domain tự default VND
    private Integer       probability;
    private LocalDateTime expectedCloseDate;   // thêm
    private LocalDateTime actualCloseDate;     // thêm
    private String        description;
    private Integer       assignedTo;          // thêm — nếu null, domain tự default 0
}