package com.vti.crm.infrastructure.config;

import com.vti.crm.domain.repository.IOpportunityStatusRepository;
import com.vti.crm.domain.service.OpportunityStatusDomainService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpportunityStatusConfig {

    @Bean
    public OpportunityStatusDomainService opportunityStatusDomainService(
            IOpportunityStatusRepository repository) {
        return new OpportunityStatusDomainService(repository);
    }
}