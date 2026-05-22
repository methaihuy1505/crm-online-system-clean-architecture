package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Product;
import com.vti.crm.infrastructure.persistence.entity.ProductDbEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductInfraMapper {

    ProductDbEntity toDbEntity(Product domainEntity);

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