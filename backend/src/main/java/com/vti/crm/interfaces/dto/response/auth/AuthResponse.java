package com.vti.crm.interfaces.dto.response.auth;

import com.vti.crm.interfaces.dto.response.user.UserResponse; // Import class sẵn có
import lombok.Data;

import java.util.List;

@Data
public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private UserResponse user;
    private List<String> permissions;
    public AuthResponse(String token, UserResponse user, List<String> permissions) {
        this.token = token;
        this.user = user;
        this.permissions = permissions;
    }
}