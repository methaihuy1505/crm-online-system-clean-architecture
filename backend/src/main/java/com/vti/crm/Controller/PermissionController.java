package com.vti.crm.Controller;

import com.vti.crm.dto.request.*;
import com.vti.crm.dto.response.PermissionResponse;

import com.vti.crm.service.PermissionService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/permission")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionController {
    PermissionService permissionService;

    @PostMapping
        //@RequestBody là sẽ nhận Json từ client
    ApiResponse<PermissionResponse> createPermission(@RequestBody @Valid PermissionCreationRequest request) {
        return ApiResponse.<PermissionResponse>builder()
                .result(permissionService.createPermission(request))
                .build();
    }
    @GetMapping
    ApiResponse<List<PermissionResponse>> getPermission() {
        return ApiResponse.<List<PermissionResponse>>builder()
                .result(permissionService.getAllPermissions())
                .build();
    }

    @GetMapping("/{perId}")
    ApiResponse<PermissionResponse> getPer(@PathVariable("perId") int perId) {
        return ApiResponse.<PermissionResponse>builder()
                .result(permissionService.getper(perId))
                .build();
    }

    @PutMapping("/{perId}")
    ApiResponse<PermissionResponse>  updatePer(@PathVariable int perId, @RequestBody PermissionUpdateRequest request) {
        return ApiResponse.<PermissionResponse>builder()
                .result(permissionService.updatePermission(perId,request))
                .build();
    }

    @DeleteMapping("/{perId}")
    String deletePer(@PathVariable int perId) {
        permissionService.deletePermisson(perId);
        return "Permission has been deleted";
    }
}
