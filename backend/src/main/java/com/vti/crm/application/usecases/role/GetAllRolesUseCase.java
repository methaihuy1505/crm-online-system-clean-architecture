package com.vti.crm.application.usecases.role;

import com.vti.crm.domain.model.Role;
import com.vti.crm.domain.repository.IRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllRolesUseCase {
    private final IRoleRepository roleRepository;

    public List<Role> execute() {
        return roleRepository.findAll();
    }
}