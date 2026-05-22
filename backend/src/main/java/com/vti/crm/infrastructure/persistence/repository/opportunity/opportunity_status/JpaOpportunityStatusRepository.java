package com.vti.crm.infrastructure.persistence.repository.opportunity.opportunity_status;

import com.vti.crm.infrastructure.persistence.entity.OpportunityStatusDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JpaOpportunityStatusRepository
        extends JpaRepository<OpportunityStatusDbEntity, Integer> {

    Optional<OpportunityStatusDbEntity> findByCode(String code);
    boolean existsByCode(String code);
}