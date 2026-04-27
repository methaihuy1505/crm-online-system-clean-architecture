package com.vti.crm.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "opportunity_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpportunityItemDbEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    // ================= QUAN HỆ =================

    @JoinColumn(name = "opportunity_id")
    private Integer opportunity;

    @JoinColumn(name = "product_id")
    private Integer product;

    // ================= SNAPSHOT DATA =================

    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;

    @Column(name = "uom_name", nullable = false, length = 50)
    private String uomName;

    // ================= THÔNG TIN SỐ LƯỢNG & GIÁ =================

    @Column(name = "quantity")
    private Integer quantity = 1;

    @Column(name = "unit_price", precision = 18, scale = 2)
    private BigDecimal unitPrice;

    // ================= THUẾ (VAT) =================

    @Column(name = "vat_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal vatRate = BigDecimal.valueOf(10.00);

    @Column(name = "vat_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal vatAmount;

    // ================= CHIẾT KHẤU =================

    @Column(name = "discount_rate", precision = 5, scale = 2)
    private BigDecimal discountRate;

    @Column(name = "discount_amount", precision = 15, scale = 2)
    private BigDecimal discountAmount;

    // ================= TỔNG TIỀN =================

    @Column(name = "total_price", precision = 18, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "final_line_total", nullable = false, precision = 15, scale = 2)
    private BigDecimal finalLineTotal;

    // ================= THÔNG TIN BỔ SUNG =================

    @Column(name = "line_item_number", nullable = false)
    private Integer lineItemNumber;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    // ================= AUDIT FIELD =================

    @Column(name = "created_at", nullable = false, updatable = false,
            insertable = false)
    private LocalDateTime createdAt;
}