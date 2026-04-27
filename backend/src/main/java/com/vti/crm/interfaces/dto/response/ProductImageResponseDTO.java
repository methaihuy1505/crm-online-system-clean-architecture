package com.vti.crm.interfaces.dto.response;

public class ProductImageResponseDTO {
    private Integer id;
    private Integer productId;
    private String imageUrl;
    private Integer sortOrder;

    public ProductImageResponseDTO(Integer id, Integer productId,
                                   String imageUrl, Integer sortOrder) {
        this.id = id;
        this.productId = productId;
        this.imageUrl = imageUrl;
        this.sortOrder = sortOrder;
    }

    public Integer getId() { return id; }
    public Integer getProductId() { return productId; }
    public String getImageUrl() { return imageUrl; }
    public Integer getSortOrder() { return sortOrder; }
}