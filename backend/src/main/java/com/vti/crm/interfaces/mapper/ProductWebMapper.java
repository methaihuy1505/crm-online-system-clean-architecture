package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Product;
import com.vti.crm.interfaces.dto.response.ProductResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductWebMapper {

    @Mapping(source = "id",              target = "id")
    @Mapping(source = "productCode",     target = "productCode")
    @Mapping(source = "name",            target = "name")
    @Mapping(source = "categoryID",      target = "categoryId")
    @Mapping(target = "categoryName", ignore = true)
    @Mapping(source = "uomID",           target = "uomId")
    @Mapping(target = "uomName",         ignore = true)

    @Mapping(source = "productType",     target = "productType")
    @Mapping(source = "basePrice",       target = "basePrice")
    @Mapping(source = "vatRate",         target = "vatRate")
    @Mapping(source = "depositOverride", target = "depositOverride")
    @Mapping(source = "description",     target = "description")
    @Mapping(source = "createdAt",       target = "createdAt")
    @Mapping(source = "updatedAt",       target = "updatedAt")

    // Nếu Product có field lưu ảnh, hãy mapping ở đây
    @Mapping(source = "imageUrl",        target = "imageUrl")

    ProductResponse toResponse(Product product);
}