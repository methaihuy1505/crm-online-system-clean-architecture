package com.vti.crm.infrastructure.persistence.repository.branchprovince;

import com.vti.crm.domain.model.BranchProvince;
import com.vti.crm.domain.repository.IBranchProvinceRepository;
import com.vti.crm.infrastructure.persistence.mapper.BranchProvinceInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class BranchProvinceRepositoryImpl implements IBranchProvinceRepository {
    private final JpaBranchProvinceRepository jpaRepository;
    private final BranchProvinceInfraMapper mapper;

    @Override public List<BranchProvince> findAll() {
        return jpaRepository.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }
    @Override public Optional<BranchProvince> findById(Integer id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }
    @Override public BranchProvince save(BranchProvince bp) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(bp)));
    }
    @Override public void deleteById(Integer id) { jpaRepository.deleteById(id); }
}