package com.vti.crm.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerUpdateRequest {

    @NotBlank(message = "Tên khách hàng không được để trống")
    private String name;

    private String shortName;
    private Boolean isOrganization;

    @Pattern(regexp = "^$|^(\\d{10}|\\d{12}|\\d{13})$", message = "Mã số thuế chỉ được chứa số và có độ dài 10, 12 hoặc 13 ký tự")
    private String taxCode;

    @Pattern(regexp = "^$|^\\d{12}$", message = "CCCD/CMND phải bao gồm đúng 12 chữ số")
    private String citizenId;

    private LocalDate foundedDate;

    @Pattern(regexp = "^$|^\\d{10,11}$", message = "Số điện thoại chính phải từ 10-11 chữ số")
    private String mainPhone;

    @Pattern(regexp = "^$|^\\S+@\\S+\\.\\S+$", message = "Email không đúng định dạng")
    private String emailOfficial;

    @Pattern(regexp = "^$|^\\d{10,15}$", message = "Số Fax phải là số và từ 10-15 ký tự")
    private String fax;

    private String website;
    private String addressCompany;
    private String addressBilling;
    private String description;

    private Integer sourceId;
    private Integer campaignId;
    private Integer statusId;
    private Integer rankId;
    private Integer primaryContactId;
    private Integer branchId;
    private Integer provinceId;
    private Integer assignedUserId;
}