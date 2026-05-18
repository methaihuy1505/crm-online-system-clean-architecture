package com.vti.crm.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.security.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleResponse {
    String roleName;
    String code;
    String description;
    Boolean is_active;
    Timestamp created_at;
    Timestamp updated_at;
}
