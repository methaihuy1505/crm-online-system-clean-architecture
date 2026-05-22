package com.vti.crm.interfaces.dto.response.product;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductCategoryResponse {
    private Integer id;
    private String name;
    private String description;
}