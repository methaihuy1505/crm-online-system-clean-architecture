package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.domain.model.OpportunityStatus;
import com.vti.crm.domain.repository.IOpportunityStatusRepository;
import com.vti.crm.infrastructure.persistence.mapper.OpportunityStatusInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class OpportunityStatusRepositoryImpl implements IOpportunityStatusRepository {

    private final JpaOpportunityStatusRepository jpaRepository;
    private final OpportunityStatusInfraMapper mapper;

    @Override
    public OpportunityStatus save(OpportunityStatus status) {
        return mapper.toDomain(jpaRepository.save(mapper.toDbEntity(status)));
    }

    @Override
    public Optional<OpportunityStatus> findById(Integer id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<OpportunityStatus> findAll() {
        return jpaRepository.findAll()
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public boolean existsByCode(String code) {
        return jpaRepository.existsByCode(code);
    }

    @Override
    public void delete(OpportunityStatus status) {
        jpaRepository.deleteById(status.getId());
    }
}