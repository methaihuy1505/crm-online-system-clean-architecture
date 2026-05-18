package com.vti.crm.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ModuleCreationRequest {
    String code;
    String name;
    int parent_id;
    int sort_order;
    boolean is_active;
}
