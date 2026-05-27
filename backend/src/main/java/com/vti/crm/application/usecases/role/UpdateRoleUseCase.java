package com.vti.crm.application.usecases.role;

import com.vti.crm.domain.model.Role;
import com.vti.crm.domain.repository.IRoleRepository;
import com.vti.crm.interfaces.dto.request.role.RoleCreateRequest;
import com.vti.crm.interfaces.mapper.RoleWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdateRoleUseCase {
    private final IRoleRepository roleRepository;
    private final RoleWebMapper webMapper;

    public Role execute(Integer id, RoleCreateRequest request) {
        Role existingRole = roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role not found"));
        Role updatedRole = webMapper.toDomain(request);
        updatedRole.setId(existingRole.getId());
        return roleRepository.save(updatedRole);
    }
}