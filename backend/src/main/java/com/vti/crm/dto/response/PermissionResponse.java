package com.vti.crm.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.security.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionResponse {
    int id;
    int module_id;
    String action;
    String code;
    String description;
    boolean is_active;
    Timestamp created_at;
}
