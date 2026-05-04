package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.infrastructure.persistence.entity.ProductDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface JpaProductRepository
        extends JpaRepository<ProductDbEntity, Integer>,
        JpaSpecificationExecutor<ProductDbEntity> { // THÊM

    Optional<ProductDbEntity> findByIdAndIsDeletedFalse(Integer id);
    List<ProductDbEntity> findByIsDeletedFalse();
    boolean existsByProductCodeAndIsDeletedFalse(String productCode);

    @Query("SELECT p FROM ProductDbEntity p WHERE p.id != :id " +
            "AND p.productCode = :productCode AND p.isDeleted = false")
    boolean existsByProductCodeExcludingId(@Param("id") Integer id,
                                           @Param("productCode") String productCode);
}