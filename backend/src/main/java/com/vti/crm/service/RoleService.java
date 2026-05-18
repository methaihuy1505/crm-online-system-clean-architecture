package com.vti.crm.service;

import com.vti.crm.dto.request.RoleCreationRequest;
import com.vti.crm.dto.request.RoleUpdateRequest;
import com.vti.crm.dto.request.UserCreationRequest;
import com.vti.crm.dto.request.UserUpdateRequest;
import com.vti.crm.dto.response.RoleResponse;
import com.vti.crm.dto.response.UserResponse;
import com.vti.crm.entity.Role;
import com.vti.crm.entity.User;
import com.vti.crm.exception.AppException;
import com.vti.crm.exception.ErrorCode;
import com.vti.crm.mapper.RoleMapper;
import com.vti.crm.repository.RoleRepository;
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
public class RoleService {
    RoleRepository roleRepository;
    RoleMapper roleMapper;

    public RoleResponse createRole(RoleCreationRequest request) {
        log.info("add here");
        if(roleRepository.existsByRoleName(request.getRoleName()))
            throw new AppException(ErrorCode.USER_EXISTS);
        Role role = roleMapper.toRole(request);
        log.info(role.getRoleName());
        return roleMapper.roleResponse(roleRepository.save(role)) ;
    }
    public RoleResponse updateRole(int roleId, RoleUpdateRequest Request) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        roleMapper.updateRole(role, Request);
        return roleMapper.roleResponse(roleRepository.save(role));
    }
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream().map(roleMapper::roleResponse).toList();
    }
    public RoleResponse getrole(int roleId) {
        return roleMapper.roleResponse(roleRepository.findById(roleId).orElseThrow(() -> new RuntimeException("User not found")));
    }
    public void deleteRole(int roleId) {
        roleRepository.deleteById(roleId);
    }
}
