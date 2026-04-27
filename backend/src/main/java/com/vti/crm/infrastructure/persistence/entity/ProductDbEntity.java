package com.vti.crm.infrastructure.persistence.entity;

import com.vti.crm.domain.model.Product.ProductType;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDbEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "product_code", nullable = false, unique = true)
    private String productCode;

    @Column(name = "name")
    private String name;

    @Column(name = "category_id")
    private Integer categoryID;

    @Column(name = "uom_id")
    private Integer uomID;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_type")
    private ProductType productType;

    @Column(name = "base_price")
    private BigDecimal basePrice;

    @Column(name = "vat_rate")
    private BigDecimal vatRate;

    @Column(name = "deposit_override")
    private BigDecimal depositOverride;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "description")
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by_id")
    private Integer createdByID;

    @Column(name = "updated_by_id")
    private Integer updatedByID;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted;
}