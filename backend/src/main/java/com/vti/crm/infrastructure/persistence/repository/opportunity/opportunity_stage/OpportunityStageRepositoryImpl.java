package com.vti.crm.infrastructure.persistence.repository.opportunity.opportunity_stage;

import com.vti.crm.domain.model.OpportunityStage;
import com.vti.crm.domain.repository.IOpportunityStageRepository;
import com.vti.crm.infrastructure.persistence.mapper.OpportunityStageInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class OpportunityStageRepositoryImpl implements IOpportunityStageRepository {

    private final JpaOpportunityStageRepository jpaRepository;
    private final OpportunityStageInfraMapper mapper;

    @Override
    public OpportunityStage save(OpportunityStage stage) {
        return mapper.toDomain(jpaRepository.save(mapper.toDbEntity(stage)));
    }

    @Override
    public Optional<OpportunityStage> findById(Integer id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<OpportunityStage> findAll() {
        return jpaRepository.findAll()
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public void delete(OpportunityStage stage) {
        jpaRepository.deleteById(stage.getId());
    }

    @Override
    public int findMaxSortOrder() {
        return jpaRepository.findMaxSortOrder().orElse(0);
    }
}