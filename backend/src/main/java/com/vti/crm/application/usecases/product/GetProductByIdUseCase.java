// ============ GET BY ID ============
package com.vti.crm.application.usecases.product;

import com.vti.crm.domain.model.Product;
import com.vti.crm.domain.repository.IProductCategoryRepository;
import com.vti.crm.domain.repository.IProductImageRepository;
import com.vti.crm.domain.repository.IUomRepository;
import com.vti.crm.domain.service.ProductDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetProductByIdUseCase {

    private final ProductDomainService productDomainService;
    private final IProductCategoryRepository categoryRepository;
    private final IUomRepository uomRepository;
    private final IProductImageRepository productImageRepository;

    public Product execute(Integer id) {
        // 1. Lấy product
        Product product = productDomainService.findById(id);


        return product;
    }
}