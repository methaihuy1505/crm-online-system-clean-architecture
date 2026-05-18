package com.vti.crm.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionUpdateRequest {
    String action;
    String code;
    String description;
    boolean is_active;
}
