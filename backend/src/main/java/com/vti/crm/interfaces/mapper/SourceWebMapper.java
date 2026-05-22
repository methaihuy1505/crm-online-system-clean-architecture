package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Source;
import com.vti.crm.interfaces.dto.response.source.SourceResponse;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SourceWebMapper {
    SourceResponse toResponse(Source domain);
}