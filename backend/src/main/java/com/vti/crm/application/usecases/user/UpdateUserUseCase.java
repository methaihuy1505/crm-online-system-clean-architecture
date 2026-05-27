package com.vti.crm.application.usecases.user;

import com.vti.crm.domain.model.User;
import com.vti.crm.domain.repository.IUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdateUserUseCase {
    private final IUserRepository userRepository;

    @Transactional
    public User execute(Integer id, String fullName, String email, String phone, User.Status status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại với id: " + id));

        // Kiểm tra email đã bị sử dụng bởi user khác không
        if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }

        // Username không được update (immutable)
        user.update(fullName, email, phone, status);
        return userRepository.save(user);
    }
}
