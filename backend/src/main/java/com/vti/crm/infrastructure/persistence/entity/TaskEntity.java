package com.vti.crm.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;


import java.time.LocalDateTime;
@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskEntity {
    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }
    public enum Status {
        NOT_STARTED, IN_PROGRESS, PENDING, COMPLETED, CANCELED
    }

    public enum RelateType {
        LEAD, CUSTOMER, OPPORTUNITY, FEEDBACK
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 60)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Priority priority;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Status status;

    @Column(name = "extension_count")
    private Integer extensionCount;

    @Column(name = "is_overdue")
    private Boolean isOverdue;

    @Column(name = "assigned_to")
    private Integer assignedTo;

    @Enumerated(EnumType.STRING)
    @Column(name = "relate_type", length = 20)
    private RelateType relateType;

    @Column(name = "relate_id")
    private Integer relateId;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;


    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "updated_by")
    private Integer updatedBy;
}
