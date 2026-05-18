package com.vti.crm.mapper;

import com.vti.crm.dto.request.ModuleCreationRequest;
import com.vti.crm.dto.request.ModuleUpdateRequest;
import com.vti.crm.dto.request.PermissionCreationRequest;
import com.vti.crm.dto.request.PermissionUpdateRequest;
import com.vti.crm.dto.response.ModuleResponse;
import com.vti.crm.dto.response.PermissionResponse;
import com.vti.crm.entity.Modules;
import com.vti.crm.entity.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ModuleMapper {
    Modules toModule (ModuleCreationRequest request);

    ModuleResponse moduleResponse(Modules modules);

    void updateModule(@MappingTarget Modules modules, ModuleUpdateRequest request);
}
