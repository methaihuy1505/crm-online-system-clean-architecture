package com.vti.crm.infrastructure.security;

import com.vti.crm.application.ports.IPasswordHasher;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BCryptPasswordHasherAdapter implements IPasswordHasher {

    private final PasswordEncoder passwordEncoder;

    @Override
    public boolean matches(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}