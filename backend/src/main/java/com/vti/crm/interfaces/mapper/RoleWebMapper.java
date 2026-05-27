package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Role;
import com.vti.crm.interfaces.dto.request.role.RoleCreateRequest;
import com.vti.crm.interfaces.dto.response.role.RoleResponse;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoleWebMapper {
    RoleResponse toResponse(Role domain);
    Role toDomain(RoleCreateRequest request);
}