package com.vti.crm.interfaces.dto.request.role;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class RoleUpdateRequest {
    private String roleName;
    private String code;
    private String description;
    private Boolean isActive = true;
    private List<Integer> permissionIds;
}
