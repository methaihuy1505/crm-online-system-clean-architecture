package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.user.*;
import com.vti.crm.domain.model.User;
import com.vti.crm.interfaces.dto.request.ChangePasswordRequest;
import com.vti.crm.interfaces.dto.request.ChangeUserStatusRequest;
import com.vti.crm.interfaces.dto.request.UserCreateRequest;
import com.vti.crm.interfaces.dto.request.UserUpdateRequest;
import com.vti.crm.interfaces.dto.response.UserResponseDTO;
import com.vti.crm.interfaces.mapper.UserWebMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final CreateUserUseCase createUserUseCase;
    private final GetUserUseCase getUserUseCase;
    private final UpdateUserUseCase updateUserUseCase;
    private final DeleteUserUseCase deleteUserUseCase;
    private final ChangeUserStatusUseCase changeUserStatusUseCase;
    private final ChangePasswordUseCase changePasswordUseCase;
    private final UserWebMapper userWebMapper;

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody UserCreateRequest request) {
        createUserUseCase.execute(
                request.getUsername(),
                request.getPassword(),
                request.getFullName(),
                request.getEmail(),
                request.getPhone(),
                null,
                null
        );
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAll() {
        List<UserResponseDTO> response = getUserUseCase.executeGetAll()
                .stream()
                .map(userWebMapper::toResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getById(@PathVariable Long id) {
        User user = getUserUseCase.executeGetById(id);
        return ResponseEntity.ok(userWebMapper.toResponse(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request
    ) {
        updateUserUseCase.execute(
                id,
                request.getFullName(),
                request.getEmail(),
                request.getPhone()
        );
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> changeStatus(
            @PathVariable Long id,
            @Valid @RequestBody ChangeUserStatusRequest request
    ) {
        changeUserStatusUseCase.execute(id, request.getStatus());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable Long id,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        changePasswordUseCase.execute(id, request.getNewPassword());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deleteUserUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
