package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.OpportunityStage;
import java.util.List;
import java.util.Optional;

public interface IOpportunityStageRepository {
    OpportunityStage save(OpportunityStage stage);
    Optional<OpportunityStage> findById(Integer id);
    List<OpportunityStage> findAll();
    void delete(OpportunityStage stage);
    int findMaxSortOrder();

}