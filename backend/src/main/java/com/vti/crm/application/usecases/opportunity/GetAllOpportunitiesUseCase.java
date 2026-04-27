package com.vti.crm.application.usecases.opportunity;

import com.vti.crm.domain.model.Opportunity;
import com.vti.crm.domain.service.OpportunityDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetAllOpportunitiesUseCase {

    private final OpportunityDomainService domainService;

    public List<Opportunity> execute() {
        return domainService.findAll();
    }
}