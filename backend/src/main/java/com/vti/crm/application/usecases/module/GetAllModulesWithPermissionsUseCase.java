package com.vti.crm.application.usecases.module;

import com.vti.crm.domain.model.Module;
import com.vti.crm.domain.model.Permission;
import com.vti.crm.domain.repository.IModuleRepository;
import com.vti.crm.domain.repository.IPermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetAllModulesWithPermissionsUseCase {

    private final IModuleRepository moduleRepository;
    private final IPermissionRepository permissionRepository;

    /**
     * Trả về danh sách modules active (sorted by sort_order),
     * mỗi module chứa list permissions của nó (transient field).
     */
    public List<Module> execute() {
        List<Module> modules = moduleRepository.findAllActiveOrderBySortOrder();

        // Nhóm tất cả active permissions theo moduleId — 1 query thay vì N+1
        Map<Integer, List<Permission>> permsByModule = permissionRepository.findAllActive()
                .stream()
                .collect(Collectors.groupingBy(Permission::getModuleId));

        modules.forEach(m -> m.setPermissions(
                permsByModule.getOrDefault(m.getId(), List.of())
        ));

        return modules;
    }
}
