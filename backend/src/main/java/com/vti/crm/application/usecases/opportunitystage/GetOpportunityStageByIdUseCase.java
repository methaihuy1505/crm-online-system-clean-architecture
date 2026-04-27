package com.vti.crm.application.usecases.opportunitystage;

import com.vti.crm.domain.model.OpportunityStage;
import com.vti.crm.domain.service.OpportunityStageDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetOpportunityStageByIdUseCase {

    private final OpportunityStageDomainService domainService;

    public OpportunityStage execute(Integer id) {
        return domainService.findById(id);
    }
}