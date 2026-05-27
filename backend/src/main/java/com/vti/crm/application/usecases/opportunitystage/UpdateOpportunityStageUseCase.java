package com.vti.crm.application.usecases.opportunitystage;

import com.vti.crm.domain.model.OpportunityStage;
import com.vti.crm.domain.service.OpportunityStageDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateOpportunityStageUseCase {

    private final OpportunityStageDomainService domainService;

    public OpportunityStage execute(Integer id, String name, Integer probabilityDefault,
                                    Integer sortOrder, Boolean isClosed) {

        return domainService.update(id, name, probabilityDefault, sortOrder, isClosed);
    }
}