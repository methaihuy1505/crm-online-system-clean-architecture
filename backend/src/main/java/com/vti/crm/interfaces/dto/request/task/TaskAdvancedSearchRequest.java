package com.vti.crm.interfaces.dto.request.task;

import com.vti.crm.domain.model.Task;
import lombok.Data;

@Data
public class TaskAdvancedSearchRequest {
    private Task.RelateType relateType;
    private Task.Priority priority;
    private Task.Status status;
    private Boolean isOverdue;
}
