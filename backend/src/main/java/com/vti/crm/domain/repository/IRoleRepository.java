package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Role;
import java.util.List;
import java.util.Optional;

public interface IRoleRepository {
    List<Role> findAll();
    Optional<Role> findById(Integer id);
    Role save(Role role);
    void deleteById(Integer id);
    List<Role> findAllById(List<Integer> ids);
}