package com.vti.crm.application.usecases.user;

import com.vti.crm.domain.model.User;
import com.vti.crm.domain.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetUserUseCase {
    private final IUserRepository repository;

    public List<User> executeGetAll() {
        return repository.findAll();
    }

    public User executeGetById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user với id: " + id));
    }
}
