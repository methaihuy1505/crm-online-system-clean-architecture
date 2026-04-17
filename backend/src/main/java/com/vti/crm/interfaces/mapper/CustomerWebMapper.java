package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Customer;
import com.vti.crm.interfaces.dto.response.CustomerResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerWebMapper {
    CustomerResponseDTO toResponse(Customer domainEntity);
}
