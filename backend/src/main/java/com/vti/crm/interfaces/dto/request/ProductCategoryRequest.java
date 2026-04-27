package com.vti.crm.interfaces.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductCategoryRequest {

    @NotBlank(message = "Name must not be blank")
    @Size(max = 255)
    private String name;

    @Size(max = 500)
    private String description;
}