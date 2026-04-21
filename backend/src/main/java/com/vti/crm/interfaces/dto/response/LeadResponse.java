package com.vti.crm.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class LeadResponse {
    private Integer id;

    // --- Thông tin cơ bản ---
    private String fullName;
    private String companyName;
    private String phone;
    private String email;
    private String website;
    private String taxCode;
    private String citizenId;
    private String address;
    private BigDecimal expectedRevenue;
    private String description;

    // --- Thống kê tương tác ---
    private Integer totalCalls;
    private Integer totalEmails;
    private Integer totalMeetings;

    // --- Các khóa ngoại (ID) ---
    private Integer provinceId;
    private Integer branchId;
    private Integer sourceId;
    private String sourceName;
    private Integer campaignId;
    private String campaignName;
    private Integer assignedTo;
    private Integer createdBy;
    private Integer updatedBy;

    // --- Trạng thái ---
    private Integer statusId;
    private String statusName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}