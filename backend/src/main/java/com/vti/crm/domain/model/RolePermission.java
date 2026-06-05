package com.vti.crm.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RolePermission {
    private Integer id;
    private Integer roleId;
    private Integer permissionId;
    private LocalDateTime createdAt;
}