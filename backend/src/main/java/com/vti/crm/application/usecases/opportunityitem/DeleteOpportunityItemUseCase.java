package com.vti.crm.application.usecases.opportunityitem;

import com.vti.crm.domain.service.OpportunityItemDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DeleteOpportunityItemUseCase {
    private final OpportunityItemDomainService domainService;

    public void execute(Integer id) {
        domainService.delete(id);
    }
}