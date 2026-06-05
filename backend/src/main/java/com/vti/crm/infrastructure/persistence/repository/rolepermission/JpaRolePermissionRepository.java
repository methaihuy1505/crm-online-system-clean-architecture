package com.vti.crm.infrastructure.persistence.repository.rolepermission;

import com.vti.crm.infrastructure.persistence.entity.RolePermissionDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaRolePermissionRepository extends JpaRepository<RolePermissionDbEntity, Integer> {

    @Query("SELECT rp.permissionId FROM RolePermissionDbEntity rp WHERE rp.roleId = :roleId")
    List<Integer> findPermissionIdsByRoleId(@Param("roleId") Integer roleId);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("DELETE FROM RolePermissionDbEntity rp WHERE rp.roleId = :roleId")
    void deleteAllByRoleId(@Param("roleId") Integer roleId);
}
