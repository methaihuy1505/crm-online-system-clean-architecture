package com.vti.crm.infrastructure.persistence.entity;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "customers")
public class CustomerDbEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;
    private String status;
}
