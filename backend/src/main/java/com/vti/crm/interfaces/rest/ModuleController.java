package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.module.GetAllModulesWithPermissionsUseCase;
import com.vti.crm.interfaces.dto.response.module.ModuleResponse;
import com.vti.crm.interfaces.mapper.ModuleWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/modules")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('roles.view')")
public class ModuleController {

    private final GetAllModulesWithPermissionsUseCase getAllModulesWithPermissionsUseCase;
    private final ModuleWebMapper moduleWebMapper;

    /**
     * GET /api/v1/modules
     * Trả về toàn bộ modules active kèm permissions — dùng cho trang phân quyền FE.
     */
    @GetMapping
    public ResponseEntity<List<ModuleResponse>> getAllModules() {
        List<ModuleResponse> response = getAllModulesWithPermissionsUseCase.execute()
                .stream()
                .map(moduleWebMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
