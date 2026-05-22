package com.vti.crm.application.usecases.opportunity;

import com.vti.crm.domain.model.Opportunity;
import com.vti.crm.domain.service.OpportunityDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateOpportunityUseCase {

    private final OpportunityDomainService domainService;

    public Opportunity execute(Integer id, String name, Integer customerId,
                               Integer stageId, Integer statusId, Integer lostReasonId,
                               Double depositAmount, Integer probability, String description) {
        return domainService.update(id, name, customerId, stageId, statusId,
                lostReasonId, depositAmount, probability, description);
    }
}