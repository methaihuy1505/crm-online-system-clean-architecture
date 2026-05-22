package com.vti.crm.interfaces.dto.response.task;

import com.vti.crm.domain.model.Task;
import lombok.Builder;
import lombok.Data;


import java.time.LocalDateTime;
@Data
@Builder
public class TaskResponseDTO {
    private Integer id;
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
    private LocalDateTime deletedAt;
    private Integer createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer updatedBy;
}
