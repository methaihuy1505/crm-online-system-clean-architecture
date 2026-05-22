package com.vti.crm.application.usecases.opportunitystatus;

import com.vti.crm.domain.model.OpportunityStatus;
import com.vti.crm.domain.service.OpportunityStatusDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetAllOpportunityStatusesUseCase {

    private final OpportunityStatusDomainService domainService;

    public List<OpportunityStatus> execute() {
        return domainService.findAll();
    }
}