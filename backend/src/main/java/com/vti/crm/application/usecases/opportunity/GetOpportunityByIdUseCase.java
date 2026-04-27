package com.vti.crm.application.usecases.opportunity;

import com.vti.crm.domain.model.Opportunity;
import com.vti.crm.domain.service.OpportunityDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetOpportunityByIdUseCase {

    private final OpportunityDomainService domainService;

    public Opportunity execute(Integer id) {
        return domainService.findById(id);
    }
}