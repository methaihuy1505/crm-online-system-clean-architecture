package com.vti.crm.application.usecases.user;

import com.vti.crm.domain.model.User;
import com.vti.crm.domain.repository.IBranchRepository;
import com.vti.crm.domain.repository.IRoleRepository;
import com.vti.crm.domain.repository.ITeamRepository;
import com.vti.crm.domain.repository.IUserRepository;
import com.vti.crm.interfaces.dto.response.user.UserResponse;
import com.vti.crm.interfaces.mapper.UserWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetUserByIdUseCase {
    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final IBranchRepository branchRepository;
    private final ITeamRepository teamRepository;
    private final UserWebMapper userMapper;

    public UserResponse execute(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại với id: " + id));

        String roleName = user.getRoleId() != null ?
                roleRepository.findById(user.getRoleId()).map(r -> r.getRoleName()).orElse(null) : null;

        String branchName = user.getBranchId() != null ?
                branchRepository.findById(user.getBranchId()).map(b -> b.getName()).orElse(null) : null;

        String teamName = user.getTeamId() != null ?
                teamRepository.findById(user.getTeamId()).map(t -> t.getName()).orElse(null) : null;

        // 3. Map sang UserResponse đầy đủ
        return userMapper.toResponse(user, roleName, branchName, teamName);
    }
}