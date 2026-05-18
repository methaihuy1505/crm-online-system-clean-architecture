package com.vti.crm.application.usecases.user;
import com.vti.crm.domain.model.User;
import com.vti.crm.domain.model.UserStatus;
import com.vti.crm.domain.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CreateUserUseCase {
    private final IUserRepository repository;

    public void execute(String username, String password, String fullName, String email, String phone, UserStatus status, LocalDateTime createdAt) {
        User user = new User(username,password,fullName, email, phone,status,createdAt);
        repository.save(user);
    }
}
