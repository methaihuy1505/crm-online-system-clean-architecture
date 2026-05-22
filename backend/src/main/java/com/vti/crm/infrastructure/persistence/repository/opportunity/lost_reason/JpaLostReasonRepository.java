package com.vti.crm.infrastructure.persistence.repository.opportunity.lost_reason;

import com.vti.crm.infrastructure.persistence.entity.LostReasonDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JpaLostReasonRepository
        extends JpaRepository<LostReasonDbEntity, Integer> {

    Optional<LostReasonDbEntity> findByCode(String code);
    boolean existsByCode(String code);
}