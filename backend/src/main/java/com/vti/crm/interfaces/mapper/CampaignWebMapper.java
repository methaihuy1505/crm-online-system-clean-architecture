package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Campaign;
import com.vti.crm.interfaces.dto.response.CampaignResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CampaignWebMapper {
    CampaignResponse toResponse(Campaign domain);
}