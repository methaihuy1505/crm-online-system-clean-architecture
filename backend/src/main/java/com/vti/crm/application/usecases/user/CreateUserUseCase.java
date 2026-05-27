package com.vti.crm.application.usecases.user;

import com.vti.crm.domain.model.User;
import com.vti.crm.domain.repository.IUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateUserUseCase {
    private final IUserRepository userRepository;

    @Transactional
    public User execute(String username, String fullName, String password, String email, String phone, Integer roleId, Integer branchId, Integer teamId) {
        // Kiểm tra username đã tồn tại chưa
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại");
        }

        // Kiểm tra email đã tồn tại chưa
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }

        // Tạo User mới (Entity tự validate trong Constructor)
        User user = new User(username, fullName, password, email, phone, roleId, branchId,teamId);

        // Lưu xuống DB
        return userRepository.save(user);
    }

}
