package com.vti.crm.infrastructure.persistence.repository.opportunity.opportunity_stage;

import com.vti.crm.infrastructure.persistence.entity.OpportunityStageDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface JpaOpportunityStageRepository
        extends JpaRepository<OpportunityStageDbEntity, Integer> {
    @Query("SELECT COALESCE(MAX(s.sortOrder), 0) FROM OpportunityStageDbEntity s")
    Optional<Integer> findMaxSortOrder();
}