package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.ProductImage;
import java.util.List;

public interface IProductImageRepository {
    ProductImage save(ProductImage productImage);
    ProductImage findById(Integer id);
    List<ProductImage> findByProductId(Integer productId);
    void deleteById(Integer id);
    void deleteByProductId(Integer productId);
}