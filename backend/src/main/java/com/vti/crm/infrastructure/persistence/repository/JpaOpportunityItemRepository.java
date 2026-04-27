//package com.vti.crm.infrastructure.persistence.repository;
//
//import com.vti.crm.domain.model.OpportunityItem;
//import com.vti.crm.infrastructure.persistence.entity.OpportunityItemDbEntity;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface JpaOpportunityItemRepository extends JpaRepository<OpportunityItemDbEntity, Integer> {
//
//    List<OpportunityItemDbEntity> findByOpportunityIdOrderByLineItemNumberAsc(Integer opportunityId);
//
//    void deleteByOpportunityId(Integer opportunityId);
//}