package com.vti.crm.application.usecases.auth;

import com.vti.crm.application.ports.IPasswordHasher;
import com.vti.crm.application.ports.ITokenProvider;
import com.vti.crm.domain.model.User;
import com.vti.crm.domain.repository.IPermissionRepository;
import com.vti.crm.domain.repository.IUserRepository;
import com.vti.crm.interfaces.dto.response.auth.AuthResponse;
import com.vti.crm.interfaces.mapper.UserWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoginUseCase {

    private final IUserRepository userRepository;
    private final IPasswordHasher passwordHasher;
    private final ITokenProvider tokenProvider;
    private final UserWebMapper userMapper;
    private final IPermissionRepository permissionRepository;

    public AuthResponse execute(String username, String rawPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Tên đăng nhập hoặc mật khẩu không chính xác"));

        if (!user.isActive()) {
            throw new IllegalArgumentException("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.");
        }

        if (!passwordHasher.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Tên đăng nhập hoặc mật khẩu không chính xác");
        }

        List<String> permissions = permissionRepository.findPermissionCodesByRoleId(user.getRoleId());

        String token = tokenProvider.generateToken(user, permissions);

        var userResponse = userMapper.toResponse(user, null, null, null);

        return new AuthResponse(token, userResponse, permissions);
    }
}