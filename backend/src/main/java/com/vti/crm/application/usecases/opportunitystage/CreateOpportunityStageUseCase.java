package com.vti.crm.application.usecases.opportunitystage;

import com.vti.crm.domain.model.OpportunityStage;
import com.vti.crm.domain.service.OpportunityStageDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CreateOpportunityStageUseCase {

    private final OpportunityStageDomainService domainService;

    public OpportunityStage execute(String name, Integer probabilityDefault,
                                    Integer sortOrder, Boolean isClosed) {
        return domainService.create(name, probabilityDefault, sortOrder, isClosed);
    }
}