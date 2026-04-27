package com.vti.crm.infrastructure.config;

import com.vti.crm.domain.repository.IProductCategoryRepository;
import com.vti.crm.domain.service.ProductCategoryDomainService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProductCategoryConfig {

    @Bean
    public ProductCategoryDomainService productCategoryDomainService(
            IProductCategoryRepository productCategoryRepository) {
        return new ProductCategoryDomainService(productCategoryRepository);
    }
}