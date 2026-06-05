package com.vti.crm.domain.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class Role {
    private Integer id;
    private String roleName;
    private String code;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Transient — không map từ DB entity.
     * Được set bởi GetRoleByIdUseCase sau khi query role_permissions.
     * Null khi lấy từ danh sách (GET /roles).
     */
    private List<Integer> permissionIds;
}
