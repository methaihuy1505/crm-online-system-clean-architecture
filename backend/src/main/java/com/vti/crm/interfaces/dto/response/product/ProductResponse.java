package com.vti.crm.interfaces.dto.response.product;

import com.vti.crm.domain.model.Product.ProductType ;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductResponse {

    private Integer id;
    private String productCode;
    private String name;

    private Integer categoryId;
    private String categoryName;

    private Integer uomId;
    private String uomName;

    private ProductType productType;
    private BigDecimal basePrice;
    private BigDecimal vatRate;
    private BigDecimal depositOverride;

    private String imageUrl;
    private String description;

    private String images;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}