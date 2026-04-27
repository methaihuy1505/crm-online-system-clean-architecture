// ============ GET ALL ============
package com.vti.crm.application.usecases.productcategory;

import com.vti.crm.domain.model.ProductCategory;
import com.vti.crm.domain.service.ProductCategoryDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetAllProductCategoriesUseCase {

    private final ProductCategoryDomainService domainService;

    public List<ProductCategory> execute() {
        return domainService.findAllActive();
    }
}