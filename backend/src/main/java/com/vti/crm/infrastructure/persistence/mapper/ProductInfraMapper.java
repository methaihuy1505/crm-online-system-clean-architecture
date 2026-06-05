package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Product;
import com.vti.crm.infrastructure.persistence.entity.ProductDbEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductInfraMapper {

    default ProductDbEntity toDbEntity(Product domain) {
        if (domain == null) return null;
        ProductDbEntity e = new ProductDbEntity();
        e.setId(domain.getId());
        e.setProductCode(domain.getProductCode());
        e.setName(domain.getName());
        e.setCategoryID(domain.getCategoryID());  // ← đây là fix chính
        e.setUomID(domain.getUomID());            // ← đây là fix chính
        e.setProductType(domain.getProductType());
        e.setBasePrice(domain.getBasePrice());
        e.setVatRate(domain.getVatRate());
        e.setDepositOverride(domain.getDepositOverride());
        e.setImageUrl(domain.getImageUrl());
        e.setDescription(domain.getDescription());
        e.setCreatedAt(domain.getCreatedAt());
        e.setUpdatedAt(domain.getUpdatedAt());
        e.setCreatedByID(domain.getCreatedByID());
        e.setUpdatedByID(domain.getUpdatedByID());
        e.setIsDeleted(domain.getIsDeleted());
        return e;
    }


    default Product toDomainEntity(ProductDbEntity dbEntity) {
        if (dbEntity == null) return null;
        return new Product.ProductBuilder()
                .id(dbEntity.getId())
                .productCode(dbEntity.getProductCode())
                .name(dbEntity.getName())
                .categoryID(dbEntity.getCategoryID())
                .uomID(dbEntity.getUomID())
                .productType(dbEntity.getProductType())
                .basePrice(dbEntity.getBasePrice())
                .vatRate(dbEntity.getVatRate())
                .depositOverride(dbEntity.getDepositOverride())
                .imageUrl(dbEntity.getImageUrl())
                .description(dbEntity.getDescription())
                .build();
    }
}