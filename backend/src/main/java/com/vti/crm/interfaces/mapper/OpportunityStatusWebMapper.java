package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.OpportunityStatus;
import com.vti.crm.interfaces.dto.response.opportunity.OpportunityStatusResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OpportunityStatusWebMapper {

    @Mapping(source = "final", target = "isFinal")
    OpportunityStatusResponse toResponse(OpportunityStatus domain);
}