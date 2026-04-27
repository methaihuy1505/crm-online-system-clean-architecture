package com.vti.crm.infrastructure.config;

import com.vti.crm.domain.repository.IOpportunityStageRepository;
import com.vti.crm.domain.service.OpportunityStageDomainService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpportunityStageConfig {

    @Bean
    public OpportunityStageDomainService opportunityStageDomainService(
            IOpportunityStageRepository repository) {
        return new OpportunityStageDomainService(repository);
    }
}