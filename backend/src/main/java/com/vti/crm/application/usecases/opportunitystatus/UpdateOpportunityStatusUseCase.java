package com.vti.crm.application.usecases.opportunitystatus;

import com.vti.crm.domain.model.OpportunityStatus;
import com.vti.crm.domain.service.OpportunityStatusDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateOpportunityStatusUseCase {

    private final OpportunityStatusDomainService domainService;

    public OpportunityStatus execute(Integer id, String name, Boolean isFinal) {
        return domainService.update(id, name, isFinal);
    }
}