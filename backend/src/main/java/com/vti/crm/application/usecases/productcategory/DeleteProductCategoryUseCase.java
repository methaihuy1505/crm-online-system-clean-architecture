// ============ DELETE ============
package com.vti.crm.application.usecases.productcategory;

import com.vti.crm.domain.service.ProductCategoryDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DeleteProductCategoryUseCase {

    private final ProductCategoryDomainService domainService;

    public void execute(Integer id) {
        domainService.delete(id);
    }
}