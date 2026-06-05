package com.vti.crm.domain.repository;

import java.util.List;

public interface IRolePermissionRepository {
    /** Lấy danh sách permission_id của một role */
    List<Integer> findPermissionIdsByRoleId(Integer roleId);

    /** Xóa toàn bộ permissions của role (dùng trước khi insert lại) */
    void deleteAllByRoleId(Integer roleId);

    /** Gán một danh sách permission vào role */
    void saveAll(Integer roleId, List<Integer> permissionIds);
}
