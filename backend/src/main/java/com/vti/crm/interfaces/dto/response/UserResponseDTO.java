package com.vti.crm.interfaces.dto.response;

import com.vti.crm.domain.model.UserStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponseDTO {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private Long roleId;
    private Long branchId;
    private Long teamId;
    private UserStatus status;
    private LocalDateTime createdAt;
}
