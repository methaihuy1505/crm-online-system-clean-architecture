package com.vti.crm.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "opportunities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OpportunityDbEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "opportunity_code", unique = true)
    private String opportunityCode;

    @Column(nullable = false)
    private String name;

    @Column(name = "customer_id", nullable = false)
    private Integer customerId;

    // SỬA: bỏ @ManyToOne, dùng @Column với đúng tên cột
    @Column(name = "stage_id")
    private Integer stage;

    @Column(name = "status_id")
    private Integer status;

    @Column(name = "lost_reason_id")
    private Integer lostReason;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "deposit_amount")
    private Double depositAmount;

    @Column(name = "remaining_amount")
    private Double remainingAmount;

    private Integer probability;

    private String description;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "opportunity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OpportunityItemDbEntity> items = new ArrayList<>();
}