package com.vti.crm.infrastructure.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/v1/**") // Chỉ định path áp dụng CORS
                .allowedOrigins("http://localhost:5173") // Domain của Frontend (Vite)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Các method cho phép
                .allowedHeaders("*") // Cho phép tất cả các header (Content-Type, Authorization, v.v.)
                .allowCredentials(true) // Cho phép gửi Cookie hoặc thông tin Auth nếu cần
                .maxAge(3600); // Cache cấu hình CORS trong 1 giờ
    }
}