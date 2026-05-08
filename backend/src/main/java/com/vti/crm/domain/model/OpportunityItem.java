package com.vti.crm.domain.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Objects;

public class OpportunityItem {

    private final Integer id;
    private final Integer opportunityId;  // SỬA: Integer thay vì Opportunity
    private final Integer productId;      // SỬA: Integer thay vì Product
    private final String productName;
    private final String uomName;
    private final Integer quantity;
    private final BigDecimal unitPrice;
    private final BigDecimal vatRate;
    private final BigDecimal vatAmount;
    private final BigDecimal discountRate;
    private final BigDecimal discountAmount;
    private final BigDecimal totalPrice;
    private final BigDecimal finalLineTotal;
    private final Integer lineItemNumber;
    private final String note;
    private final LocalDateTime createdAt;

    private OpportunityItem(OpportunityItemBuilder builder) {
        this.id             = builder.id;
        this.opportunityId  = Objects.requireNonNull(builder.opportunityId, "Opportunity ID không được để trống");
        this.productId      = builder.productId;
        this.productName    = Objects.requireNonNull(builder.productName, "Product name không được để trống");
        this.uomName        = builder.uomName;
        this.quantity       = builder.quantity != null ? builder.quantity : 1;
        this.unitPrice      = Objects.requireNonNull(builder.unitPrice, "Unit price không được để trống");
        this.vatRate        = builder.vatRate != null ? builder.vatRate : BigDecimal.valueOf(10.00);
        this.discountRate   = builder.discountRate != null ? builder.discountRate : BigDecimal.ZERO;
        this.lineItemNumber = builder.lineItemNumber;
        this.note           = builder.note;
        this.createdAt      = builder.createdAt != null ? builder.createdAt : LocalDateTime.now();

        // BUSINESS LOGIC: tính toán tài chính theo công thức thực tế
        BigDecimal qty       = BigDecimal.valueOf(this.quantity);
        this.totalPrice      = this.unitPrice.multiply(qty);
        this.discountAmount  = this.totalPrice
                .multiply(this.discountRate)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal afterDiscount = this.totalPrice.subtract(this.discountAmount);
        this.vatAmount       = afterDiscount
                .multiply(this.vatRate)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        this.finalLineTotal  = afterDiscount.add(this.vatAmount);
    }

    public static class OpportunityItemBuilder {
        private Integer id;
        private Integer opportunityId;
        private Integer productId;
        private String productName;
        private String uomName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal vatRate;
        private BigDecimal discountRate;
        private Integer lineItemNumber;
        private String note;
        private LocalDateTime createdAt;

        public OpportunityItemBuilder id(Integer id) { this.id = id; return this; }
        public OpportunityItemBuilder opportunityId(Integer opportunityId) { this.opportunityId = opportunityId; return this; }
        public OpportunityItemBuilder productId(Integer productId) { this.productId = productId; return this; }
        public OpportunityItemBuilder productName(String productName) { this.productName = productName; return this; }
        public OpportunityItemBuilder uomName(String uomName) { this.uomName = uomName; return this; }
        public OpportunityItemBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public OpportunityItemBuilder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }
        public OpportunityItemBuilder vatRate(BigDecimal vatRate) { this.vatRate = vatRate; return this; }
        public OpportunityItemBuilder discountRate(BigDecimal discountRate) { this.discountRate = discountRate; return this; }
        public OpportunityItemBuilder lineItemNumber(Integer lineItemNumber) { this.lineItemNumber = lineItemNumber; return this; }
        public OpportunityItemBuilder note(String note) { this.note = note; return this; }
        public OpportunityItemBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public OpportunityItem build() {
            if (unitPrice != null && unitPrice.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Unit price không được âm");
            }
            if (quantity != null && quantity < 1) {
                throw new IllegalArgumentException("Quantity phải từ 1 trở lên");
            }
            return new OpportunityItem(this);
        }
    }

    public Integer getId() { return id; }
    public Integer getOpportunityId() { return opportunityId; }
    public Integer getProductId() { return productId; }
    public String getProductName() { return productName; }
    public String getUomName() { return uomName; }
    public Integer getQuantity() { return quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public BigDecimal getVatRate() { return vatRate; }
    public BigDecimal getVatAmount() { return vatAmount; }
    public BigDecimal getDiscountRate() { return discountRate; }
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public BigDecimal getFinalLineTotal() { return finalLineTotal; }
    public Integer getLineItemNumber() { return lineItemNumber; }
    public String getNote() { return note; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}