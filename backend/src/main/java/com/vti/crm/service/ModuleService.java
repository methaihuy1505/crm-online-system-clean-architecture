package com.vti.crm.service;

import com.vti.crm.dto.request.ModuleCreationRequest;
import com.vti.crm.dto.request.ModuleUpdateRequest;
import com.vti.crm.dto.request.PermissionUpdateRequest;
import com.vti.crm.dto.response.ModuleResponse;
import com.vti.crm.dto.response.PermissionResponse;
import com.vti.crm.entity.Permission;
import com.vti.crm.exception.AppException;
import com.vti.crm.exception.ErrorCode;
import com.vti.crm.mapper.ModuleMapper;
import com.vti.crm.entity.Modules;

import com.vti.crm.repository.ModuleReponsitory;

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
public class ModuleService {
    ModuleReponsitory moduleReponsitory;
    ModuleMapper moduleMapper;

    public ModuleResponse createModules(ModuleCreationRequest request) {
        log.info("add here");
        if(moduleReponsitory.existsByCode(request.getCode()))
            throw new AppException(ErrorCode.USER_EXISTS);
        Modules modules = moduleMapper.toModule(request);
        log.info(modules.getCode());
        return moduleMapper.moduleResponse(moduleReponsitory.save(modules)) ;
    }

    public ModuleResponse updateModules(int moduleId, ModuleUpdateRequest Request) {
        Modules modules = moduleReponsitory.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        moduleMapper.updateModule(modules, Request);
        return moduleMapper.moduleResponse(moduleReponsitory.save(modules));
    }
    public List<ModuleResponse> getAllModules() {
        return moduleReponsitory.findAll().stream().map(moduleMapper::moduleResponse).toList();
    }
    public ModuleResponse getModules(int moduleId) {
        return moduleMapper.moduleResponse(moduleReponsitory.findById(moduleId).orElseThrow(() -> new RuntimeException("Module not found")));
    }
    public void deleteModules(int moduleId) {
        moduleReponsitory.deleteById(moduleId);
    }
}
