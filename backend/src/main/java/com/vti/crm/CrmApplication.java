package com.vti.crm;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class CrmApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrmApplication.class, args);
	}

}
