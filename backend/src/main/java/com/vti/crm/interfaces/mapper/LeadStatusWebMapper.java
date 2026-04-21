package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.LeadStatus;
import com.vti.crm.interfaces.dto.response.LeadStatusResponse;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LeadStatusWebMapper {
    LeadStatusResponse toResponse(LeadStatus domain);
}