package com.vti.crm.application.usecases.opportunityitem;

import com.vti.crm.domain.model.OpportunityItem;
import com.vti.crm.domain.service.OpportunityItemDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional
public class CreateOpportunityItemUseCase {
    private final OpportunityItemDomainService domainService;

    public OpportunityItem execute(Integer opportunityId, Integer productId,
                                   Integer quantity, BigDecimal unitPrice,
                                   BigDecimal vatRate, BigDecimal discountRate,
                                   Integer lineItemNumber, String note) {
        return domainService.create(opportunityId, productId, quantity,
                unitPrice, vatRate, discountRate, lineItemNumber, note);
    }
}