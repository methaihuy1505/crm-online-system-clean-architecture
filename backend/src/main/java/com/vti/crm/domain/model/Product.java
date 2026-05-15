package com.vti.crm.domain.model;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

public class Product {
    private final Integer id;
    private String productCode;
    private String name;
    private Integer categoryID;
    private Integer uomID;
    private ProductType productType;
    private BigDecimal basePrice;
    private BigDecimal vatRate;
    private BigDecimal depositOverride;
    private String imageUrl;
    private String description;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private final Integer createdByID;
    private Integer updatedByID;
    private Boolean isDeleted = false;
    public enum ProductType {
        PHYSICAL,
        SERVICE,
        DIGITAL
    }
    //dùng để so sánh Decimal
    private static final BigDecimal MINIMUM_PRICE = new BigDecimal("10");

    private Product(ProductBuilder builder) {
        this.id              = builder.id;
        this.productCode     = Objects.requireNonNull(builder.productCode, "Code is required");
        this.name            = builder.name;
        this.categoryID      = Objects.requireNonNull(builder.categoryID, "Category is required");
        this.uomID           = Objects.requireNonNull(builder.uomID, "UOM is required");
        this.productType     = Objects.requireNonNull(builder.productType, "Product Type is required");
        this.basePrice       = validateBusinessRules(builder.basePrice);
        this.vatRate         = validateBusinessRules(builder.vatRate);
        this.depositOverride = validateBusinessRules(builder.depositOverride);
        this.imageUrl         = builder.imageUrl;
        this.description     = builder.description;

        this.createdAt       = LocalDateTime.now();
        this.updatedAt       = this.createdAt;
//        this.createdByID     = Objects.requireNonNull(builder.createdByID, "Creator is required");
//        this.updatedByID     = builder.createdByID;
        this.createdByID     = 1;
        this.updatedByID     = 1;
        this.isDeleted       = false;
    }

    public static class ProductBuilder {
        private Integer id;
        private String productCode;
        private String name;
        private Integer categoryID;
        private Integer uomID;
        private ProductType productType;
        private BigDecimal basePrice;
        private BigDecimal vatRate;
        private BigDecimal depositOverride;
        private String imageUrl;
        private String description;
        private Integer createdByID;

        public ProductBuilder id(Integer id) { this.id = id; return this; }
        public ProductBuilder productCode(String productCode) { this.productCode = productCode; return this; }
        public ProductBuilder name(String name) { this.name = name; return this; }
        public ProductBuilder categoryID(Integer categoryID) { this.categoryID = categoryID; return this; }
        public ProductBuilder uomID(Integer uomID) { this.uomID = uomID; return this; }
        public ProductBuilder productType(ProductType productType) { this.productType = productType; return this; }
        public ProductBuilder basePrice(BigDecimal basePrice) { this.basePrice = basePrice; return this; }
        public ProductBuilder vatRate(BigDecimal vatRate) { this.vatRate = vatRate; return this; }
        public ProductBuilder depositOverride(BigDecimal depositOverride) { this.depositOverride = depositOverride; return this; }
        public ProductBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public ProductBuilder description(String description) { this.description = description; return this; }
        public ProductBuilder createdByID(Integer createdByID) { this.createdByID = createdByID; return this; }

        public Product build() {
            Objects.requireNonNull(productCode, "Mã sản phẩm không được trống");
            Objects.requireNonNull(categoryID, "Phân mục không được trống");
            Objects.requireNonNull(uomID, "Đơn vị tính không được trống");
            Objects.requireNonNull(productType, "Loại sản phẩm không được trống");
            return new Product(this);
        }
    }

    public void update(String productCode,
                       String name,
                       Integer categoryID,
                       Integer uomID,
                       ProductType productType,
                       BigDecimal basePrice,
                       BigDecimal vatRate,
                       BigDecimal depositOverride,
                       String imageUrl,
                       String description,
                       Integer updatedByID) {

        Objects.requireNonNull(productCode, "Mã sản phẩm không được trống");
        Objects.requireNonNull(categoryID, "Phân mục không được trống");
        Objects.requireNonNull(uomID, "Đơn vị tính không được trống");
        Objects.requireNonNull(productType, "Loại sản phẩm không được trống");
        Objects.requireNonNull(updatedByID, "Người cập nhật không được trống");

        this.productCode     = productCode;
        this.name            = name;
        this.productType     = productType;
        this.basePrice       = validateBusinessRules(basePrice);
        this.vatRate         = validateBusinessRules(vatRate);
        this.depositOverride = validateBusinessRules(depositOverride);
        this.imageUrl         = imageUrl;
        this.description     = description;
        this.updatedAt       = LocalDateTime.now();
//        this.updatedByID     = updatedByID;
        this.updatedByID     =1;
    }

    public void delete() { this.isDeleted = true; }

    private BigDecimal validateBusinessRules(BigDecimal value) {
        return (value == null || value.compareTo(MINIMUM_PRICE) < 0) ? BigDecimal.ZERO : value;
    }

    // Getters trả về Integer
    public Integer getId() { return id; }
    public Integer getCategoryID() { return categoryID; }
    public Integer getUomID() { return uomID; }
    public ProductType getProductType() { return productType; }
    public Integer getCreatedByID() { return createdByID; }
    public Integer getUpdatedByID() { return updatedByID; }
    public String getProductCode() { return productCode; }
    public String getName() { return name; }
    public BigDecimal getBasePrice() { return basePrice; }
    public BigDecimal getVatRate() { return vatRate; }
    public BigDecimal getDepositOverride() { return depositOverride; }
    public String getImageUrl() { return imageUrl; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public Boolean getIsDeleted() { return isDeleted; }
}
