package com.vti.crm.application.usecases.user;

import com.vti.crm.domain.repository.IUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteUserUseCase {
    private final IUserRepository userRepository;

    @Transactional
    public void execute(Integer id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại với id: " + id));
        userRepository.delete(user);
    }
}
