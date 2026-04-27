package com.vti.crm.interfaces.dto.request;

import com.vti.crm.domain.model.Product;
import com.vti.crm.domain.model.Product.ProductType ;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {

    @NotBlank(message = "Product code is required")
    @Size(max = 50)
    private String productCode;

    @NotBlank(message = "Product name is required")
    private String name;

    private Integer categoryId;
    private Integer uomId;

    private ProductType productType;
    private BigDecimal basePrice;
    private BigDecimal vatRate;
    private BigDecimal depositOverride;

    private String imageUrl;
    private String description;
}