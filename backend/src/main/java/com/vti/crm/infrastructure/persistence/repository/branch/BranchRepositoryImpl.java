package com.vti.crm.infrastructure.persistence.repository.branch;

import com.vti.crm.domain.model.Branch;
import com.vti.crm.domain.repository.IBranchRepository;
import com.vti.crm.infrastructure.persistence.mapper.BranchInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class BranchRepositoryImpl implements IBranchRepository {
    private final JpaBranchRepository jpaRepository;
    private final BranchInfraMapper mapper;

    @Override public List<Branch> findAll() {
        return jpaRepository.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }
    @Override public Optional<Branch> findById(Integer id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }
    @Override public Branch save(Branch branch) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(branch)));
    }
    @Override public void deleteById(Integer id) { jpaRepository.deleteById(id); }
}