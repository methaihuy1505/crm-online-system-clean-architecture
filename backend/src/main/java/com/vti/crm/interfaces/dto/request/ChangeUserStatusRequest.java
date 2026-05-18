package com.vti.crm.interfaces.dto.request;

import com.vti.crm.domain.model.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeUserStatusRequest {
    @NotNull(message = "Trạng thái không được để trống")
    UserStatus status;
}
