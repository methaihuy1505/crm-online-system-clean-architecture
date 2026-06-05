package com.vti.crm.infrastructure.persistence.repository.module;

import com.vti.crm.domain.model.Module;
import com.vti.crm.domain.repository.IModuleRepository;
import com.vti.crm.infrastructure.persistence.mapper.ModuleInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ModuleRepositoryImpl implements IModuleRepository {

    private final JpaModuleRepository jpaRepository;
    private final ModuleInfraMapper mapper;

    @Override
    public List<Module> findAllActiveOrderBySortOrder() {
        return jpaRepository.findAllActiveOrderBySortOrder()
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
}
