package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.user.*;
import com.vti.crm.interfaces.dto.request.user.ChangePasswordRequest;
import com.vti.crm.interfaces.dto.request.user.CreateUserRequest;
import com.vti.crm.interfaces.dto.request.user.UpdateUserRequest;
import com.vti.crm.interfaces.dto.response.user.UserResponse;
import com.vti.crm.interfaces.mapper.UserWebMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final CreateUserUseCase createUserUseCase;
    private final UpdateUserUseCase updateUserUseCase;
    private final GetAllUserUseCase getAllUserUseCase;
    private final GetUserByIdUseCase getUserByIdUseCase;
    private final ChangePasswordUseCase changePasswordUseCase;
    private final DeleteUserUseCase deleteUserUseCase;
    private final UserWebMapper userMapper;

    @PostMapping
    @PreAuthorize("hasAuthority('users.create')")
    public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest request) {
        var userDomain = userMapper.toDomain(request);
        var user = createUserUseCase.execute(
                userDomain.getUsername(),
                userDomain.getFullName(),
                userDomain.getPassword(),
                userDomain.getEmail(),
                userDomain.getPhone(),
                userDomain.getRoleId(),
                userDomain.getBranchId(),
                userDomain.getTeamId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toResponse(user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('users.update')")
    public ResponseEntity<UserResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateUserRequest request) {

        // Truyền đầy đủ các thông tin tổ chức từ request vào UseCase
        var user = updateUserUseCase.execute(
                id,
                request.getFullName(),
                request.getEmail(),
                request.getPhone(),
                request.getStatus(),
                request.getRoleId(),
                request.getBranchId(),
                request.getTeamId()
        );
        return ResponseEntity.ok(userMapper.toResponse(user));
    }

    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAll(
            @PageableDefault(size = 10, page = 0, sort = "id", direction = Sort.Direction.ASC) Pageable pageable,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer roleId,
            @RequestParam(required = false) List<Integer> branchIds, // Đổi thành List
            @RequestParam(required = false) List<Integer> teamIds) { // Đổi thành List

        var filter = new com.vti.crm.interfaces.dto.request.user.UserFilterRequest();
        filter.setKeyword(keyword);
        if (status != null && !status.isEmpty()) {
            try {
                filter.setStatus(com.vti.crm.domain.model.User.Status.valueOf(status.toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Status không hợp lệ. Giá trị phải là: ACTIVE hoặc INACTIVE");
            }
        }
        filter.setRoleId(roleId);
        filter.setBranchIds(branchIds); // Set List vào DTO (Nhớ update UserFilterRequest và UserFilter domain nhé)
        filter.setTeamIds(teamIds);     // Set List vào DTO

        Page<UserResponse> userPage = getAllUserUseCase.executeWithFilter(pageable, filter);
        return ResponseEntity.ok(userPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Integer id) {
        UserResponse userResponse = getUserByIdUseCase.execute(id);
        return ResponseEntity.ok(userResponse);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('users.delete')")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        deleteUserUseCase.execute(id);
        return ResponseEntity.ok("User đã được xóa thành công");
    }

    @PutMapping("/{id}/change-password")
    @PreAuthorize("hasAuthority('users.change_password')")
    public ResponseEntity<String> changePassword(
            @PathVariable Integer id,
            @Valid @RequestBody ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Mật khẩu xác nhận không khớp");
        }
        changePasswordUseCase.execute(id, request.getNewPassword());
        return ResponseEntity.ok("Mật khẩu đã được thay đổi thành công");
    }
}
