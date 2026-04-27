package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.domain.model.LostReason;
import com.vti.crm.domain.repository.ILostReasonRepository;
import com.vti.crm.infrastructure.persistence.entity.LostReasonDbEntity;
import com.vti.crm.infrastructure.persistence.mapper.LostReasonInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class LostReasonRepositoryImpl implements ILostReasonRepository {

    private final JpaLostReasonRepository jpaRepository;
    private final LostReasonInfraMapper mapper;

    @Override
    public LostReason save(LostReason lostReason) {
        LostReasonDbEntity dbEntity = mapper.toDbEntity(lostReason);
        return mapper.toDomain(jpaRepository.save(dbEntity));
    }

    @Override
    public Optional<LostReason> findById(Integer id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<LostReason> findAll() {
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
    public void delete(LostReason lostReason) {
        jpaRepository.deleteById(lostReason.getId());
    }
}