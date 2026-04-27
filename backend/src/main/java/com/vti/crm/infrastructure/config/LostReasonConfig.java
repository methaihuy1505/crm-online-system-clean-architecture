package com.vti.crm.infrastructure.config;

import com.vti.crm.domain.repository.ILostReasonRepository;
import com.vti.crm.domain.service.LostReasonDomainService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LostReasonConfig {

    @Bean
    public LostReasonDomainService lostReasonDomainService(ILostReasonRepository repository) {
        return new LostReasonDomainService(repository);
    }
}