package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Uom;
import com.vti.crm.interfaces.dto.response.UomResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UomWebMapper {

    @Mapping(source = "id", target = "id")
    @Mapping(source = "code", target = "code")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "active", target = "status") // Đổi tên cho khớp với DTO
    UomResponse toResponse(Uom uom);
}