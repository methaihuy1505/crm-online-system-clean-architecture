package com.vti.crm.infrastructure.config;

import com.vti.crm.domain.repository.IProductImageRepository;
import com.vti.crm.domain.service.ProductImageDomainService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProductImageConfig {
    // Inject repository (đã là bean) vào đây để khởi tạo service
    @Bean
    public ProductImageDomainService productImageDomainService(IProductImageRepository repository) {
        return new ProductImageDomainService(repository);
    }
}
