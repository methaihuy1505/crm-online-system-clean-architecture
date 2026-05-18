package com.vti.crm.mapper;

import com.vti.crm.dto.request.RoleCreationRequest;
import com.vti.crm.dto.request.RoleUpdateRequest;
import com.vti.crm.dto.response.RoleResponse;
import com.vti.crm.entity.Role;
import com.vti.crm.repository.RoleRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    Role toRole(RoleCreationRequest request);

    RoleResponse roleResponse(Role role);

    void updateRole(@MappingTarget Role role, RoleUpdateRequest request);
}
