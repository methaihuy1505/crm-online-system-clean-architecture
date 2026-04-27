package com.vti.crm.domain.service;

import com.vti.crm.domain.model.ProductCategory;
import com.vti.crm.domain.repository.IProductCategoryRepository;
import java.util.List;

public class ProductCategoryDomainService {

    private final IProductCategoryRepository productCategoryRepository;

    public ProductCategoryDomainService(IProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
    }

    public ProductCategory create(String name, String description) {
        validateDuplicateName(name);
        ProductCategory category = new ProductCategory(name, description);
        return productCategoryRepository.save(category);
    }

    public ProductCategory findById(Integer id) {
        return productCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với id: " + id));
    }

    public List<ProductCategory> findAllActive() {
        return productCategoryRepository.findAllActive();
    }

    public ProductCategory update(Integer id, String name, String description) {
        validateDuplicateNameForUpdate(id, name);
        ProductCategory category = findById(id);
        category.update(name, description);
        return productCategoryRepository.save(category);
    }

    public void delete(Integer id) {
        findById(id);
        productCategoryRepository.softDeleteById(id);
    }

    // ============ PRIVATE — Business Rules ============

    private void validateDuplicateName(String name) {
        if (productCategoryRepository.existsByName(name)) {
            throw new IllegalArgumentException("Tên danh mục đã tồn tại");
        }
    }

    private void validateDuplicateNameForUpdate(Integer id, String name) {
        if (productCategoryRepository.existsByNameExcludingId(id, name)) {
            throw new IllegalArgumentException("Tên danh mục đã tồn tại");
        }
    }
}