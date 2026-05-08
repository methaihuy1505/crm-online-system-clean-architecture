package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.OpportunityItem;
import java.util.List;
import java.util.Optional;

public interface IOpportunityItemRepository {
    OpportunityItem save(OpportunityItem item);
    Optional<OpportunityItem> findById(Integer id);
    List<OpportunityItem> findAll();
    List<OpportunityItem> findByOpportunityId(Integer opportunityId);
    void delete(OpportunityItem item);
    void deleteByOpportunityId(Integer opportunityId);
}