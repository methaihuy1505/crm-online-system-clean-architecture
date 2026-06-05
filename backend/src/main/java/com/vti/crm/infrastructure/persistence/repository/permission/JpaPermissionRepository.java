package com.vti.crm.infrastructure.persistence.repository.permission;

import com.vti.crm.infrastructure.persistence.entity.PermissionDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaPermissionRepository extends JpaRepository<PermissionDbEntity, Integer> {

    /** Dùng cho Spring Security */
    @Query(value = """
            SELECT p.code FROM permissions p
            JOIN role_permissions rp ON p.id = rp.permission_id
            WHERE rp.role_id = :roleId
            """, nativeQuery = true)
    List<String> findPermissionCodesByRoleId(@Param("roleId") Integer roleId);

    /** Tất cả permissions đang active — dùng để build module catalogue */
    List<PermissionDbEntity> findAllByIsActiveTrueOrderByModuleIdAscIdAsc();

    /** Validate permissionIds khi update role */
    List<PermissionDbEntity> findAllByIdIn(List<Integer> ids);
}
