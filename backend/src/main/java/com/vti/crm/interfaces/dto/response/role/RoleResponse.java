package com.vti.crm.interfaces.dto.response.role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleResponse {
    private Integer id;
    private String roleName;
    private String code;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    /**
     * Chỉ có giá trị khi gọi GET /roles/{id}.
     * GET /roles (list) trả về null để giữ payload nhẹ.
     */
    private List<Integer> permissionIds;
}
