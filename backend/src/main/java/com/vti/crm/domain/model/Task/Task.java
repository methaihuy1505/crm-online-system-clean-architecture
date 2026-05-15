package com.vti.crm.domain.model.Task;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class Task {
    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }
    public enum Status {
        NOT_STARTED, IN_PROGRESS, PENDING, COMPLETED, CANCELED
    }

    public enum RelateType {
        LEAD, CUSTOMER, OPPORTUNITY, FEEDBACK
    }
    private Integer id;
    private String title;
    private String description;
    private Priority priority; //ở frontend set sẵn 1 giá trị
    private LocalDateTime startDate; //ở frontend set sẵn ngày
    private LocalDateTime endDate; //ở frontend set sẵn ngày
    private Status status; //ở frontend set sẵn 1 giá trị
    private Integer extensionCount;
    private Boolean isOverdue;
    private Integer assignedTo;
    private RelateType relateType;
    private Integer relateId;
    private LocalDateTime deletedAt;
    private Integer createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer updatedBy;
    public void initializeForCreation() {
        validation();
        if(this.createdBy==null)
            throw new IllegalArgumentException("Người tạo không được để trống");
        this.createdAt = LocalDateTime.now();
    }

    public void updateFrom(Task newData) {
        validation();
        if(newData.updatedBy == null)
            throw new IllegalArgumentException("Người cập nhật không được để trống");
        this.title = newData.getTitle() != null ? newData.getTitle() : this.title;
        this.description = newData.getDescription();
        this.priority = newData.getPriority();
        this.startDate = newData.getStartDate();
        this.endDate = newData.getEndDate();
        this.status = newData.getStatus();
        this.extensionCount = newData.getExtensionCount();
        this.isOverdue = newData.getIsOverdue();
        this.assignedTo = newData.getAssignedTo();
        this.relateType = newData.getRelateType();
        this.relateId = newData.getRelateId();
        //cập nhật
        this.updatedBy = newData.getUpdatedBy();
        this.updatedAt = LocalDateTime.now();
    }

    public void validation()
    {
        if(this.title == null || this.title.isEmpty())
            throw new IllegalArgumentException("Tiêu đề không được để trống");
        if(this.startDate == null || this.endDate == null)
            throw new IllegalArgumentException("Thời gian không được để trống");
        if(this.startDate.isAfter(this.endDate))
            throw new IllegalArgumentException("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc");
        if(this.priority == null)
            throw new IllegalArgumentException("Mức độ ưu tiên không được để trống");
        if(this.status == null)
            throw new IllegalArgumentException("Trạng thái không được để trống");
        if(this.relateType == null)
            throw new IllegalArgumentException("Loại liên quan không được để trống");
        if(this.relateId == null)
            throw new IllegalArgumentException("Id liên quan không được để trống");
        if(this.assignedTo == null)
            throw new IllegalArgumentException("Người gán không được để trống");
    }
}
