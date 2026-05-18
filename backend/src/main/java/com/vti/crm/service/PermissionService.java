package com.vti.crm.service;

import com.vti.crm.dto.request.PermissionCreationRequest;
import com.vti.crm.dto.request.PermissionUpdateRequest;
import com.vti.crm.dto.request.RoleCreationRequest;
import com.vti.crm.dto.request.RoleUpdateRequest;
import com.vti.crm.dto.response.PermissionResponse;
import com.vti.crm.dto.response.RoleResponse;
import com.vti.crm.entity.Permission;
import com.vti.crm.entity.Role;
import com.vti.crm.exception.AppException;
import com.vti.crm.exception.ErrorCode;
import com.vti.crm.mapper.PermissionMapper;
import com.vti.crm.repository.PermissionsReponsitory;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PermissionService {
    PermissionsReponsitory permissionsReponsitory;
    PermissionMapper permissionMapper;

    public PermissionResponse createPermission(PermissionCreationRequest request) {
        log.info("add here");
        if(permissionsReponsitory.existsByAction(request.getAction()))
            throw new AppException(ErrorCode.USER_EXISTS);
        Permission permission = permissionMapper.toPermission(request);
        log.info(permission.getAction());
        return permissionMapper.permissionResponse(permissionsReponsitory.save(permission)) ;
    }

    public PermissionResponse updatePermission(int perId, PermissionUpdateRequest Request) {
        Permission permission = permissionsReponsitory.findById(perId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        permissionMapper.updatePermission(permission, Request);
        return permissionMapper.permissionResponse(permissionsReponsitory.save(permission));
    }
    public List<PermissionResponse> getAllPermissions() {
        return permissionsReponsitory.findAll().stream().map(permissionMapper::permissionResponse).toList();
    }
    public PermissionResponse getper(int perId) {
        return permissionMapper.permissionResponse(permissionsReponsitory.findById(perId).orElseThrow(() -> new RuntimeException("User not found")));
    }
    public void deletePermisson(int perId) {
        permissionsReponsitory.deleteById(perId);
    }
}
