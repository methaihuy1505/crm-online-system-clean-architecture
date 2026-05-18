package com.vti.crm.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.security.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleCreationRequest {
    String roleName;
    String code;
    String description;
    Boolean is_active;
}
