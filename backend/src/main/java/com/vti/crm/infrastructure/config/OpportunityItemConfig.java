package com.vti.crm.infrastructure.config;

import com.vti.crm.domain.repository.IOpportunityItemRepository;
import com.vti.crm.domain.repository.IOpportunityRepository;
import com.vti.crm.domain.repository.IProductRepository;
import com.vti.crm.domain.service.OpportunityItemDomainService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpportunityItemConfig {

    @Bean
    public OpportunityItemDomainService opportunityItemDomainService(
            IOpportunityItemRepository itemRepository,
            IOpportunityRepository opportunityRepository,
            IProductRepository productRepository) {
        return new OpportunityItemDomainService(
                itemRepository, opportunityRepository, productRepository);
    }
}