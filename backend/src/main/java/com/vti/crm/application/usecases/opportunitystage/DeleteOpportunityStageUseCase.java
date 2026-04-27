package com.vti.crm.application.usecases.opportunitystage;

import com.vti.crm.domain.service.OpportunityStageDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DeleteOpportunityStageUseCase {

    private final OpportunityStageDomainService domainService;

    public void execute(Integer id) {
        domainService.delete(id);
    }
}