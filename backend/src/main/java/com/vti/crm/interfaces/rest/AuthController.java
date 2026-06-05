package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.auth.LoginUseCase;
import com.vti.crm.interfaces.dto.request.auth.LoginRequest;
import com.vti.crm.interfaces.dto.response.auth.AuthResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final LoginUseCase loginUseCase;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = loginUseCase.execute(request.getUsername(), request.getPassword());

        return ResponseEntity.ok(response);
    }
}