// ============ GET ALL ============
package com.vti.crm.application.usecases.product;

import com.vti.crm.domain.model.Product;
import com.vti.crm.domain.repository.IProductCategoryRepository;
import com.vti.crm.domain.repository.IProductImageRepository;
import com.vti.crm.domain.repository.IUomRepository;
import com.vti.crm.domain.service.ProductDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetAllProductsUseCase {

    private final ProductDomainService productDomainService;
    private final IProductCategoryRepository categoryRepository;
    private final IUomRepository uomRepository;
    private final IProductImageRepository productImageRepository;

    public List<Product> execute() {
        return productDomainService.findAllActive();
    }
}