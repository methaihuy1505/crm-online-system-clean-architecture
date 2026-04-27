package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.domain.model.LostReason;
import com.vti.crm.infrastructure.persistence.entity.LostReasonDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JpaLostReasonRepository
        extends JpaRepository<LostReasonDbEntity, Integer> {

    Optional<LostReasonDbEntity> findByCode(String code);
    boolean existsByCode(String code);
}