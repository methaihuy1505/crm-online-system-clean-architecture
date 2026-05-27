package com.vti.crm.application.usecases.opportunity;

import com.vti.crm.domain.model.Opportunity;
import com.vti.crm.domain.service.OpportunityDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class CreateOpportunityUseCase {

    private final OpportunityDomainService domainService;

    public Opportunity execute(String opportunityCode,
                               String name,
                               Integer customerId,
                               Integer campaignId,
                               Integer stageId,
                               Integer statusId,
                               Integer lostReasonId,
                               Double depositAmount,
                               Integer probability,
                               String description,
                               LocalDateTime nextFollowUpDate,
                               LocalDate expectedCloseDate,
                               Integer createdBy,
                               Integer assignedTo) {
        return domainService.create( opportunityCode,name,customerId,campaignId,stageId,statusId,
                lostReasonId, depositAmount, probability,description,nextFollowUpDate,
                expectedCloseDate, createdBy, assignedTo);
    }
}