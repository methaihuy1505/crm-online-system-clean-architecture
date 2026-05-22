package com.vti.crm.infrastructure.persistence.repository.product;

import com.vti.crm.infrastructure.persistence.entity.ProductDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface JpaProductRepository
        extends JpaRepository<ProductDbEntity, Integer>,
        JpaSpecificationExecutor<ProductDbEntity> {

    Optional<ProductDbEntity> findByIdAndIsDeletedFalse(Integer id);
    List<ProductDbEntity> findByIsDeletedFalse();
    boolean existsByProductCodeAndIsDeletedFalse(String productCode);

    @Query("SELECT p FROM ProductDbEntity p WHERE p.id != :id " +
            "AND p.productCode = :productCode AND p.isDeleted = false")
    boolean existsByProductCodeExcludingId(@Param("id") Integer id,
                                           @Param("productCode") String productCode);

    // ================= THÊM MỚI HÀM SEARCH TẠI ĐÂY =================
    @Query("SELECT p FROM ProductDbEntity p WHERE p.isDeleted = false " +
            "AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.productCode) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<ProductDbEntity> searchActiveProducts(@Param("keyword") String keyword);
}