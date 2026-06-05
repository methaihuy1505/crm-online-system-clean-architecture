package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Role;
import com.vti.crm.interfaces.dto.request.role.RoleCreateRequest;
import com.vti.crm.interfaces.dto.request.role.RoleUpdateRequest;
import com.vti.crm.interfaces.dto.response.role.RoleResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoleWebMapper {

    /** Dùng cho GET /roles — list, không cần permissionIds */
    @Mapping(target = "permissionIds", ignore = true)
    RoleResponse toResponse(Role domain);

    /**
     * Dùng cho GET /roles/{id} và PUT /roles/{id}.
     * permissionIds được set trên domain object (transient field),
     * MapStruct tự copy sang response.
     */
    RoleResponse toResponseWithPermissions(Role domain);

    Role toDomain(RoleCreateRequest request);

    Role toDomain(RoleUpdateRequest request);
}
