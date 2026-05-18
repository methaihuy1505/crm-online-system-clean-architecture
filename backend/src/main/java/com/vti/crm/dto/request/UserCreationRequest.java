package com.vti.crm.dto.request;

import com.vti.crm.entity.EnumStatus;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    @Size(min = 3, message="USERNAME_INVALID")
    String username;

    @Size(min = 8, message="INVALID_PASSWORD")
    String password;
    String full_name;
    String email;
    String phone;
    String role_id;

    EnumStatus status;

}
