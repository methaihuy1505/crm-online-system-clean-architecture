package com.vti.crm.infrastructure.persistence.repository.opportunity.opportunity_item;

import com.vti.crm.domain.model.OpportunityItem;
import com.vti.crm.domain.repository.IOpportunityItemRepository;
import com.vti.crm.infrastructure.persistence.mapper.OpportunityItemInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class OpportunityItemRepositoryImpl implements IOpportunityItemRepository {

    private final JpaOpportunityItemRepository jpaRepository;
    private final OpportunityItemInfraMapper mapper;

    @Override
    public OpportunityItem save(OpportunityItem item) {
        return mapper.toDomain(jpaRepository.save(mapper.toDbEntity(item)));
    }

    @Override
    public Optional<OpportunityItem> findById(Integer id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<OpportunityItem> findAll() {
        return jpaRepository.findAll().stream().map(mapper::toDomain).toList();
    }

    @Override
    public List<OpportunityItem> findByOpportunityId(Integer opportunityId) {
        return jpaRepository.findByOpportunityIdOrderByLineItemNumberAsc(opportunityId)
                .stream().map(mapper::toDomain).toList();
    }

    @Override
    public void delete(OpportunityItem item) {
        jpaRepository.deleteById(item.getId());
    }

    @Override
    public void deleteByOpportunityId(Integer opportunityId) {
        jpaRepository.deleteByOpportunityId(opportunityId);
    }
}