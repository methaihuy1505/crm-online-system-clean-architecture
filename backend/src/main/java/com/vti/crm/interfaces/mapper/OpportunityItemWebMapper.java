package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.OpportunityItem;
import com.vti.crm.interfaces.dto.response.opportunity.OpportunityItemResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OpportunityItemWebMapper {

    OpportunityItemResponse toResponse(OpportunityItem domain);
}