package com.vti.crm.interfaces.dto.request.task;

import com.vti.crm.domain.model.Task.Task;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class TaskUpdateRequest {
    private String title;
    private String description;
    private Task.Priority priority; //ở frontend set sẵn 1 giá trị
    private LocalDateTime startDate; //ở frontend set sẵn ngày
    private LocalDateTime endDate; //ở frontend set sẵn ngày
    private Task.Status status; //ở frontend set sẵn 1 giá trị
    private Integer extensionCount;
    private Boolean isOverdue;
    private Integer assignedTo;
    private Task.RelateType relateType;
    private Integer relateId;
    private Integer updatedBy;
}
