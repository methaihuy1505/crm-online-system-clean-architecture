package com.vti.crm.interfaces.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerCreateRequest {

    @NotBlank(message = "Tên không được để trống")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    // Số điện thoại có thể không bắt buộc lúc mới tạo
    private String phone;
}