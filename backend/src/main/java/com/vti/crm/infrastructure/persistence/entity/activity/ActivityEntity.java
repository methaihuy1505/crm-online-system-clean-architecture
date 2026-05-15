package com.vti.crm.infrastructure.persistence.entity.activity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "activities", indexes = {
        @Index(name = "idx_parent", columnList = "parent_id, parent_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityEntity {

    public enum ParentType {
        LEAD, CUSTOMER, OPPORTUNITY
    }

    public enum ActivityType {
        CALL, MEETING, NOTE, EMAIL_QUOTE, EMAIL_TRANSACTION
    }

    public enum CallType {
        INBOUND, OUTBOUND
    }


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "task_id")
    private Integer taskId;

    @Column(name = "parent_id", nullable = false)
    private Integer parentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "parent_type", nullable = false)
    private ParentType parentType;

    @Column(name = "contact_id")
    private Integer contactId;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false)
    private ActivityType activityType;

    @Column(length = 255, nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "call_type")
    private CallType callType;

    @Column(name = "call_result", length = 100)
    private String callResult;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(length = 255)
    private String location;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer duration;

    @Column(name = "activity_date", nullable = false)
    private LocalDateTime activityDate;

    @Column(name = "is_priority", columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean isPriority;

    @Column(name = "next_follow_up_date")
    private LocalDateTime nextFollowUpDate;

    @Column(name = "is_completed", columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean isCompleted;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "created_by", nullable = false)
    private Integer createdBy;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "updated_by")
    private Integer updatedBy;
}
