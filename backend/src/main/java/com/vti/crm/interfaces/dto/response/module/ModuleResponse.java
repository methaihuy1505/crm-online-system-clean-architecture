package com.vti.crm.interfaces.dto.response.module;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModuleResponse {
    private Integer id;
    private String code;
    private String name;
    private Integer sortOrder;
    /** Danh sách permissions thuộc module này (chỉ is_active = true) */
    private List<PermissionItemResponse> permissions;
}
