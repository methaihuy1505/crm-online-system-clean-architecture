package com.vti.crm.domain.model;

import lombok.Getter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
public class Lead {
    private Integer id;
    private String fullName;
    private String companyName;
    private String phone;
    private String email;
    private String website;
    private String taxCode;
    private String citizenId;
    private String address;
    private Integer provinceId;
    private Integer branchId;
    private Integer sourceId;
    private Integer campaignId;
    private Integer statusId;
    private BigDecimal expectedRevenue;
    private String description;
    private Integer totalCalls;
    private Integer totalEmails;
    private Integer totalMeetings;
    private Integer assignedTo;
    private Integer createdBy;
    private Integer updatedBy;

    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;

    // =====================================================================
    // CONSTRUCTOR 1: DÙNG CHO USECASE TẠO MỚI (Từ Frontend gửi xuống)
    // =====================================================================
    public Lead(String fullName, String companyName, String phone, String email,
                String website, String taxCode, String citizenId, String address,
                Integer provinceId, Integer branchId, Integer sourceId, Integer campaignId,
                Integer statusId, BigDecimal expectedRevenue, String description,
                Integer assignedTo, Integer createdBy) {

        this.id = null;
        this.fullName = fullName;
        this.companyName = companyName;
        this.phone = phone;
        this.email = email;
        this.website = website;
        this.taxCode = taxCode;
        this.citizenId = citizenId;
        this.address = address;
        this.provinceId = provinceId;
        this.branchId = branchId;
        this.sourceId = sourceId;
        this.campaignId = campaignId;
        this.statusId = statusId;
        this.expectedRevenue = expectedRevenue;
        this.description = description;

        // Khởi tạo mặc định
        this.totalCalls = 0;
        this.totalEmails = 0;
        this.totalMeetings = 0;

        this.assignedTo = assignedTo;
        this.createdBy = createdBy;
        this.updatedBy = createdBy; // Khi tạo mới, người update đầu tiên chính là người tạo

        this.createdAt = LocalDateTime.now();
        this.deletedAt = null;
    }

    // =====================================================================
    // CONSTRUCTOR 2: DÙNG CHO MAPSTRUCT (Phục dựng từ Database Entity lên)
    // =====================================================================
    public Lead(Integer id, String fullName, String companyName, String phone, String email,
                String website, String taxCode, String citizenId, String address,
                Integer provinceId, Integer branchId, Integer sourceId, Integer campaignId,
                Integer statusId, BigDecimal expectedRevenue, String description,
                Integer totalCalls, Integer totalEmails, Integer totalMeetings,
                Integer assignedTo, Integer createdBy, Integer updatedBy,
                LocalDateTime createdAt, LocalDateTime deletedAt) {

        this.id = id;
        this.fullName = fullName;
        this.companyName = companyName;
        this.phone = phone;
        this.email = email;
        this.website = website;
        this.taxCode = taxCode;
        this.citizenId = citizenId;
        this.address = address;
        this.provinceId = provinceId;
        this.branchId = branchId;
        this.sourceId = sourceId;
        this.campaignId = campaignId;
        this.statusId = statusId;
        this.expectedRevenue = expectedRevenue;
        this.description = description;
        this.totalCalls = totalCalls != null ? totalCalls : 0;
        this.totalEmails = totalEmails != null ? totalEmails : 0;
        this.totalMeetings = totalMeetings != null ? totalMeetings : 0;
        this.assignedTo = assignedTo;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdAt = createdAt;
        this.deletedAt = deletedAt;
    }

    // --- Hành vi nghiệp vụ ---
    public void changeStatus(Integer newStatusId, Integer currentUserId) {
        this.statusId = newStatusId;
        this.updatedBy = currentUserId;
    }

    public void updateInfo(String fullName, String companyName, String phone, String email,
                           String website, String address, String taxCode, String citizenId,
                           BigDecimal expectedRevenue, String description, Integer sourceId,
                           Integer campaignId, Integer statusId, Integer provinceId,
                           Integer branchId, Integer assignedTo, Integer updatedBy) {

        final Integer CONVERTED_STATUS_ID = 3;

        if (this.statusId != null && this.statusId.equals(CONVERTED_STATUS_ID)) {
            throw new IllegalStateException("Khách hàng tiềm năng này đã được chuyển đổi, không thể chỉnh sửa thêm!");
        }

        this.fullName = fullName;
        this.companyName = companyName;
        this.phone = phone;
        this.email = email;
        this.website = website;
        this.address = address;
        this.taxCode = taxCode;
        this.citizenId = citizenId;
        this.expectedRevenue = expectedRevenue;
        this.description = description;
        this.sourceId = sourceId;
        this.campaignId = campaignId;
        this.statusId = statusId;
        this.provinceId = provinceId;
        this.branchId = branchId;
        this.assignedTo = assignedTo;
        this.updatedBy = updatedBy;
    }

    public void softDelete(Integer updatedBy) {
        this.deletedAt = LocalDateTime.now();
        this.updatedBy = updatedBy;
    }
}