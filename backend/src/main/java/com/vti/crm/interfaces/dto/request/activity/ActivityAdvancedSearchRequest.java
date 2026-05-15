package com.vti.crm.interfaces.dto.request.activity;

import com.vti.crm.domain.model.Activity.Activity;
import lombok.Data;

import java.util.List;

@Data
public class ActivityAdvancedSearchRequest {
    private Activity.ActivityType activityType;
    private List<Activity.ParentType> parentTypes;
    private Boolean isPriority;
    private Boolean isCompleted;
    private Activity.CallType callType;
}
