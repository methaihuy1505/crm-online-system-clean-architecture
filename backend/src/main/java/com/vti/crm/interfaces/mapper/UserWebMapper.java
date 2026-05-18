package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.User;
import com.vti.crm.interfaces.dto.response.UserResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserWebMapper {
    UserResponseDTO toResponse(User domainEntity);
}
