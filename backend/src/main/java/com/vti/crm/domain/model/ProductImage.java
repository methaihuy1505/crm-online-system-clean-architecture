package com.vti.crm.domain.model;



public class ProductImage {
    private Integer id;
    private Integer productId;
    private String imageUrl;

    public ProductImage(Integer productId, String imageUrl) {
        this(null,productId,imageUrl);
    }

    public ProductImage(Integer id, Integer productId, String imageUrl) {
        this.id = id;
        this.productId = productId;
        this.imageUrl = imageUrl;
    }

    public void update(Integer productId, String imageUrl, Integer sortOrder){
        this.productId = productId;
        this.imageUrl = imageUrl;
    }
    public Integer getId() {
        return id;
    }

    public Integer getProductId() {
        return productId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

}
