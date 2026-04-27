package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.ProductCategory;
import com.vti.crm.infrastructure.persistence.entity.ProductCategoryDbEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductCategoryInfraMapper {

    ProductCategoryDbEntity toDbEntity(ProductCategory domainEntity);

    default ProductCategory toDomainEntity(ProductCategoryDbEntity dbEntity) {
        if (dbEntity == null) return null;
        return new ProductCategory(
                dbEntity.getId(),
                dbEntity.getName(),
                dbEntity.getDescription(),
                dbEntity.getIsDeleted()
        );
    }
}