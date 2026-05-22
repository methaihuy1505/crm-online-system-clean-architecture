package com.vti.crm.infrastructure.persistence.repository.product.uom;

import com.vti.crm.domain.model.Uom;
import com.vti.crm.domain.repository.IUomRepository;
import com.vti.crm.infrastructure.persistence.entity.UomDbEntity;
import com.vti.crm.infrastructure.persistence.mapper.UomInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class UomRepositoryImpl implements IUomRepository {

    private final JpaUomRepository jpaRepository;
    private final UomInfraMapper mapper;

    @Override
    public Uom save(Uom uom) {
        UomDbEntity dbEntity = mapper.toDbEntity(uom);
        return mapper.toDomain(jpaRepository.save(dbEntity));
    }

    @Override
    public void delete(Uom uom) {
        jpaRepository.delete(mapper.toDbEntity(uom));
    }

    @Override
    public Optional<Uom> findById(Integer id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<Uom> findByCode(String code) {
        return jpaRepository.findByCode(code).map(mapper::toDomain);
    }

    @Override
    public boolean existsByCode(String code) {
        return jpaRepository.existsByCode(code);
    }

    @Override
    public List<Uom> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
}