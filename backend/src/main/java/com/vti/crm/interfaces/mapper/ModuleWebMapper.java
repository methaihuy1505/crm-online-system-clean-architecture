package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Module;
import com.vti.crm.domain.model.Permission;
import com.vti.crm.interfaces.dto.response.module.ModuleResponse;
import com.vti.crm.interfaces.dto.response.module.PermissionItemResponse;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ModuleWebMapper {

    public ModuleResponse toResponse(Module module) {
        List<Permission> perms = module.getPermissions();
        if (perms == null) perms = Collections.emptyList();

        return ModuleResponse.builder()
                .id(module.getId())
                .code(module.getCode())
                .name(module.getName())
                .sortOrder(module.getSortOrder())
                .permissions(perms.stream()
                        .map(this::toPermissionItemResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    private PermissionItemResponse toPermissionItemResponse(Permission p) {
        return PermissionItemResponse.builder()
                .id(p.getId())
                .action(p.getAction())
                .code(p.getCode())
                .name(p.getName())
                .description(p.getDescription())
                .build();
    }
}
