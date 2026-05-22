package com.vti.crm.interfaces.dto.request.activity;

import com.vti.crm.domain.model.Activity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ActivityUpdateRequest {
    private Integer taskId;
    private Integer parentId;
    private Activity.ParentType parentType;
    private Integer contactId;
    private Activity.ActivityType activityType;
    private String subject;
    private String description;
    
    // Call specific fields
    private Activity.CallType callType;
    private String callResult;
    
    // Meeting specific fields
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String location;
    
    // Other common fields
    private Integer duration;
    private LocalDateTime activityDate;
    private Boolean isPriority;
    private LocalDateTime nextFollowUpDate;
    private Boolean isCompleted;
    private Integer updatedBy;
}
