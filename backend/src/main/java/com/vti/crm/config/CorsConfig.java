package com.vti.crm.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Mở khóa cho tất cả các endpoint (VD: /api/v1/leads, /api/v1/users...)
                .allowedOrigins("http://localhost:5173") // Cho phép Frontend từ cổng này
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Cho phép các phương thức này
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}