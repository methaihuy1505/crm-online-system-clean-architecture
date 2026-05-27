package com.vti.crm.application.usecases.role;

import com.vti.crm.domain.repository.IRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteRoleUseCase {
    private final IRoleRepository roleRepository;

    public void execute(Integer id) {
        roleRepository.deleteById(id);
    }
}