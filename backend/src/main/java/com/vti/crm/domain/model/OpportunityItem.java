package com.vti.crm.domain.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Objects;

public class OpportunityItem {

    private final Integer id;
    private final Opportunity opportunity;
    private final Product product;
    private final String productName;
    private final String uomName;
    private final Integer quantity;
    private final BigDecimal unitPrice;
    private final BigDecimal vatRate;
    private final BigDecimal vatAmount;
    private final BigDecimal discountRate;
    private final BigDecimal discountAmount;
    private final BigDecimal totalPrice;      // Thành tiền chưa VAT
    private final BigDecimal finalLineTotal;  // Tổng cuối sau VAT và Chiết khấu
    private final Integer lineItemNumber;
    private final String note;
    private final LocalDateTime createdAt;

    // Private Constructor - Chỉ cho phép khởi tạo qua Builder
    private OpportunityItem(OpportunityItemBuilder builder) {
        this.id              = builder.id;
        this.opportunity     = Objects.requireNonNull(builder.opportunity, "Opportunity không được để trống");
        this.product         = builder.product; // Có thể null nếu chỉ nhập productName
        this.productName     = Objects.requireNonNull(builder.productName != null ? builder.productName : (product != null ? product.getName() : null), "Product name là bắt buộc");
        this.uomName         = builder.uomName;
        this.quantity        = builder.quantity != null ? builder.quantity : 1;
        this.unitPrice       = Objects.requireNonNull(builder.unitPrice, "Unit Price là bắt buộc");
        this.vatRate         = builder.vatRate != null ? builder.vatRate : BigDecimal.valueOf(10.00);
        this.discountRate    = builder.discountRate != null ? builder.discountRate : BigDecimal.ZERO;
        this.discountAmount  = builder.discountAmount != null ? builder.discountAmount : BigDecimal.ZERO;
        this.lineItemNumber  = builder.lineItemNumber;
        this.note            = builder.note;
        this.createdAt       = builder.createdAt != null ? builder.createdAt : LocalDateTime.now();

        // LOGIC NGHIỆP VỤ: Tự tính toán các giá trị tài chính ngay khi khởi tạo
        this.totalPrice      = this.unitPrice.multiply(BigDecimal.valueOf(this.quantity));
        this.vatAmount       = this.totalPrice.multiply(this.vatRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        this.finalLineTotal  = this.totalPrice.add(this.vatAmount).subtract(this.discountAmount);
    }

    // ====================== BUILDER ======================
    public static class OpportunityItemBuilder {
        private Integer id;
        private Opportunity opportunity;
        private Product product;
        private String productName;
        private String uomName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal vatRate;
        private BigDecimal discountRate;
        private BigDecimal discountAmount;
        private Integer lineItemNumber;
        private String note;
        private LocalDateTime createdAt;

        public OpportunityItemBuilder opportunity(Opportunity opportunity) { this.opportunity = opportunity; return this; }
        public OpportunityItemBuilder product(Product product) { this.product = product; return this; }
        public OpportunityItemBuilder productName(String productName) { this.productName = productName; return this; }
        public OpportunityItemBuilder uomName(String uomName) { this.uomName = uomName; return this; }
        public OpportunityItemBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public OpportunityItemBuilder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }
        public OpportunityItemBuilder vatRate(BigDecimal vatRate) { this.vatRate = vatRate; return this; }
        public OpportunityItemBuilder discountRate(BigDecimal discountRate) { this.discountRate = discountRate; return this; }
        public OpportunityItemBuilder discountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; return this; }
        public OpportunityItemBuilder lineItemNumber(Integer lineItemNumber) { this.lineItemNumber = lineItemNumber; return this; }
        public OpportunityItemBuilder note(String note) { this.note = note; return this; }

        public OpportunityItem build() {
            // Validation
            if (this.unitPrice.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Unit price không được âm");
            }
            if (this.quantity < 1) {
                throw new IllegalArgumentException("Quantity phải từ 1 trở lên");
            }
            return new OpportunityItem(this);
        }
    }

    // ====================== GETTERS ======================
    public Integer getId() { return id; }
    public Opportunity getOpportunity() { return opportunity; }
    public Product getProduct() { return product; }
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