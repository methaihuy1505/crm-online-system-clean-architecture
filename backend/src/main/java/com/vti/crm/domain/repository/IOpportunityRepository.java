package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Opportunity;
import com.vti.crm.domain.model.OpportunityFilter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface IOpportunityRepository {
    Opportunity save(Opportunity opportunity);
    Optional<Opportunity> findById(Integer id);
    List<Opportunity> findAll();
    boolean existsByOpportunityCode(String opportunityCode);
    void delete(Opportunity opportunity);
    List<Opportunity> findAllWithFilter(OpportunityFilter filter);
    // Dashboard queries
    Double sumAllTotalAmount();
    Double sumTotalAmountByDateRange(LocalDateTime start, LocalDateTime end);
    long countByStatusIn(List<Integer> statusIds);
    Object[] getSumAndCountByDateRange(LocalDateTime start, LocalDateTime end);
    List<Object[]> countClosedOpportunities();
    void updateFinancialsManual(Integer opportunityId, double totalAmount, double remainingAmount);
}