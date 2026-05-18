package com.vti.crm.interfaces.dto.request.task;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskNoteCreationRequest {
    private Integer taskId;
    private Integer userId;
    private String content;
}
