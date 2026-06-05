package com.vti.crm.interfaces.dto.response.activity;

import com.vti.crm.domain.model.Activity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityDetailsResponseDTO {
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
    private LocalDateTime createdAt;
    private Integer updatedBy;
    private LocalDateTime updatedAt;

    private String createdByName;  // Tên người tạo (Vá tạm dữ liệu User)
    private String parentName;     // Tên đối tượng đa hình (Lead / Customer / Opportunity)
    private String taskTitle;      // Tên tiêu đề công việc (Dữ liệu thật từ Module Task)
    private String contactName;    // Tên người liên hệ (Dữ liệu thật từ Module Contact)
}