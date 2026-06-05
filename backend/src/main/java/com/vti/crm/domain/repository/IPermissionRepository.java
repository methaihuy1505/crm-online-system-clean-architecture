package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Permission;

import java.util.List;

public interface IPermissionRepository {
    /** Dùng cho Spring Security — lấy permission codes của 1 role */
    List<String> findPermissionCodesByRoleId(Integer roleId);

    /** Lấy tất cả permissions active, nhóm theo moduleId (dùng cho Module catalogue) */
    List<Permission> findAllActive();

    /** Lấy permissions theo danh sách ID (validate khi update role) */
    List<Permission> findAllByIds(List<Integer> ids);
}
