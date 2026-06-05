package com.vti.crm.application.ports;

import com.vti.crm.domain.model.User;

import java.util.List;

public interface ITokenProvider {
    String generateToken(User user, List<String> permissions);
}