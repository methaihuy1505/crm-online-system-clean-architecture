package com.vti.crm.application.usecases.opportunitystatus;

import com.vti.crm.domain.model.OpportunityStatus;
import com.vti.crm.domain.service.OpportunityStatusDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CreateOpportunityStatusUseCase {

    private final OpportunityStatusDomainService domainService;

    public OpportunityStatus execute(String code, String name, Boolean isFinal) {
        return domainService.create(code, name, isFinal);
    }
}