package com.vti.crm.infrastructure.config;

import com.vti.crm.domain.repository.IProductCategoryRepository;
import com.vti.crm.domain.repository.IProductRepository;
import com.vti.crm.domain.repository.IUomRepository;
import com.vti.crm.domain.service.ProductDomainService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProductConfig {

    @Bean
    public ProductDomainService productDomainService(
            IProductRepository productRepository,
            IProductCategoryRepository categoryRepository,
            IUomRepository uomRepository) {
        return new ProductDomainService(productRepository, categoryRepository, uomRepository);
    }
}