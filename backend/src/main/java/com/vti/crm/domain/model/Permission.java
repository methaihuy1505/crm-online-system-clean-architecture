package com.vti.crm.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Permission {
    private Integer id;
    private Integer moduleId;
    private String action;
    private String code;
    private String name;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;
}