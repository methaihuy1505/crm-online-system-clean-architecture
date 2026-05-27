package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.User;
import com.vti.crm.interfaces.dto.request.user.UserFilterRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface IUserRepository {
    User save(User user);
    Optional<User> findById(Integer id);
    Page<User> findAll(Pageable pageable);
    Page<User> findAll(Pageable pageable, UserFilterRequest filter);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    void delete(User user);
}

