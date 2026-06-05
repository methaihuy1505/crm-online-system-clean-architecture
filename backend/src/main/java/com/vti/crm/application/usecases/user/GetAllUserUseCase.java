package com.vti.crm.application.usecases.user;

import com.vti.crm.domain.model.Branch;
import com.vti.crm.domain.model.Role;
import com.vti.crm.domain.model.Team;
import com.vti.crm.domain.model.User;
import com.vti.crm.domain.model.UserFilter;
import com.vti.crm.domain.repository.IBranchRepository;
import com.vti.crm.domain.repository.IRoleRepository;
import com.vti.crm.domain.repository.ITeamRepository;
import com.vti.crm.domain.repository.IUserRepository;
import com.vti.crm.interfaces.dto.request.user.UserFilterRequest;
import com.vti.crm.interfaces.dto.response.user.UserResponse;
import com.vti.crm.interfaces.mapper.UserWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetAllUserUseCase {
    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final IBranchRepository branchRepository;
    private final ITeamRepository teamRepository;
    private final UserWebMapper userMapper;

    public Page<UserResponse> executeWithFilter(Pageable pageable, UserFilterRequest request) {
        UserFilter domainFilter = UserFilter.builder()
                .keyword(request.getKeyword())
                .status(request.getStatus())
                .roleId(request.getRoleId())
                .branchIds(request.getBranchIds()) // Pass List
                .teamIds(request.getTeamIds())     // Pass List
                .build();

        // 1. Lấy trang User (chỉ tốn 1 Query)
        Page<User> usersPage = userRepository.findAll(pageable, domainFilter);

        if (usersPage.isEmpty()) {
            return usersPage.map(user -> userMapper.toResponse(user, null, null, null));
        }

        // 2. FIX N+1 QUERY: Trích xuất toàn bộ các ID tham chiếu có trong trang này
        List<Integer> roleIds = usersPage.stream().map(User::getRoleId).filter(Objects::nonNull).distinct().collect(Collectors.toList());
        List<Integer> branchIds = usersPage.stream().map(User::getBranchId).filter(Objects::nonNull).distinct().collect(Collectors.toList());
        List<Integer> teamIds = usersPage.stream().map(User::getTeamId).filter(Objects::nonNull).distinct().collect(Collectors.toList());

        // 3. Truy vấn tất cả bằng 1 lệnh SQL duy nhất cho mỗi bảng và đưa vào Map (RAM)
        Map<Integer, String> roleMap = roleRepository.findAllById(roleIds).stream()
                .collect(Collectors.toMap(Role::getId, Role::getRoleName, (v1, v2) -> v1));

        Map<Integer, String> branchMap = branchRepository.findAllById(branchIds).stream()
                .collect(Collectors.toMap(Branch::getId, Branch::getName, (v1, v2) -> v1));

        Map<Integer, String> teamMap = teamRepository.findAllById(teamIds).stream()
                .collect(Collectors.toMap(Team::getId, Team::getName, (v1, v2) -> v1));

        // 4. Map dữ liệu trên RAM (Không phát sinh thêm bất kỳ câu Query nào)
        return usersPage.map(user -> {
            String roleName = user.getRoleId() != null ? roleMap.get(user.getRoleId()) : null;
            String branchName = user.getBranchId() != null ? branchMap.get(user.getBranchId()) : null;
            String teamName = user.getTeamId() != null ? teamMap.get(user.getTeamId()) : null;

            return userMapper.toResponse(user, roleName, branchName, teamName);
        });
    }
}