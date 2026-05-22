package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.CustomerStatus;
import com.vti.crm.interfaces.dto.response.customer.CustomerStatusResponse;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerStatusWebMapper {
    CustomerStatusResponse toResponse(CustomerStatus domain);
}