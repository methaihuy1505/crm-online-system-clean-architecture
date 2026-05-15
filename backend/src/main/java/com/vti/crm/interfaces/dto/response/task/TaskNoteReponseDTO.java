package com.vti.crm.interfaces.dto.response.task;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TaskNoteReponseDTO {
    private Integer id;
    private Integer taskId;
    private Integer userId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;
    private LocalDateTime updateAt;
}
