package com.vti.crm.application.usecases.user;

import com.vti.crm.domain.model.User;
import com.vti.crm.domain.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetUserByIdUseCase {
    private final IUserRepository userRepository;

    public Optional<User> execute(Integer id) {
        return userRepository.findById(id);
    }
}

