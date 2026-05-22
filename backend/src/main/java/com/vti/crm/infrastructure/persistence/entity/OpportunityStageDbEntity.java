package com.vti.crm.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "opportunity_stages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpportunityStageDbEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @Column(name = "probability_default")
    private Integer probabilityDefault;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "is_closed")
    private Boolean isClosed;
}