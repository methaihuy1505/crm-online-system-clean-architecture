package com.vti.crm.infrastructure.persistence.repository.rolepermission;

import com.vti.crm.domain.repository.IRolePermissionRepository;
import com.vti.crm.infrastructure.persistence.entity.RolePermissionDbEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class RolePermissionRepositoryImpl implements IRolePermissionRepository {

    private final JpaRolePermissionRepository jpaRepository;

    @Override
    public List<Integer> findPermissionIdsByRoleId(Integer roleId) {
        return jpaRepository.findPermissionIdsByRoleId(roleId);
    }

    @Override
    @Transactional
    public void deleteAllByRoleId(Integer roleId) {
        jpaRepository.deleteAllByRoleId(roleId);
    }

    @Override
    @Transactional
    public void saveAll(Integer roleId, List<Integer> permissionIds) {
        List<RolePermissionDbEntity> entities = permissionIds.stream()
                .map(permId -> RolePermissionDbEntity.builder()
                        .roleId(roleId)
                        .permissionId(permId)
                        .build())
                .collect(Collectors.toList());
        jpaRepository.saveAll(entities);
    }
}
