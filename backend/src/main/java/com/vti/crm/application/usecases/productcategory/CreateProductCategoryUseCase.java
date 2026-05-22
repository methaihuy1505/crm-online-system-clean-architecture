// ============ CREATE ============
package com.vti.crm.application.usecases.productcategory;

import com.vti.crm.domain.model.ProductCategory;
import com.vti.crm.domain.service.ProductCategoryDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CreateProductCategoryUseCase {

    private final ProductCategoryDomainService domainService;

    public ProductCategory execute(String name, String description) {
        return domainService.create(name, description);
    }
}