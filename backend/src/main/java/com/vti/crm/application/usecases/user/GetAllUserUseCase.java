package com.vti.crm.application.usecases.user;

import com.vti.crm.domain.model.User;
import com.vti.crm.domain.repository.IUserRepository;
import com.vti.crm.interfaces.dto.request.user.UserFilterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetAllUserUseCase {
    private final IUserRepository userRepository;

    public Page<User> execute(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public Page<User> executeWithFilter(Pageable pageable, UserFilterRequest filter) {
        return userRepository.findAll(pageable, filter);
    }
}
