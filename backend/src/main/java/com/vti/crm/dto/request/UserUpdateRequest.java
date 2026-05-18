package com.vti.crm.dto.request;

import com.vti.crm.entity.EnumStatus;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {


    @Size(min = 8, message="INVALID_PASSWORD")
    String password;
    String full_name;
    String email;
    String phone;
    String role_id;

    EnumStatus status;
}
