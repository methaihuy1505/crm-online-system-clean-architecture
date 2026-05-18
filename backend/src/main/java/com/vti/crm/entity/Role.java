package com.vti.crm.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.security.Timestamp;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    @Column(name = "role_name")
    String roleName;
    String code;
    String description;
    Boolean is_active;
    Timestamp created_at;
    Timestamp updated_at;

    @OneToMany(mappedBy = "role")
    List<User> users;
}
