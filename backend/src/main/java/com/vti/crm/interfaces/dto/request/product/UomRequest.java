package com.vti.crm.interfaces.dto.request.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UomRequest {

    @NotBlank(message = "UOM code must not be blank")
    @Size(max = 20)
    private String code;

    @NotBlank(message = "UOM name must not be blank")
    @Size(max = 50)
    private String name;

    private boolean status;
}