package com.vti.crm.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Builder
@Entity
@Table(name = "lead_status")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class LeadStatusDbEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 50)
    private String name;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;
}