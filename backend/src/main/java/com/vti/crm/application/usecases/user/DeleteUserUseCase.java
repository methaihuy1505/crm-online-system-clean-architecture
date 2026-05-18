package com.vti.crm.application.usecases.user;

import com.vti.crm.domain.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteUserUseCase {
    private final IUserRepository repository;
    public void execute(Long id) {
        repository.deleteById(id);
    }
}
