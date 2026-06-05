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
public class UpdateOpportunityUseCase {

    private final OpportunityDomainService domainService;

    public Opportunity execute(Integer id, String name, Integer customerId,
                               Integer campaignId,
                               Integer stageId, Integer statusId, Integer lostReasonId,
                               Double depositAmount, Integer probability, String description,
                               LocalDateTime nextFollowUpDate,
                               String currencyCode,
                               LocalDate expectedCloseDate,
                               LocalDate actualCloseDate,
                               Integer assignedTo,
                               Integer updatedBy) {
        return domainService.update(id,name, customerId,campaignId, stageId, statusId,
                lostReasonId, depositAmount, probability, description,nextFollowUpDate,
                currencyCode,expectedCloseDate,actualCloseDate,assignedTo,updatedBy);
    }
}