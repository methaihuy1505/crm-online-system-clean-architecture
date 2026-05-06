package com.vti.crm.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@org.hibernate.annotations.SQLRestriction("deleted_at IS NULL")
@Entity
@Table(name = "leads")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class LeadDbEntity {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "company_name", length = 100)
    private String companyName;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(length = 100)
    private String website;

    @Column(name = "tax_code", length = 20)
    private String taxCode;

    @Column(name = "citizen_id", length = 20)
    private String citizenId;

    @Column(columnDefinition = "TEXT")
    private String address;

    // --- Các khóa ngoại (Giữ kiểu Integer để không phụ thuộc module khác) ---
    @Column(name = "province_id")
    private Integer provinceId;

    @Column(name = "branch_id")
    private Integer branchId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id")
    private SourceDbEntity source;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    private CampaignDbEntity campaign;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id")
    private LeadStatusDbEntity status;

    @Column(name = "expected_revenue", precision = 18, scale = 2)
    private BigDecimal expectedRevenue;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "total_calls")
    private Integer totalCalls = 0;

    @Column(name = "total_emails")
    private Integer totalEmails = 0;

    @Column(name = "total_meetings")
    private Integer totalMeetings = 0;

    @Column(name = "assigned_to")
    private Integer assignedTo;

    // --- Timestamps & Auditing ---
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "updated_by")
    private Integer updatedBy;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

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