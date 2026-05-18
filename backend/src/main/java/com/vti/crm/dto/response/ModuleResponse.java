package com.vti.crm.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.security.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ModuleResponse {
    int id;
    String code;
    String name;
    int parent_id;
    int sort_order;
    boolean is_active;
    Timestamp created_at;
}
