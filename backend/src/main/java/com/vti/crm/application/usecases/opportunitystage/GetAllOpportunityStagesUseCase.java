package com.vti.crm.application.usecases.opportunitystage;

import com.vti.crm.domain.model.OpportunityStage;
import com.vti.crm.domain.service.OpportunityStageDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetAllOpportunityStagesUseCase {

    private final OpportunityStageDomainService domainService;

    public List<OpportunityStage> execute() {
        return domainService.findAll();
    }
}