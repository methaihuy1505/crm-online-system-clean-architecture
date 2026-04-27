package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.infrastructure.persistence.entity.UomDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface JpaUomRepository extends JpaRepository<UomDbEntity, Integer> {
    Optional<UomDbEntity> findByCode(String code);
    boolean existsByCode(String code);
}