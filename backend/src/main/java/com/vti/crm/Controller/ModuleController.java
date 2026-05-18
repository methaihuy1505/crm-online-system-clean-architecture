package com.vti.crm.Controller;

import com.vti.crm.dto.request.*;
import com.vti.crm.dto.response.ModuleResponse;
import com.vti.crm.dto.response.PermissionResponse;
import com.vti.crm.service.ModuleService;
import com.vti.crm.service.PermissionService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/modules")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ModuleController {
    ModuleService moduleService;

    @PostMapping
        //@RequestBody là sẽ nhận Json từ client
    ApiResponse<ModuleResponse> createModule(@RequestBody @Valid ModuleCreationRequest request) {
        return ApiResponse.<ModuleResponse>builder()
                .result(moduleService.createModules(request))
                .build();
    }
    @GetMapping
    ApiResponse<List<ModuleResponse>> getModule() {
        return ApiResponse.<List<ModuleResponse>>builder()
                .result(moduleService.getAllModules())
                .build();
    }

    @GetMapping("/{moduleId}")
    ApiResponse<ModuleResponse> getPer(@PathVariable("moduleId") int moduleId) {
        return ApiResponse.<ModuleResponse>builder()
                .result(moduleService.getModules(moduleId))
                .build();
    }

    @PutMapping("/{moduleId}")
    ApiResponse<ModuleResponse>  updatePer(@PathVariable int moduleId, @RequestBody ModuleUpdateRequest request) {
        return ApiResponse.<ModuleResponse>builder()
                .result(moduleService.updateModules(moduleId,request))
                .build();
    }

    @DeleteMapping("/{moduleId}")
    String deleteModule(@PathVariable int moduleId) {
        moduleService.deleteModules(moduleId);
        return "Module has been deleted";
    }
}
