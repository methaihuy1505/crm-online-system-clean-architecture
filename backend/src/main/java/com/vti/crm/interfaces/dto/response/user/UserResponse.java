package com.vti.crm.interfaces.dto.response.user;

import com.vti.crm.domain.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Integer id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private Integer roleId;
    private String roleName;
    private Integer branchId;
    private String branchName;
    private Integer teamId;
    private String teamName;
    private User.Status status;
    private LocalDateTime createdAt;

    public boolean isActive() {
        return status == User.Status.ACTIVE;
    }
}

