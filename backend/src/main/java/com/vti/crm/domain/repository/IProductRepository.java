package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Product;
import com.vti.crm.domain.model.ProductFilter;
import java.util.List;
import java.util.Optional;

public interface IProductRepository {
    Product save(Product product);
    Optional<Product> findById(Integer id);
    List<Product> findAllActive();
    boolean existsByProductCode(String productCode);
    boolean existsByProductCodeExcludingId(Integer id, String productCode);
    void save(Product product, boolean update);
    List<Product> findAllWithFilter(ProductFilter filter);
    List<Product> searchProducts(String keyword);
}