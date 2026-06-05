package com.vti.crm.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Module {
    private Integer id;
    private String code;
    private String name;
    private Integer parentId;
    private Integer sortOrder;
    private Boolean isActive;
    private LocalDateTime createdAt;

    /**
     * Transient — không map từ DB entity.
     * Được set bởi GetAllModulesWithPermissionsUseCase.
     */
    private List<Permission> permissions;
}
