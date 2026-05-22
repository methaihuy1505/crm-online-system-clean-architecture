package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.ProductCategory;
import java.util.List;
import java.util.Optional;

public interface IProductCategoryRepository {
    ProductCategory save(ProductCategory productCategory);
    Optional<ProductCategory> findById(Integer id);
    List<ProductCategory> findAllActive();
    boolean existsByName(String name);
    boolean existsByNameExcludingId(Integer id, String name);
    void softDeleteById(Integer id);
}