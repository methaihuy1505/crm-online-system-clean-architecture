package com.vti.crm.interfaces.dto.response.activity;

import com.vti.crm.domain.model.Activity.Activity;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ActivityResponseDTO {
    private Integer id;
    private Integer taskId;
    private Integer parentId;
    private Activity.ParentType parentType;
    private Integer contactId;
    private Activity.ActivityType activityType;
    private String subject;
    private String description;

    private Activity.CallType callType;
    private String callResult;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String location;

    private Integer duration;
    private LocalDateTime activityDate;
    private Boolean isPriority;
    private LocalDateTime nextFollowUpDate;
    private Boolean isCompleted;

    private LocalDateTime deletedAt;
    private Integer createdBy;
    private Integer updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
