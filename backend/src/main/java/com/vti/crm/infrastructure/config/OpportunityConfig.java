package com.vti.crm.infrastructure.config;

import com.vti.crm.domain.repository.*;
import com.vti.crm.domain.service.OpportunityDashboardDomainService;
import com.vti.crm.domain.service.OpportunityDomainService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpportunityConfig {

    @Bean
    public OpportunityDomainService opportunityDomainService(
            IOpportunityRepository opportunityRepository,
            IOpportunityStageRepository stageRepository,
            IOpportunityStatusRepository statusRepository,
            ILostReasonRepository lostReasonRepository) {
        return new OpportunityDomainService(
                opportunityRepository, stageRepository, statusRepository, lostReasonRepository);
    }

    @Bean
    public OpportunityDashboardDomainService opportunityDashboardDomainService(
            IOpportunityRepository opportunityRepository) {
        return new OpportunityDashboardDomainService(opportunityRepository);
    }
}