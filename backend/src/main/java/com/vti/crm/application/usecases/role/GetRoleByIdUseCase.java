package com.vti.crm.application.usecases.role;

import com.vti.crm.domain.model.Role;
import com.vti.crm.domain.repository.IRolePermissionRepository;
import com.vti.crm.domain.repository.IRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetRoleByIdUseCase {

    private final IRoleRepository roleRepository;
    private final IRolePermissionRepository rolePermissionRepository;

    /**
     * Trả về Role kèm permissionIds (transient field).
     * Controller sẽ dùng để build RoleResponse có permissionIds.
     */
    public Role execute(Integer id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy vai trò"));

        List<Integer> permissionIds = rolePermissionRepository.findPermissionIdsByRoleId(id);
        role.setPermissionIds(permissionIds); // transient field — xem Role.java bên dưới

        return role;
    }
}
