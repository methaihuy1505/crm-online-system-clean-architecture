package com.vti.crm.interfaces.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpportunityItemResponse {

    private Integer id;
    private Integer opportunityId;
    private Integer productId;

    private String productName;
    private String uomName;

    private Integer quantity;
    private BigDecimal unitPrice;

    private BigDecimal vatRate;
    private BigDecimal vatAmount;

    private BigDecimal discountRate;
    private BigDecimal discountAmount;

    private BigDecimal totalPrice;
    private BigDecimal finalLineTotal;

    private Integer lineItemNumber;
    private String note;

    private LocalDateTime createdAt;
}