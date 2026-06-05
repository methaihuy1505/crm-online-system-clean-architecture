package com.vti.crm.application.ports;

public interface IPasswordHasher {
    boolean matches(String rawPassword, String encodedPassword);
}