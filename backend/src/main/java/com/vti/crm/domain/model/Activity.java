package com.vti.crm.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class Activity {
    private Integer id;
    private Integer taskId;
    private Integer parentId;
    private ParentType parentType;
    private Integer contactId;
    private ActivityType activityType;
    private String subject;
    private String description;
    private CallType callType;
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


    public enum ParentType { LEAD, CUSTOMER, OPPORTUNITY }
    public enum ActivityType { CALL, MEETING, NOTE, EMAIL_QUOTE, EMAIL_TRANSACTION }
    public enum CallType { INBOUND, OUTBOUND }

    // 1. Hàm tạo ms
    public void initializeForCreation() {
        this.validate();
        //CALL
        if(this.activityType.equals(ActivityType.CALL))
        {
            if(this.activityDate==null)
                throw new IllegalArgumentException("Ngày hoạt động không được để trống");
            if(this.callType==null)
                throw new IllegalArgumentException("Loại cuộc gọi không được để trống");
            if(this.callResult==null)
                throw new IllegalArgumentException("Kết quả cuộc gọi không được để trống");
            if (this.duration == null || this.duration < 0 )
                throw new IllegalArgumentException("Thời gian không hợp lệ,phải lớn hơn 0)");
        }
        //MEETING
        else if(this.activityType.equals(ActivityType.MEETING))
        {
            if(this.location == null || this.location.trim().isEmpty())
                throw new IllegalArgumentException("Địa điểm không được để trống");
            if(this.startDate == null)
                throw new IllegalArgumentException("Ngày bắt đầu không được để trống");
            if(this.endDate == null)
                throw new IllegalArgumentException("Ngày kết thúc không được để trống");
            //Start<end
            if(this.startDate != null && this.endDate != null)
            {
                if(this.startDate.toLocalTime().isAfter(this.endDate.toLocalTime()))
                    throw new IllegalArgumentException("Ngày kết thúc phải lớn hơn ngày bắt đầu");
            }
        }
        //NOTE
        else if(this.activityType.equals(ActivityType.NOTE)) {
            if(this.activityDate == null)
                throw new IllegalArgumentException("Ngày hoạt động không được để trống");
            if(this.description == null || this.description.trim().isEmpty())
                throw new IllegalArgumentException("Nội dung không được để trống");
        }
        //EMAIL_QUOTE && EMAIL_TRAN
        else if(this.activityType.equals(ActivityType.EMAIL_QUOTE)
                || this.activityType.equals(ActivityType.EMAIL_TRANSACTION)) {
            if(this.activityDate == null)
                throw new IllegalArgumentException("Ngày hoạt động không được để trống");
        }
        //tự tạo các thuộc tính
        this.createdAt = LocalDateTime.now();
    }
    // 2. Hàm dùng khi CẬP NHẬT (State Mutation)
    // 2. Hàm dùng khi CẬP NHẬT (State Mutation)
    public void updateFrom(Activity newData) {
        // 1. Kiểm tra Rule bất biến: Không đổi loại hoạt động
        if (newData.getActivityType() != null && this.activityType != newData.getActivityType()) {
            throw new IllegalArgumentException("Không được phép thay đổi Loại hoạt động sau khi đã tạo!");
        }

        // 2. THỰC HIỆN GÁN DỮ LIỆU MỚI VÀO ENTITY CŨ
        // ---> ĐÂY LÀ CHỖ ĐÃ FIX: Bổ sung 4 trường bị thiếu <---
        this.taskId = newData.getTaskId();
        this.parentId = newData.getParentId() != null ? newData.getParentId() : this.parentId;
        this.parentType = newData.getParentType() != null ? newData.getParentType() : this.parentType;
        this.contactId = newData.getContactId();

        // Các trường cũ bạn đã viết
        this.subject = newData.getSubject() != null ? newData.getSubject() : this.subject;
        this.description = newData.getDescription();
        this.callType = newData.getCallType();
        this.callResult = newData.getCallResult();
        this.startDate = newData.getStartDate();
        this.endDate = newData.getEndDate();
        this.location = newData.getLocation();
        this.duration = newData.getDuration();
        this.activityDate = newData.getActivityDate() != null ? newData.getActivityDate() : this.activityDate;
        this.isPriority = newData.getIsPriority() != null ? newData.getIsPriority() : this.isPriority;
        this.nextFollowUpDate = newData.getNextFollowUpDate();
        this.isCompleted = newData.getIsCompleted() != null ? newData.getIsCompleted() : this.isCompleted;

        // Cập nhật Audit Log
        this.updatedBy = newData.getUpdatedBy();
        this.updatedAt = LocalDateTime.now();

        // 3. VALIDATE LẠI TOÀN BỘ ENTITY SAU KHI ĐÃ CẬP NHẬT TRẠNG THÁI MỚI
        this.validate();

        //CALL
        if(this.activityType.equals(ActivityType.CALL))
        {
            if(this.activityDate == null)
                throw new IllegalArgumentException("Ngày hoạt động không được để trống");
            if(this.callType == null)
                throw new IllegalArgumentException("Loại cuộc gọi không được để trống");
            if(this.callResult == null)
                throw new IllegalArgumentException("Kết quả cuộc gọi không được để trống");
            if (this.duration == null || this.duration < 0 )
                throw new IllegalArgumentException("Thời gian không hợp lệ, phải lớn hơn 0");
        }
        //MEETING
        else if(this.activityType.equals(ActivityType.MEETING))
        {
            if(this.location == null || this.location.trim().isEmpty())
                throw new IllegalArgumentException("Địa điểm không được để trống");
            if(this.startDate == null)
                throw new IllegalArgumentException("Ngày bắt đầu không được để trống");
            if(this.endDate == null)
                throw new IllegalArgumentException("Ngày kết thúc không được để trống");
            //Start<end
            if(this.startDate != null && this.endDate != null)
            {
                if(this.startDate.toLocalTime().isAfter(this.endDate.toLocalTime()))
                    throw new IllegalArgumentException("Ngày kết thúc phải lớn hơn ngày bắt đầu");
            }
        }
        //NOTE
        else if(this.activityType.equals(ActivityType.NOTE)) {
            if(this.activityDate == null)
                throw new IllegalArgumentException("Ngày hoạt động không được để trống");
            if(this.description == null || this.description.trim().isEmpty())
                throw new IllegalArgumentException("Nội dung không được để trống");
        }
        //EMAIL_QUOTE && EMAIL_TRAN
        else if(this.activityType.equals(ActivityType.EMAIL_QUOTE)
                || this.activityType.equals(ActivityType.EMAIL_TRANSACTION)) {
            if(this.activityDate == null)
                throw new IllegalArgumentException("Ngày hoạt động không được để trống");
        }
    }
    private void validate() {
        //check valid chung
        if(this.subject == null || this.subject.trim().isEmpty())
            throw new IllegalArgumentException("Tiêu đề không được để trống!");
        if(this.parentId == null)
            throw new IllegalArgumentException("Id đối tượng không được để trống");
        if(this.parentType == null)
            throw new IllegalArgumentException("Loại đối tượng không được để trống");
        if(this.activityType == null)
            throw new IllegalArgumentException("Loại hoạt động không được để trống");
        if(this.createdBy==null)
            throw new IllegalArgumentException("Người tạo không được để trống");
    }
}
