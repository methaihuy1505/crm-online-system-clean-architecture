package com.vti.crm.interfaces.dto.request.opportunity;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
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
    private Double    totalAmount;
    private Double    depositAmount;
    private Double    remainingAmount;
    private String        currencyCode;        // thêm — nếu null, domain tự default VND
    private Integer       probability;
    private LocalDate expectedCloseDate;   // thêm
    private LocalDate actualCloseDate;     // thêm
    private String        description;
    private Integer       assignedTo;          // thêm — nếu null, domain tự default 0
    private Integer createdBy;
    private Integer updatedBy;
}