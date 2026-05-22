package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Opportunity;
import com.vti.crm.interfaces.dto.response.opportunity.OpportunityResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OpportunityWebMapper {

    @Mapping(source = "stage",      target = "stageId")
    @Mapping(source = "status",     target = "statusId")
    @Mapping(source = "lostReason", target = "lostReasonId")
    @Mapping(target = "stageName",      ignore = true)
    @Mapping(target = "statusName",     ignore = true)
    @Mapping(target = "lostReasonName", ignore = true)
    OpportunityResponse toResponse(Opportunity domain);
}