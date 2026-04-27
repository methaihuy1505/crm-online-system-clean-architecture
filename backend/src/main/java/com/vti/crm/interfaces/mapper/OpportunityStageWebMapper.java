package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.OpportunityStage;
import com.vti.crm.interfaces.dto.response.OpportunityStageResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OpportunityStageWebMapper {

    @Mapping(source = "closed", target = "isClosed")
    OpportunityStageResponse toResponse(OpportunityStage domain);
}