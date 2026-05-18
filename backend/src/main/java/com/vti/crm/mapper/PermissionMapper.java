package com.vti.crm.mapper;

import com.vti.crm.dto.request.PermissionCreationRequest;
import com.vti.crm.dto.request.PermissionUpdateRequest;
import com.vti.crm.dto.request.RoleCreationRequest;
import com.vti.crm.dto.request.RoleUpdateRequest;
import com.vti.crm.dto.response.PermissionResponse;
import com.vti.crm.dto.response.RoleResponse;
import com.vti.crm.entity.Permission;
import com.vti.crm.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission (PermissionCreationRequest request);

    PermissionResponse permissionResponse(Permission permission);

    void updatePermission(@MappingTarget Permission permission, PermissionUpdateRequest request);


}
