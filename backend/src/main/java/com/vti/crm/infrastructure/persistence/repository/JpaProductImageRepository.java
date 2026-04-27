package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.infrastructure.persistence.entity.ProductImageDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JpaProductImageRepository extends JpaRepository<ProductImageDbEntity, Integer> {
    List<ProductImageDbEntity> findByProductIdOrderBySortOrderAsc(Integer productId);
    void deleteByProductId(Integer productId);
}