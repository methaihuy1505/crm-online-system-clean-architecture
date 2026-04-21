package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.CustomerRank;
import com.vti.crm.interfaces.dto.response.CustomerRankResponse;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerRankWebMapper {
    CustomerRankResponse toResponse(CustomerRank domain);
}