package com.vti.crm.interfaces.dto.request.user;

import com.vti.crm.domain.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserFilterRequest {
    private String keyword;                      // Tìm kiếm: username, email, fullName
    private User.Status status;                  // Lọc theo status
    private Integer roleId;                      // Lọc theo role
}

