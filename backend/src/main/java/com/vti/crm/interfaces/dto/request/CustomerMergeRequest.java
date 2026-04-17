package com.vti.crm.interfaces.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CustomerMergeRequest {
    @NotNull(message = "ID của khách hàng bị trùng lặp không được để trống")
    private Long duplicateCustomerId;
}