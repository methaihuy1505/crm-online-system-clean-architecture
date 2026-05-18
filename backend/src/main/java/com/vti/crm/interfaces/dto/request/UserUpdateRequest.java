package com.vti.crm.interfaces.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    @Size(max = 100, message = "Họ tên không được vượt quá 100 ký tự")
    String fullName;

    @Email(message = "Email không hợp lệ")
    @Size(max = 100, message = "Email không được vượt quá 100 ký tự")
    String email;

    @Size(max = 20, message = "Số điện thoại không được vượt quá 20 ký tự")
    String phone;
}
