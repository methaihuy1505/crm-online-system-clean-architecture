package com.vti.crm.interfaces.dto.response.task;

import com.vti.crm.domain.model.Task;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDetailsResponseDTO {
    private Integer id;
    private String title;
    private String description;
    private Task.Priority priority;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Task.Status status;
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

    // --- 3 TRƯỜNG CHỮ THẬT LIÊN MODULE DÀNH RIÊNG CHO LUỒNG HIỂN THỊ GET ---
    private String createdByName;   // Tên người giao việc (Module User)
    private String assignedToName;  // Tên người phụ trách (Module User)
    private String relateName;      // Tên đối tượng liên kết (Module Lead/Customer)
}
