package com.vti.crm.interfaces.dto.request.user;

import com.vti.crm.domain.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {

    private String fullName;
    private String email;
    private String phone;
    private Integer roleId;
    private Integer branchId;
    private Integer teamId;
    private User.Status status;
}

