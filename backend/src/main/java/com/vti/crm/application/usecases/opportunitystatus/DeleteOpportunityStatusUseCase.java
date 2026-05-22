package com.vti.crm.application.usecases.opportunitystatus;

import com.vti.crm.domain.service.OpportunityStatusDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DeleteOpportunityStatusUseCase {

    private final OpportunityStatusDomainService domainService;

    public void execute(Integer id) {
        domainService.delete(id);
    }
}