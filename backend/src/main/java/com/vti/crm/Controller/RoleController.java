package com.vti.crm.Controller;

import com.vti.crm.dto.request.*;
import com.vti.crm.dto.response.RoleResponse;
import com.vti.crm.dto.response.UserResponse;
import com.vti.crm.entity.Role;
import com.vti.crm.entity.User;
import com.vti.crm.service.RoleService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {
    RoleService roleService;

    @PostMapping
    //@RequestBody là sẽ nhận Json từ client
    ApiResponse<RoleResponse> createRole(@RequestBody @Valid RoleCreationRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.createRole(request))
                .build();
    }
    @GetMapping
    ApiResponse<List<RoleResponse>> getRole() {
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAllRoles())
                .build();
    }

    @GetMapping("/{roleId}")
    ApiResponse<RoleResponse> getRole(@PathVariable("roleId") int roleId) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.getrole(roleId))
                .build();
    }

    @PutMapping("/{roleId}")
    ApiResponse<RoleResponse>  updateUser(@PathVariable int roleId, @RequestBody RoleUpdateRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.updateRole(roleId,request))
                .build();
    }

    @DeleteMapping("/{roleId}")
    String deleteUser(@PathVariable int roleId) {
        roleService.deleteRole(roleId);
        return "Role has been deleted";
    }
}
