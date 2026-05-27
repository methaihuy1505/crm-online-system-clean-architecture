package com.vti.crm.application.usecases.opportunity;

import com.vti.crm.domain.service.OpportunityDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DeleteOpportunityUseCase {

    private final OpportunityDomainService domainService;

    public void execute(Integer id,Integer deleteBy) {
        domainService.delete(id,deleteBy);
    }
}