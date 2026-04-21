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
public class ContactUpdateRequest {

    @NotBlank(message = "Tên không được để trống")
    private String firstName;

    private String lastName;
    private String jobTitle;
    private LocalDate birthday;

    @Pattern(regexp = "^$|^\\d{10,11}$", message = "Số điện thoại cá nhân phải từ 10-11 chữ số")
    private String personalPhone;

    @Pattern(regexp = "^$|^\\S+@\\S+\\.\\S+$", message = "Email không đúng định dạng")
    private String personalEmail;

    private Boolean isPrimary;
}