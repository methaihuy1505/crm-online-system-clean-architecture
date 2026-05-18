package com.vti.crm.application.usecases.user;

import com.vti.crm.domain.model.User;
import com.vti.crm.domain.model.UserStatus;
import com.vti.crm.domain.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UpdateUserUseCase {
    private final IUserRepository repository;

    public void execute(Long id,String fullName, String email, String phone) {
        User user = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user với id: " + id));
        user.update(fullName, email, phone);
        repository.save(user);
    }
}
