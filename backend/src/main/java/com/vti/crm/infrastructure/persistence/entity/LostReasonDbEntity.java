package com.vti.crm.infrastructure.persistence.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "lost_reasons")
@Getter
@Setter
public class LostReasonDbEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String code;
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;
}