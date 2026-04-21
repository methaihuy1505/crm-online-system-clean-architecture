package com.vti.crm.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@org.hibernate.annotations.SQLRestriction("deleted_at IS NULL")
@Entity
@Builder
@Table(name = "customers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CustomerDbEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "customer_code", nullable = false, length = 50, unique = true)
    private String customerCode;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "short_name", length = 100)
    private String shortName;

    @Builder.Default
    @Column(name = "is_organization")
    private Boolean isOrganization = true;

    @Column(name = "tax_code", length = 50)
    private String taxCode;

    @Column(name = "citizen_id", length = 20)
    private String citizenId;

    @Column(name = "founded_date")
    private LocalDate foundedDate;

    @Column(length = 100)
    private String website;

    @Column(name = "email_official", length = 100)
    private String emailOfficial;

    @Column(name = "main_phone", length = 20)
    private String mainPhone;

    @Column(length = 50)
    private String fax;

    @Column(name = "address_company", columnDefinition = "TEXT")
    private String addressCompany;

    @Column(name = "address_billing", columnDefinition = "TEXT")
    private String addressBilling;

    @Column(columnDefinition = "TEXT")
    private String description;

    // --- Các khóa ngoại ---
    @Column(name = "source_id")
    private Integer sourceId;

    @Column(name = "campaign_id")
    private Integer campaignId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id")
    private CustomerStatusDbEntity status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rank_id")
    private CustomerRankDbEntity rank;

    @Column(name = "primary_contact_id")
    private Integer primaryContactId;

    @Column(name = "branch_id")
    private Integer branchId;

    @Column(name = "province_id")
    private Integer provinceId;

    @Column(name = "assigned_user_id")
    private Integer assignedUserId;

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