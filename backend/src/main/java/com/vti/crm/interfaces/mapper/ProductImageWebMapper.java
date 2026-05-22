package com.vti.crm.interfaces.mapper;

import com.vti.crm.interfaces.dto.response.product.ProductImageResponseDTO;
import com.vti.crm.domain.model.ProductImage;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductImageWebMapper {
    ProductImageResponseDTO toResponse(ProductImage domainEntity);
}