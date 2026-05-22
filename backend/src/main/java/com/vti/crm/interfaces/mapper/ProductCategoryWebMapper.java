package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.ProductCategory;
import com.vti.crm.interfaces.dto.response.product.ProductCategoryResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductCategoryWebMapper {
    ProductCategoryResponse toResponse(ProductCategory domainEntity);
}