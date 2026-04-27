package com.vti.crm.domain.service;

import com.vti.crm.domain.model.Product;
import com.vti.crm.domain.model.Product.ProductType;
import com.vti.crm.domain.repository.IProductCategoryRepository;

import com.vti.crm.domain.repository.IProductRepository;
import com.vti.crm.domain.repository.IUomRepository;

import java.math.BigDecimal;
import java.util.List;

public class ProductDomainService {

    private final IProductRepository productRepository;
    private final IProductCategoryRepository categoryRepository;
    private final IUomRepository uomRepository;

    public ProductDomainService(IProductRepository productRepository,
                                IProductCategoryRepository categoryRepository,
                                IUomRepository uomRepository) {
        this.productRepository  = productRepository;
        this.categoryRepository = categoryRepository;
        this.uomRepository      = uomRepository;
    }

    public Product create(String productCode,
                          String name,
                          Integer categoryID,
                          Integer uomID,
                          ProductType productType,
                          BigDecimal basePrice,
                          BigDecimal vatRate,
                          BigDecimal depositOverride,
                          String imageUrl,
                          String description) {

        validateCategoryExists(categoryID);
        validateUomExists(uomID);
        validateDuplicateCode(productCode);

        Product product = new Product.ProductBuilder()
                .productCode(productCode)
                .name(name)
                .categoryID(categoryID)
                .uomID(uomID)
                .productType(productType)
                .basePrice(basePrice)
                .vatRate(vatRate)
                .depositOverride(depositOverride)
                .imageUrl(imageUrl)
                .description(description)
                .build();
        return productRepository.save(product);
    }

    public Product findById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + id));
    }

    public List<Product> findAllActive() {
        return productRepository.findAllActive();
    }

    public Product update(Integer id,
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

        validateCategoryExists(categoryID);
        validateUomExists(uomID);
        validateDuplicateCodeForUpdate(id, productCode);

        Product product = findById(id);

        // User id xu ly ntn
        product.update(productCode, name, categoryID, uomID, productType,
                basePrice, vatRate, depositOverride, imageUrl, description,1);

        return productRepository.save(product);
    }

    public void delete(Integer id) {
        Product product = findById(id);
        product.delete();
        productRepository.save(product);
    }

    // ============ PRIVATE — Business Rules ============

    private void validateDuplicateCode(String productCode) {
        if (productRepository.existsByProductCode(productCode)) {
            throw new IllegalArgumentException("Mã sản phẩm đã tồn tại");
        }
    }

    private void validateDuplicateCodeForUpdate(Integer id, String productCode) {
        if (productRepository.existsByProductCodeExcludingId(id, productCode)) {
            throw new IllegalArgumentException("Mã sản phẩm đã tồn tại");
        }
    }

    private void validateCategoryExists(Integer categoryID) {
        if (categoryID == null) return;
        categoryRepository.findById(categoryID)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với id: " + categoryID));
    }

    private void validateUomExists(Integer uomID) {
        if (uomID == null) return;
        uomRepository.findById(uomID)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn vị tính với id: " + uomID));
    }
}