package com.vti.crm.interfaces.dto.request.task;

import com.vti.crm.domain.model.Task;
import lombok.Data;
import java.util.List;

@Data
public class TaskAdvancedSearchRequest {
    private String keyword;
    private List<Task.RelateType> relateType;
    private List<Task.Priority> priority;
    private List<Task.Status> status;
    private Boolean isOverdue;
    private String search;
}
