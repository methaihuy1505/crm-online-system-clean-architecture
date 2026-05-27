package com.vti.crm.interfaces.dto.request.role;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class RoleUpdateRequest {
    private String roleName;
    private String code;
    private String description;
    private Boolean isActive = true;
}
