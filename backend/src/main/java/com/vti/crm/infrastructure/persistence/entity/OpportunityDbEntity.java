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
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
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

    @Column(name = "campaign_id")
    private Integer campaignId;          // thêm mới

    @Column(name = "stage_id")
    private Integer stage;

    @Column(name = "status_id")
    private Integer status;

    @Column(name = "lost_reason_id")
    private Integer lostReason;

    @Column(name = "next_follow_up_date")
    private LocalDateTime nextFollowUpDate;   // thêm mới

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "deposit_amount")
    private Double depositAmount;

    @Column(name = "remaining_amount")
    private Double remainingAmount;

    @Column(name = "currency_code", length = 10)
    private String currencyCode;              // thêm mới

    private Integer probability;

    @Column(name = "expected_close_date")
    private LocalDateTime expectedCloseDate;  // thêm mới

    @Column(name = "actual_close_date")
    private LocalDateTime actualCloseDate;    // thêm mới

    private String description;

    @Column(name = "assigned_to")
    private Integer assignedTo;               // thêm mới

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "created_by", updatable = false)
    private Integer createdBy;                // thêm mới

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "updated_by")
    private Integer updatedBy;                // thêm mới

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;          // thêm mới (soft delete)
}