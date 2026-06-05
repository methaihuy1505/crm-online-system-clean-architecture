package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.role.*;
import com.vti.crm.interfaces.dto.request.role.RoleCreateRequest;
import com.vti.crm.interfaces.dto.request.role.RoleUpdateRequest;
import com.vti.crm.interfaces.dto.response.role.RoleResponse;
import com.vti.crm.interfaces.mapper.RoleWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('roles.view')")
public class RoleController {

    private final CreateRoleUseCase createRoleUseCase;
    private final GetAllRolesUseCase getAllRolesUseCase;
    private final GetRoleByIdUseCase getRoleByIdUseCase;
    private final UpdateRoleUseCase updateRoleUseCase;
    private final DeleteRoleUseCase deleteRoleUseCase;
    private final RoleWebMapper webMapper;

    @PostMapping
    @PreAuthorize("hasAuthority('roles.manage')")
    public ResponseEntity<RoleResponse> createRole(@RequestBody RoleCreateRequest request) {
        return new ResponseEntity<>(
                webMapper.toResponse(createRoleUseCase.execute(request)),
                HttpStatus.CREATED
        );
    }

    /** Danh sách roles — không kèm permissionIds (payload nhẹ) */
    @GetMapping
    public ResponseEntity<List<RoleResponse>> getAllRoles() {
        List<RoleResponse> response = getAllRolesUseCase.execute().stream()
                .map(webMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /** Chi tiết role — có kèm permissionIds để FE render bảng quyền */
    @GetMapping("/{id}")
    public ResponseEntity<RoleResponse> getRoleById(@PathVariable Integer id) {
        return ResponseEntity.ok(
                webMapper.toResponseWithPermissions(getRoleByIdUseCase.execute(id))
        );
    }

    /** Cập nhật role info + đồng bộ permissions */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('roles.manage')")
    public ResponseEntity<RoleResponse> updateRole(
            @PathVariable Integer id,
            @RequestBody RoleUpdateRequest request) {
        return ResponseEntity.ok(
                webMapper.toResponseWithPermissions(updateRoleUseCase.execute(id, request))
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('roles.manage')")
    public ResponseEntity<Void> deleteRole(@PathVariable Integer id) {
        deleteRoleUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
