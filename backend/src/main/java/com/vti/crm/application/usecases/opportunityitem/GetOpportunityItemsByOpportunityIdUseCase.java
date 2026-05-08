package com.vti.crm.application.usecases.opportunityitem;

import com.vti.crm.domain.model.OpportunityItem;
import com.vti.crm.domain.service.OpportunityItemDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetOpportunityItemsByOpportunityIdUseCase {
    private final OpportunityItemDomainService domainService;

    public List<OpportunityItem> execute(Integer opportunityId) {
        return domainService.findByOpportunityId(opportunityId);
    }
}