package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.domain.model.OpportunityStage;
import com.vti.crm.infrastructure.persistence.entity.OpportunityStageDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaOpportunityStageRepository
        extends JpaRepository<OpportunityStageDbEntity, Integer> {
}