package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Province;
import com.vti.crm.interfaces.dto.request.province.ProvinceRequest;
import com.vti.crm.interfaces.dto.response.province.ProvinceResponse;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProvinceWebMapper {
    ProvinceResponse toResponse(Province domain);
    Province toDomain(ProvinceRequest request);
}