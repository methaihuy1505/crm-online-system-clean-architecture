package com.vti.crm.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "roles")
@Getter
@Setter
public class RoleDbEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "role_name", nullable = false)
    private String roleName;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "description")
    private String description;

    @Column(name = "is_active")
    private Boolean isActive; // Hoặc Integer nếu DB lưu 0/1

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}