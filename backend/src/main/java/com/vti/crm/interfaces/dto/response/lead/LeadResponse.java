package com.vti.crm.interfaces.dto.response.lead;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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

    // --- Các khóa ngoại (ID và Tên hiển thị) ---
    private Integer provinceId;
    private String provinceName;    // Bổ sung

    private Integer branchId;
    private String branchName;      // Bổ sung

    private Integer sourceId;
    private String sourceName;

    private Integer campaignId;
    private String campaignName;

    private Integer assignedTo;
    private String assignedToName;  // Bổ sung (Tên nhân viên được giao)

    private Integer createdBy;
    private String createdByName;   // Bổ sung (Tên người tạo)

    private Integer updatedBy;
    private String updatedByName;   // Bổ sung (Tên người cập nhật cuối)

    // --- Trạng thái ---
    private Integer statusId;
    private String statusName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<Integer> productInterestIds;
}