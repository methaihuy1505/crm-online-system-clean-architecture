// ============ UPDATE ============
package com.vti.crm.application.usecases.product;

import com.vti.crm.domain.model.Product;
import com.vti.crm.domain.model.Product.ProductType;
import com.vti.crm.domain.repository.IProductCategoryRepository;
import com.vti.crm.domain.repository.IProductImageRepository;
import com.vti.crm.domain.repository.IUomRepository;
import com.vti.crm.domain.service.ProductDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateProductUseCase {

    private final ProductDomainService productDomainService;
    private final IProductCategoryRepository categoryRepository;
    private final IUomRepository uomRepository;
    private final IProductImageRepository productImageRepository;

    public Product execute(Integer id,
                                 String productCode,
                                 String name,
                                 Integer categoryID,
                                 Integer uomID,
                                 ProductType productType,
                                 BigDecimal basePrice,
                                 BigDecimal vatRate,
                                 BigDecimal depositOverride,
                                 String imageUrl,
                                 String description) {

        // 1. Update qua domain service
        Product product = productDomainService.update(
                id, productCode, name, categoryID, uomID, productType,
                basePrice, vatRate, depositOverride, imageUrl, description);



        return product;
    }
}