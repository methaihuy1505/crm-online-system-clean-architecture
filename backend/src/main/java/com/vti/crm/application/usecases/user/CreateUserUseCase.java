package com.vti.crm.application.usecases.user;

import com.vti.crm.domain.model.User;
import com.vti.crm.domain.repository.IUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder; // Thêm import này
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateUserUseCase {
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Bơm công cụ mã hóa vào

    @Transactional
    public User execute(String username, String fullName, String password, String email, String phone, Integer roleId, Integer branchId, Integer teamId) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại");
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }

        String encodedPassword = passwordEncoder.encode(password);

        User user = new User(username, fullName, encodedPassword, email, phone, roleId, branchId, teamId);

        return userRepository.save(user);
    }
}