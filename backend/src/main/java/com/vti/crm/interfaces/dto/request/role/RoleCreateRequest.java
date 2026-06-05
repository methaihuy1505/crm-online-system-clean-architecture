package com.vti.crm.interfaces.dto.request.role;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RoleCreateRequest {
    @NotBlank(message = "Tên quyền không được để trống")
    private String roleName;
    @NotBlank(message = "Mã quyền không được để trống")
    private String code;
    private String description;
    private Boolean isActive = true;
}