package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.infrastructure.persistence.entity.ProductDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface JpaProductRepository extends JpaRepository<ProductDbEntity, Integer> {

    Optional<ProductDbEntity> findByIdAndIsDeletedFalse(Integer id);

    List<ProductDbEntity> findByIsDeletedFalse();

    boolean existsByProductCodeAndIsDeletedFalse(String productCode);

    @Query("SELECT COUNT(p) > 0 FROM ProductDbEntity p " +
            "WHERE p.isDeleted = false " +
            "AND p.productCode = :productCode " +
            "AND p.id <> :id")
    boolean existsByProductCodeExcludingId(@Param("id") Integer id,
                                           @Param("productCode") String productCode);
}