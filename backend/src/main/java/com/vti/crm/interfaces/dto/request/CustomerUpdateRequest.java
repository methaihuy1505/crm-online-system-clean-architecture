package com.vti.crm.interfaces.dto.request;


import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class CustomerUpdateRequest {

    // Khi update, người dùng có thể không đổi tên nên không dùng @NotBlank
    private String fullName;

    // Nếu truyền email lên để đổi thì mới check định dạng, không truyền thì bỏ qua
    @Email(message = "Email không đúng định dạng")
    private String email;

    private String phone;
}
