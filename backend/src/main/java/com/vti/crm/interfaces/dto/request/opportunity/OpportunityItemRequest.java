package com.vti.crm.interfaces.dto.request.opportunity;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpportunityItemRequest {

    private Integer opportunityId;
    private Integer productId;

    private Integer quantity;
    private BigDecimal unitPrice;

    private BigDecimal vatRate;
    private BigDecimal discountRate;

    private Integer lineItemNumber;
    private String note;
}