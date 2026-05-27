package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.role.*;
import com.vti.crm.interfaces.dto.request.role.RoleCreateRequest;
import com.vti.crm.interfaces.dto.response.role.RoleResponse;
import com.vti.crm.interfaces.mapper.RoleWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final CreateRoleUseCase createRoleUseCase;
    private final GetAllRolesUseCase getAllRolesUseCase;
    private final GetRoleByIdUseCase getRoleByIdUseCase;
    private final UpdateRoleUseCase updateRoleUseCase;
    private final DeleteRoleUseCase deleteRoleUseCase;
    private final RoleWebMapper webMapper;

    @PostMapping
    public ResponseEntity<RoleResponse> createRole(@RequestBody RoleCreateRequest request) {
        RoleResponse response = webMapper.toResponse(createRoleUseCase.execute(request));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RoleResponse>> getAllRoles() {
        List<RoleResponse> response = getAllRolesUseCase.execute().stream()
                .map(webMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleResponse> getRoleById(@PathVariable Integer id) {
        return ResponseEntity.ok(webMapper.toResponse(getRoleByIdUseCase.execute(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleResponse> updateRole(@PathVariable Integer id, @RequestBody RoleCreateRequest request) {
        return ResponseEntity.ok(webMapper.toResponse(updateRoleUseCase.execute(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Integer id) {
        deleteRoleUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}