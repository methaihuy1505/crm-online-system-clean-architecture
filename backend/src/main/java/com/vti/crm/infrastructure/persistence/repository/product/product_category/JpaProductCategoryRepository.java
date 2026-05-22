package com.vti.crm.infrastructure.persistence.repository.product.product_category;

import com.vti.crm.infrastructure.persistence.entity.ProductCategoryDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface JpaProductCategoryRepository extends JpaRepository<ProductCategoryDbEntity, Integer> {

    Optional<ProductCategoryDbEntity> findByIdAndIsDeletedFalse(Integer id);

    List<ProductCategoryDbEntity> findByIsDeletedFalse();

    boolean existsByNameAndIsDeletedFalse(String name);

    @Query("SELECT COUNT(p) > 0 FROM ProductCategoryDbEntity p " +
            "WHERE p.isDeleted = false " +
            "AND LOWER(p.name) = LOWER(:name) " +
            "AND p.id <> :id")
    boolean existsByNameExcludingId(@Param("id") Integer id, @Param("name") String name);


    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE ProductCategoryDbEntity pc SET pc.isDeleted = true WHERE pc.id = :id")
    void softDeleteById(Integer id);
}