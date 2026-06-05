package com.vti.crm.infrastructure.persistence.repository.permission;

import com.vti.crm.domain.model.Permission;
import com.vti.crm.domain.repository.IPermissionRepository;
import com.vti.crm.infrastructure.persistence.mapper.PermissionInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class PermissionRepositoryImpl implements IPermissionRepository {

    private final JpaPermissionRepository jpaRepository;
    private final PermissionInfraMapper mapper;

    @Override
    public List<String> findPermissionCodesByRoleId(Integer roleId) {
        return jpaRepository.findPermissionCodesByRoleId(roleId);
    }

    @Override
    public List<Permission> findAllActive() {
        return jpaRepository.findAllByIsActiveTrueOrderByModuleIdAscIdAsc()
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Permission> findAllByIds(List<Integer> ids) {
        return jpaRepository.findAllByIdIn(ids)
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
}
