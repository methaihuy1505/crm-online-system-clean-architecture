package com.vti.crm.infrastructure.persistence.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "opportunity_status")
@Getter
@Setter
public class OpportunityStatusDbEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String code;
    private String name;

    @Column(name = "is_final")
    private Boolean isFinal;
}