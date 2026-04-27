package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.ProductImage;
import com.vti.crm.infrastructure.persistence.entity.ProductImageDbEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductImageInfraMapper {

    ProductImageDbEntity toDbEntity(ProductImage domain);

    // SỬA: dùng default method để chỉ định rõ constructor nào dùng
    default ProductImage toDomainEntity(ProductImageDbEntity db) {
        if (db == null) return null;
        return new ProductImage(db.getId(), db.getId(), db.getImageUrl());
    }
}