package com.vti.crm.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeadUpdateRequest {
    @NotBlank(message = "Tên khách hàng không được để trống")
    private String fullName;

    private String companyName;

    @Pattern(regexp = "^$|^\\d{10,11}$", message = "Số điện thoại phải từ 10-11 chữ số")
    private String phone;

    @Pattern(regexp = "^$|^\\S+@\\S+\\.\\S+$", message = "Email không đúng định dạng")
    private String email;

    private String website;

    @Pattern(regexp = "^$|^(\\d{10}|\\d{12}|\\d{13})$", message = "Mã số thuế chỉ được chứa số và có độ dài 10, 12 hoặc 13 ký tự")
    private String taxCode;

    @Pattern(regexp = "^$|^\\d{12}$", message = "CCCD/CMND phải bao gồm đúng 12 chữ số")
    private String citizenId;

    private String address;

    private Integer provinceId;
    private Integer branchId;
    private Integer sourceId;
    private Integer campaignId;
    private Integer statusId;
    private Integer assignedTo;

    private BigDecimal expectedRevenue;
    private String description;
    private List<Integer> productInterestIds;
}