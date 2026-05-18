package com.vti.crm.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.security.Timestamp;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String username;
    String password;
    String full_name;
    String email;
    String phone;



    @ManyToOne
    @JoinColumn(name = "role_id") // 👈 cột FK trong DB
    Role role;






    @Enumerated(EnumType.STRING)
    EnumStatus status;

    Timestamp created_at;

}
