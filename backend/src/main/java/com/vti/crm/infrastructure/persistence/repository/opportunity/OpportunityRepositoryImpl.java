package com.vti.crm.infrastructure.persistence.repository.opportunity;

import com.vti.crm.domain.model.Opportunity;
import com.vti.crm.domain.model.OpportunityFilter;
import com.vti.crm.domain.repository.IOpportunityRepository;
import com.vti.crm.infrastructure.persistence.mapper.OpportunityInfraMapper;
import com.vti.crm.infrastructure.persistence.specification.OpportunitySpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class OpportunityRepositoryImpl implements IOpportunityRepository {

    private final JpaOpportunityRepository jpaRepository;
    private final OpportunityInfraMapper mapper;

    @Override
    public Opportunity save(Opportunity opportunity) {
        return mapper.toDomain(jpaRepository.save(mapper.toDbEntity(opportunity)));
    }

    @Override
    public Optional<Opportunity> findById(Integer id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Opportunity> findAll() {
        return jpaRepository.findAll().stream().map(mapper::toDomain).toList();
    }

    @Override
    public boolean existsByOpportunityCode(String opportunityCode) {
        return jpaRepository.existsByOpportunityCode(opportunityCode);
    }

    @Override
    public void delete(Opportunity opportunity) {
        jpaRepository.deleteById(opportunity.getId());
    }

    @Override
    public List<Opportunity> findAllWithFilter(OpportunityFilter filter) {
        return jpaRepository.findAll(OpportunitySpecification.withFilter(filter))
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public Double sumAllTotalAmount() {
        return jpaRepository.sumAllTotalAmount();
    }

    @Override
    public Double sumTotalAmountByDateRange(LocalDateTime start, LocalDateTime end) {
        return jpaRepository.sumTotalAmountByDateRange(start, end);
    }

    @Override
    public long countByStatusIn(List<Integer> statusIds) {
        return jpaRepository.countByStatusIn(statusIds);
    }

    @Override
    public Object[] getSumAndCountByDateRange(LocalDateTime start, LocalDateTime end) {
        List<Object[]> results = Collections.singletonList(jpaRepository.getSumAndCountByDateRange(start, end));
        return results.isEmpty() ? new Object[]{0.0, 0L} : results.get(0);
    }

    @Override
    public List<Object[]> countClosedOpportunities() {
        return jpaRepository.countClosedOpportunities();
    }

    @Override
    public void updateFinancialsManual(Integer opportunityId, double totalAmount, double remainingAmount) {
        jpaRepository.updateFinancialsManual(opportunityId,totalAmount,remainingAmount);
    }
}