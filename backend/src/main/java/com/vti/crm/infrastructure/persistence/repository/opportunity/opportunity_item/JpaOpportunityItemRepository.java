package com.vti.crm.infrastructure.persistence.repository.opportunity.opportunity_item;

import com.vti.crm.infrastructure.persistence.entity.OpportunityItemDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JpaOpportunityItemRepository
        extends JpaRepository<OpportunityItemDbEntity, Integer> {

    // SỬA: opportunityId thay vì opportunityId (field đã đổi tên)
    List<OpportunityItemDbEntity> findByOpportunityIdOrderByLineItemNumberAsc(Integer opportunityId);

    @Modifying
    void deleteByOpportunityId(Integer opportunityId);
}