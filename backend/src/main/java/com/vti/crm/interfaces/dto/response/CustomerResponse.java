package com.vti.crm.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerResponse {
    private Integer id;
    private String customerCode;
    private String name;
    private String shortName;
    private Boolean isOrganization;
    private String taxCode;
    private String citizenId;
    private LocalDate foundedDate;
    private String website;
    private String emailOfficial;
    private String mainPhone;
    private String fax;
    private String addressCompany;
    private String addressBilling;
    private String description;

    // Các trường Flat Object
    private Integer statusId;
    private String statusName;

    private Integer rankId;
    private String rankName;

    private Integer sourceId;
    private Integer campaignId;
    private Integer primaryContactId;
    private Integer branchId;
    private Integer provinceId;
    private Integer assignedUserId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}