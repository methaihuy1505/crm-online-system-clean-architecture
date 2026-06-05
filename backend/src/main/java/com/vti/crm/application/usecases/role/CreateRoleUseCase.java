package com.vti.crm.application.usecases.role;

import com.vti.crm.domain.model.Role;
import com.vti.crm.domain.repository.IRoleRepository;
import com.vti.crm.interfaces.dto.request.role.RoleCreateRequest;
import com.vti.crm.interfaces.mapper.RoleWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateRoleUseCase {
    private final IRoleRepository roleRepository;
    private final RoleWebMapper webMapper;

    public Role execute(RoleCreateRequest request) {
        Role role = webMapper.toDomain(request);
        return roleRepository.save(role);
    }
}